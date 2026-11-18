from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import re

from app.services.log_analyzer import analyze_log


router = APIRouter(
    prefix="/upload",
    tags=["Upload Logs"]
)


# ============================================================
# Upload configuration
# ============================================================

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)

MAX_FILE_SIZE = 7 * 1024 * 1024  # 7 MB

ALLOWED_EXTENSIONS = {
    ".log",
    ".txt",
    ".csv",
    ".json",
    ".evtx",
}


# ============================================================
# Upload endpoint
# ============================================================

@router.post("/")
async def upload_log(file: UploadFile = File(...)):

    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename was provided."
        )

    original_filename = Path(file.filename).name
    extension = Path(original_filename).suffix.lower()

    # --------------------------------------------------------
    # Validate file extension
    # --------------------------------------------------------

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed formats: .log, .txt, .csv, .json, .evtx"
            )
        )

    # --------------------------------------------------------
    # Sanitize filename
    # --------------------------------------------------------

    safe_filename = re.sub(
        r"[^a-zA-Z0-9._-]",
        "_",
        original_filename
    )

    destination = UPLOAD_FOLDER / safe_filename

    # --------------------------------------------------------
    # Save file while checking the 7 MB limit
    # --------------------------------------------------------

    total_size = 0

    try:

        with destination.open("wb") as buffer:

            while True:

                chunk = await file.read(1024 * 1024)  # 1 MB

                if not chunk:
                    break

                total_size += len(chunk)

                # Prevent files larger than 7 MB
                if total_size > MAX_FILE_SIZE:

                    buffer.close()

                    if destination.exists():
                        destination.unlink()

                    raise HTTPException(
                        status_code=413,
                        detail=(
                            "File is too large. "
                            "SOC Buddy AI accepts files up to 7 MB."
                        )
                    )

                buffer.write(chunk)

    except HTTPException:
        raise

    except Exception as error:

        if destination.exists():
            destination.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded file: {str(error)}"
        )

    finally:
        await file.close()

    # --------------------------------------------------------
    # Read uploaded log
    # --------------------------------------------------------

    try:

        log_text = destination.read_text(
            encoding="utf-8",
            errors="ignore"
        )

    except Exception as error:

        if destination.exists():
            destination.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Unable to read uploaded log file: {str(error)}"
        )

    # --------------------------------------------------------
    # Make sure the file actually contains data
    # --------------------------------------------------------

    if not log_text.strip():

        raise HTTPException(
            status_code=400,
            detail="The uploaded log file is empty."
        )

    # --------------------------------------------------------
    # Analyze with Ollama
    # --------------------------------------------------------

    try:

        analysis = analyze_log(log_text)

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Log analysis failed: {str(error)}"
        )

    # --------------------------------------------------------
    # Return investigation
    # --------------------------------------------------------

    return {
    "message": "Upload and analysis successful",
    "filename": safe_filename,
    "size_bytes": total_size,
    "size_mb": round(total_size / (1024 * 1024), 2),
    "log_preview": log_text[:3000],
    "analysis": analysis
}