"""Create password reset tokens

Revision ID: bc06d6913d50
Revises: 99eefcd3d43f
Create Date: 2026-08-13
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "bc06d6913d50"
down_revision: Union[str, Sequence[str], None] = "99eefcd3d43f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create password reset tokens table."""

    op.create_table(
        "password_reset_tokens",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "token",
            sa.String(length=255),
            nullable=False
        ),

        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE"
        ),

        sa.PrimaryKeyConstraint("id")
    )

    op.create_index(
        "ix_password_reset_tokens_id",
        "password_reset_tokens",
        ["id"],
        unique=False
    )

    op.create_index(
        "ix_password_reset_tokens_token",
        "password_reset_tokens",
        ["token"],
        unique=True
    )

    op.create_index(
        "ix_password_reset_tokens_user_id",
        "password_reset_tokens",
        ["user_id"],
        unique=False
    )


def downgrade() -> None:
    """Remove password reset tokens table."""

    op.drop_index(
        "ix_password_reset_tokens_user_id",
        table_name="password_reset_tokens"
    )

    op.drop_index(
        "ix_password_reset_tokens_token",
        table_name="password_reset_tokens"
    )

    op.drop_index(
        "ix_password_reset_tokens_id",
        table_name="password_reset_tokens"
    )

    op.drop_table("password_reset_tokens")