#!/bin/bash
set -e

echo "========================================="
echo "  Gestión de Compras - Startup Script"
echo "========================================="

command -v docker >/dev/null 2>&1 || {
    echo "Docker is not installed. Please install Docker first."
    exit 1
}

command -v docker-compose >/dev/null 2>&1 || {
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

echo "Building and starting services..."

docker-compose build
docker-compose up -d

echo "Waiting for services to be healthy..."

sleep 10

AUTH_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/health 2>/dev/null || echo "000")
PAC_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8002/health 2>/dev/null || echo "000")

echo "Auth Service health: $AUTH_HEALTH"
echo "PAC Service health: $PAC_HEALTH"

if [ "$AUTH_HEALTH" = "200" ] && [ "$PAC_HEALTH" = "200" ]; then
    echo ""
    echo "========================================="
    echo "  All services are healthy!"
    echo "========================================="
    echo "Access the application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Auth Service: http://localhost:8001"
    echo "  PAC Service: http://localhost:8002"
else
    echo ""
    echo "Warning: Some services may not be fully healthy yet."
    echo "Check status with: docker-compose ps"
fi
