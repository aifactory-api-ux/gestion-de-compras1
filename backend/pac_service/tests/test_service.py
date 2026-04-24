import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

os.environ['JWT_SECRET'] = 'testsecret'
os.environ['POSTGRES_HOST'] = 'localhost'
os.environ['POSTGRES_DB'] = 'test_db'
os.environ['REDIS_HOST'] = 'localhost'

import pytest
from unittest.mock import MagicMock, patch
from decimal import Decimal
from datetime import date

import service
from backend.shared import models


class TestPACServiceUnit:
    def test_create_pac_returns_id(self):
        mock_session = MagicMock()
        mock_pac = MagicMock()
        mock_pac.id = 1
        mock_session.add = MagicMock()
        mock_session.commit = MagicMock()
        mock_session.refresh = MagicMock(side_effect=lambda x: setattr(x, 'id', 1))

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            pac_data = models.PACCreate(organismo_id=1, usuario_id=1, nombre="Test PAC")
            result = service.PACService().create_pac(pac_data)
            assert result == 1
            mock_session.add.assert_called_once()
            mock_session.commit.assert_called_once()

    def test_get_pac_returns_none_for_nonexistent(self):
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.first.return_value = None

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            result = service.PACService().get_pac(9999)
            assert result is None

    def test_get_all_pac_returns_list(self):
        mock_session = MagicMock()
        mock_session.query.return_value.all.return_value = []

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            result = service.PACService().get_all_pac()
            assert isinstance(result, list)

    def test_publicar_pac_raises_error_for_nonexistent(self):
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.first.return_value = None

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            with pytest.raises(ValueError, match="PAC not found"):
                service.PACService().publicar_pac(models.PACPublicarRequest(pac_id=9999, firma="test"))


class TestRequerimientoService:
    def test_get_requerimiento_returns_none(self):
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.first.return_value = None

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            result = service.PACService().get_requerimiento(9999)
            assert result is None

    def test_get_requerimientos_by_pac_returns_list(self):
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.all.return_value = []

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            result = service.PACService().get_requerimientos_by_pac(1)
            assert isinstance(result, list)


class TestItemService:
    def test_get_item_returns_none(self):
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.first.return_value = None

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            result = service.PACService().get_item(9999)
            assert result is None

    def test_get_items_by_requerimiento_returns_list(self):
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.all.return_value = []

        with patch('service.get_db_session') as mock_db:
            mock_db.return_value = iter([mock_session])
            result = service.PACService().get_items_by_requerimiento(1)
            assert isinstance(result, list)