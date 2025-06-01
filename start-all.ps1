# Script to start both client and server

# Define paths
$ServerPath = ".\server"
$ClientPath = ".\client"

# Function to check if Node.js is installed
function Check-NodeJS {
    try {
        node --version
        return $true
    } catch {
        Write-Host "Node.js is not installed. Please install Node.js before running this script." -ForegroundColor Red
        return $false
    }
}

# Main execution
if (Check-NodeJS) {
    Write-Host "=== Starting 3D T-Shirt Designer Application ===" -ForegroundColor Cyan
    Write-Host ""

    # Start server in a new PowerShell window
    Write-Host "Starting server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServerPath'; npm start"

    # Give the server a moment to start
    Start-Sleep -Seconds 2

    # Start client in a new PowerShell window
    Write-Host "Starting client..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ClientPath'; npm run dev"

    Write-Host ""
    Write-Host "=== Application Started ===" -ForegroundColor Cyan
    Write-Host "Server running at: http://localhost:8080" -ForegroundColor Yellow
    Write-Host "Client running at: http://localhost:5173" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can close this window. The server and client will continue running in their own windows." -ForegroundColor White
}
