#!/bin/bash

echo "Starting Deepfake Detection Application..."
echo

echo "Starting Backend Server..."
cd flask-server && npm start &
BACKEND_PID=$!

echo "Waiting 5 seconds for backend to start..."
sleep 5

echo "Starting Frontend Server..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

