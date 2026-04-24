FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY backend/pac-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/shared/ ./backend/shared/
COPY backend/pac-service/ ./backend/pac-service/

RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8002

CMD ["uvicorn", "backend.pac_service.main:app", "--host", "0.0.0.0", "--port", "8002"]
