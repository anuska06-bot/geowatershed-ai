@echo off
echo =========================================================
echo   Starting GeoWatershed AI (SRISHTI-DRISHTI) Backend API
echo =========================================================
cd /d "%~dp0backend"

if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
) else (
    echo [!] Virtual environment .venv not found. Using system python.
)

python -m uvicorn app.main:app --reload --port 8000
pause
