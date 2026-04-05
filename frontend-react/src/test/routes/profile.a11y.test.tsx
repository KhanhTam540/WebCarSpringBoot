import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../app/routes';
import { server } from '../server';
import { renderWithProviders, screen } from '../utils';
import { useAuthStore } from '../../store/authStore';

describe('profile accessibility matrix', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('renders profile shell, labeled fields, and feedback region affordances', async () => {
    server.use(
      http.get('/api/v1/users/profile', () =>
        HttpResponse.json({
          username: 'alice',
          email: 'alice@example.com',
          roles: ['ROLE_USER'],
        }),
      ),
    );

    renderWithProviders(<AppRoutes />, { route: '/account/profile' });

    expect(await screen.findByRole('heading', { name: /hồ sơ tài khoản/i })).toBeInTheDocument();
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByLabelText(/email mới/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mật khẩu mới$/i)).toBeInTheDocument();
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });
});
