from typing import List, Optional
from decimal import Decimal
from datetime import date

from backend.shared.db import get_db_session, get_redis_client
from backend.shared import models
from backend.shared.models import PACCreate, RequerimientoCreate, ItemCreate, PACPublicarRequest


class PACService:
    def create_pac(self, pac_data: PACCreate) -> int:
        for db in get_db_session():
            nuevo_pac = models.PAC(
                organismo_id=pac_data.organismo_id,
                usuario_id=pac_data.usuario_id,
                nombre=pac_data.nombre,
                fecha_creacion=date.today(),
                estado="borrador"
            )
            db.add(nuevo_pac)
            db.commit()
            db.refresh(nuevo_pac)
            return nuevo_pac.id

    def get_pac(self, pac_id: int) -> Optional[models.PAC]:
        for db in get_db_session():
            return db.query(models.PAC).filter(models.PAC.id == pac_id).first()

    def get_all_pac(self) -> List[models.PAC]:
        for db in get_db_session():
            return db.query(models.PAC).all()

    def publicar_pac(self, request: PACPublicarRequest) -> models.PACPublicarResponse:
        for db in get_db_session():
            pac = db.query(models.PAC).filter(models.PAC.id == request.pac_id).first()
            if not pac:
                raise ValueError("PAC not found")

            pac.estado = "publicado"
            db.commit()

            version = models.VersionPAC(
                pac_id=pac.id,
                version=1,
                fecha=date.today(),
                cambios="Publicación inicial"
            )
            db.add(version)
            db.commit()

            return models.PACPublicarResponse(pac_id=pac.id, estado=pac.estado)

    def create_requerimiento(self, req_data: RequerimientoCreate) -> int:
        for db in get_db_session():
            nuevo_req = models.Requerimiento(
                pac_id=req_data.pac_id,
                descripcion=req_data.descripcion,
                monto_estimado=req_data.monto_estimado,
                moneda=req_data.moneda
            )
            db.add(nuevo_req)
            db.commit()
            db.refresh(nuevo_req)
            return nuevo_req.id

    def get_requerimiento(self, req_id: int) -> Optional[models.Requerimiento]:
        for db in get_db_session():
            return db.query(models.Requerimiento).filter(models.Requerimiento.id == req_id).first()

    def get_requerimientos_by_pac(self, pac_id: int) -> List[models.Requerimiento]:
        for db in get_db_session():
            return db.query(models.Requerimiento).filter(models.Requerimiento.pac_id == pac_id).all()

    def create_item(self, item_data: ItemCreate) -> int:
        for db in get_db_session():
            nuevo_item = models.Item(
                requerimiento_id=item_data.requerimiento_id,
                codigo=item_data.codigo,
                descripcion=item_data.descripcion,
                cantidad=item_data.cantidad,
                precio_unitario=item_data.precio_unitario
            )
            db.add(nuevo_item)
            db.commit()
            db.refresh(nuevo_item)
            return nuevo_item.id

    def get_item(self, item_id: int) -> Optional[models.Item]:
        for db in get_db_session():
            return db.query(models.Item).filter(models.Item.id == item_id).first()

    def get_items_by_requerimiento(self, requerimiento_id: int) -> List[models.Item]:
        for db in get_db_session():
            return db.query(models.Item).filter(models.Item.requerimiento_id == requerimiento_id).all()

    def get_versiones_pac(self, pac_id: int) -> List[models.VersionPAC]:
        for db in get_db_session():
            return db.query(models.VersionPAC).filter(models.VersionPAC.pac_id == pac_id).order_by(models.VersionPAC.version.desc()).all()

    def get_ordenes_pac(self, pac_id: int) -> List[models.OrdenCompra]:
        for db in get_db_session():
            return db.query(models.OrdenCompra).filter(models.OrdenCompra.pac_id == pac_id).all()


def get_pac_service() -> PACService:
    return PACService()
