@echo off
setlocal

echo [TideVault] Starting Coastal Intelligence System...

:: Starting Backend
echo [TideVault] Starting FastAPI Backend on port 8000...
start "TideVault Backend" cmd /c "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

:: Starting Frontend
echo [TideVault] Starting Vite Frontend on port 5173...
start "TideVault Frontend" cmd /c "cd frontend && npm install && npm run dev"

echo.
echo ======================================================
echo  SYSTEM INITIALIZED
echo  Browser: http://localhost:5173
echo  API Documentation: http://localhost:8000/docs
echo ======================================================
echo.
pause
