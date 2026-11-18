import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
)

router = APIRouter(
    prefix="/auth",
    tags=["Password Reset"],
)


@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Generate a password-reset token for an existing user.

    In a production system, this token should be sent by email.
    For local development, we return the token directly so
    the complete flow can be tested through Swagger.
    """

    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    # Don't reveal whether an email exists.
    if not user:
        return {
            "message": "If the account exists, a password reset request has been created.",
            "reset_token": None,
        }

    # Remove previous reset tokens for this user.
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id
    ).delete(
        synchronize_session=False
    )

    # Generate a secure random token.
    token = secrets.token_urlsafe(32)

    # Token expires after 30 minutes.
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=30
    )

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at,
    )

    db.add(reset_token)
    db.commit()

    return {
        "message": "Password reset token generated successfully.",
        "reset_token": token,
    }


@router.post(
    "/reset-password",
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Reset a user's password using a valid reset token.
    """

    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == request.token
        )
        .first()
    )

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password reset token.",
        )

    # Make sure the token hasn't expired.
    now = datetime.now(timezone.utc)

    expires_at = reset_token.expires_at

    # PostgreSQL normally returns an aware datetime,
    # but this also safely handles a naive datetime.
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at < now:
        db.delete(reset_token)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token has expired.",
        )

    user = (
        db.query(User)
        .filter(User.id == reset_token.user_id)
        .first()
    )

    if not user:
        db.delete(reset_token)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with this token was not found.",
        )

    # Update the password.
    user.password_hash = hash_password(
        request.new_password
    )

    # Reset tokens are single-use.
    db.delete(reset_token)

    db.commit()
    db.refresh(user)

    return {
        "message": "Password reset successfully. You can now log in with your new password.",
    }