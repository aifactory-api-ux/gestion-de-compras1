from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.pac_service.routes import pac_router, requerimiento_router, item_router
from backend.shared.config import SERVICE_VERSION

app = FastAPI(title="PAC Service", version=SERVICE_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pac_router)
app.include_router(requerimiento_router)
app.include_router(item_router)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "pac-service",
        "version": SERVICE_VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
