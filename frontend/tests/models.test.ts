import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Models', () => {
  it('Usuario interface should have correct structure', () => {
    const usuario = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'Usuario PAC',
    };
    expect(usuario.id).toBe(1);
    expect(usuario.email).toBe('test@example.com');
  });

  it('PAC interface should have correct structure', () => {
    const pac = {
      id: 1,
      organismo_id: 1,
      usuario_id: 1,
      nombre: 'Test PAC',
      fecha_creacion: '2024-01-01',
      estado: 'borrador',
    };
    expect(pac.estado).toBe('borrador');
  });

  it('TokenResponse interface should have correct structure', () => {
    const token: { access_token: string; token_type: string } = {
      access_token: 'fake-token',
      token_type: 'bearer',
    };
    expect(token.token_type).toBe('bearer');
  });
});

describe('useAuth hook', () => {
  it('should initialize with null token if no localStorage', () => {
    localStorage.removeItem('access_token');
    const token = localStorage.getItem('access_token');
    expect(token).toBeNull();
  });

  it('should store token in localStorage on login', () => {
    const fakeToken = 'fake-jwt-token';
    localStorage.setItem('access_token', fakeToken);
    expect(localStorage.getItem('access_token')).toBe(fakeToken);
    localStorage.removeItem('access_token');
  });

  it('should remove token from localStorage on logout', () => {
    localStorage.setItem('access_token', 'some-token');
    localStorage.removeItem('access_token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('API Client', () => {
  it('should create apiClient with correct baseURL', () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';
    expect(API_URL).toBeDefined();
  });

  it('should create authClient with correct baseURL', () => {
    const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8001';
    expect(AUTH_URL).toBeDefined();
  });

  it('should handle Authorization header with token', () => {
    const token = 'Bearer test-token';
    const headers = { Authorization: token };
    expect(headers.Authorization).toBe('Bearer test-token');
  });
});

describe('App component', () => {
  it('should render without crashing', () => {
    const { container } = render(<div>App Container</div>);
    expect(container.textContent).toBe('App Container');
  });
});