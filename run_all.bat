@echo off
echo ====================================================================
echo   GeoWatershed AI — SRISHTI-DRISHTI Edition (1-Click Launcher)
echo ====================================================================

echo [1/3] Launching FastAPI Backend on port 8000...
start "GeoWatershed Backend" cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat) && python -m uvicorn app.main:app --reload --port 8000"

echo [2/3] Launching React Vite Frontend on port 5173...
start "GeoWatershed Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/3] Waiting 4 seconds for servers to initialize...
timeout /t 4 >nul

start http://localhost:5173

echo.
echo ====================================================================
echo  System is running! 
echo  - Frontend: http://localhost:5173
echo  - Backend Docs: http://localhost:8000/docs
echo  Keep the two terminal windows open while testing.
echo ====================================================================
pause
