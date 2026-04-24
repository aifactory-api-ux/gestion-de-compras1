import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

os.environ['JWT_SECRET'] = 'testsecret'
os.environ['POSTGRES_HOST'] = 'localhost'
os.environ['POSTGRES_DB'] = 'test_db'
os.environ['REDIS_HOST'] = 'localhost'

import pytest
from unittest.mock import MagicMock, patch
from datetime import timedelta
from fastapi.testclient import TestClient

import main
import service
import routes


client = TestClient(main.app)


class TestHashPassword:
    def test_hash_password_returns_hex_string(self):
        result = service.hash_password("testpassword")
        assert isinstance(result, str)
        assert len(result) == 64

    def test_hash_password_consistent(self):
        pwd = "mysecurepassword"
        h1 = service.hash_password(pwd)
        h2 = service.hash_password(pwd)
        assert h1 == h2

    def test_hash_password_different_passwords(self):
        h1 = service.hash_password("password1")
        h2 = service.hash_password("password2")
        assert h1 != h2


class TestVerifyPassword:
    def test_verify_password_correct(self):
        pwd = "testpassword"
        hashed = service.hash_password(pwd)
        assert service.verify_password(pwd, hashed) is True

    def test_verify_password_incorrect(self):
        hashed = service.hash_password("correctpassword")
        assert service.verify_password("wrongpassword", hashed) is False

    def test_verify_password_empty(self):
        hashed = service.hash_password("password")
        assert service.verify_password("", hashed) is False


class TestCreateAccessToken:
    def test_create_token_with_expiry(self):
        data = {"sub": "123", "email": "test@example.com"}
        token = service.create_access_token(data, expires_delta=timedelta(minutes=30))
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_token_default_expiry(self):
        data = {"sub": "456"}
        token = service.create_access_token(data)
        assert isinstance(token, str)

    def test_decode_token_valid(self):
        data = {"sub": "789", "email": "user@test.com"}
        token = service.create_access_token(data, expires_delta=timedelta(hours=1))
        decoded = service.decode_token(token)
        assert decoded["sub"] == "789"
        assert decoded["email"] == "user@test.com"

    def test_decode_token_invalid(self):
        with pytest.raises(Exception):
            service.decode_token("invalid.token.here")


class TestHealthEndpoint:
    def test_health_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "auth-service"


class TestLoginEndpoint:
    def test_login_returns_401_for_nonexistent_user(self):
        with patch('service.get_db_session') as mock_db:
            mock_session = MagicMock()
            mock_session.query.return_value.filter.return_value.first.return_value = None
            mock_db.return_value = iter([mock_session])

            response = client.post("/auth/login", json={
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            })
            assert response.status_code == 401

    def test_login_returns_422_for_invalid_email(self):
        response = client.post("/auth/login", json={
            "email": "not-an-email",
            "password": "password123"
        })
        assert response.status_code == 422

    def test_login_returns_422_for_missing_fields(self):
        response = client.post("/auth/login", json={})
        assert response.status_code == 422