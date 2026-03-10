#!/bin/bash

echo "------------------------------------------------------"
echo "  TideVault — Coastal Intelligence System"
echo "------------------------------------------------------"

# Trap to kill both processes on exit
trap "kill 0" EXIT

# Start Backend
echo "[1/2] Launching FastAPI Backend..."
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &
cd ..

# Start Frontend
echo "[2/2] Launching Vite Frontend..."
cd frontend
npm install
npm run dev &
cd ..

echo ""
echo "======================================================"
echo "  TideVault IS ACTIVE"
echo "  Frontend: http://localhost:5173"
echo "  Backend: http://localhost:8000"
echo "======================================================"
echo ""

# Wait for both processes
wait
