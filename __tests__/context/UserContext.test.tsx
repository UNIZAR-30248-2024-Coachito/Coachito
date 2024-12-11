import React from 'react';
import { supabase } from '@/api/supabaseClient';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '@/context/UserContext';

jest.mock('@/api/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('AuthProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe manejar errores al obtener la sesión', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: { message: 'Error fetching session' },
    });

    console.error = jest.fn();

    render(
      <AuthProvider>
        <div>Contenido de la aplicación</div>
      </AuthProvider>
    );

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching session:',
        'Error fetching session'
      )
    );
  });

  it('debe manejar errores al obtener el perfil del usuario', async () => {
    const mockSession = {
      user: {
        id: 'test-user-id',
      },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Error fetching user profile' },
          }),
        })),
      })),
    });

    console.error = jest.fn();

    render(
      <AuthProvider>
        <div>Contenido de la aplicación</div>
      </AuthProvider>
    );

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user profile:',
        'Error fetching user profile'
      )
    );
  });

  it('debe limpiar la suscripción al desmontar', () => {
    const mockUnsubscribe = jest.fn();
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = render(
      <AuthProvider>
        <div>Contenido de la aplicación</div>
      </AuthProvider>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
