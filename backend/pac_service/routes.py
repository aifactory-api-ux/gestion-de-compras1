from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from backend.shared.models import (
    PAC,
    Requerimiento,
    Item,
    VersionPAC,
    OrdenCompra,
    PACCreate,
    RequerimientoCreate,
    ItemCreate,
    PACPublicarRequest,
    PACPublicarResponse,
)
from backend.pac_service.service import get_pac_service, PACService

router = APIRouter(prefix="/pac", tags=["pac"])

pac_router = APIRouter(tags=["pac"])
requerimiento_router = APIRouter(prefix="/requerimiento", tags=["requerimiento"])
item_router = APIRouter(prefix="/item", tags=["item"])


@pac_router.post("", response_model=dict)
def create_pac(pac_data: PACCreate, service: PACService = Depends(get_pac_service)):
    pac_id = service.create_pac(pac_data)
    return {"id": pac_id}


@pac_router.get("/{pac_id}", response_model=PAC)
def get_pac(pac_id: int, service: PACService = Depends(get_pac_service)):
    pac = service.get_pac(pac_id)
    if not pac:
        raise HTTPException(status_code=404, detail="PAC not found")
    return pac


@pac_router.get("", response_model=List[PAC])
def get_all_pac(service: PACService = Depends(get_pac_service)):
    return service.get_all_pac()


@pac_router.put("/publicar", response_model=PACPublicarResponse)
def publicar_pac(request: PACPublicarRequest, service: PACService = Depends(get_pac_service)):
    try:
        return service.publicar_pac(request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@pac_router.get("/{pac_id}/versiones", response_model=List[VersionPAC])
def get_versiones_pac(pac_id: int, service: PACService = Depends(get_pac_service)):
    return service.get_versiones_pac(pac_id)


@pac_router.get("/{pac_id}/ordenes", response_model=List[OrdenCompra])
def get_ordenes_pac(pac_id: int, service: PACService = Depends(get_pac_service)):
    return service.get_ordenes_pac(pac_id)


@requerimiento_router.post("", response_model=dict)
def create_requerimiento(req_data: RequerimientoCreate, service: PACService = Depends(get_pac_service)):
    req_id = service.create_requerimiento(req_data)
    return {"id": req_id}


@requerimiento_router.get("/{req_id}", response_model=Requerimiento)
def get_requerimiento(req_id: int, service: PACService = Depends(get_pac_service)):
    req = service.get_requerimiento(req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Requerimiento not found")
    return req


@requerimiento_router.get("", response_model=List[Requerimiento])
def get_requerimientos_by_pac(pac_id: int, service: PACService = Depends(get_pac_service)):
    return service.get_requerimientos_by_pac(pac_id)


@item_router.post("", response_model=dict)
def create_item(item_data: ItemCreate, service: PACService = Depends(get_pac_service)):
    item_id = service.create_item(item_data)
    return {"id": item_id}


@item_router.get("/{item_id}", response_model=Item)
def get_item(item_id: int, service: PACService = Depends(get_pac_service)):
    item = service.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@item_router.get("", response_model=List[Item])
def get_items_by_requerimiento(requerimiento_id: int, service: PACService = Depends(get_pac_service)):
    return service.get_items_by_requerimiento(requerimiento_id)
