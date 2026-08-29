import type { LoginFormProps } from './login-form';

import * as React from 'react';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { LoginForm } from './login-form';

afterEach(cleanup);

const onSubmitMock: jest.Mock<LoginFormProps['onSubmit']> = jest.fn();

describe('loginForm Form ', () => {
  it('renders correctly', async () => {
    setup(<LoginForm />);
    expect(await screen.findByTestId('form-title')).toBeOnTheScreen();
  });

  it('should display required error when values are empty', async () => {
    const { user } = setup(<LoginForm />);

    const button = screen.getByTestId('login-button');
    expect(screen.queryByText(/El DNI o correo electrónico es requerido/i)).not.toBeOnTheScreen();
    await user.press(button);
    expect(await screen.findByText(/El DNI o correo electrónico es requerido/i)).toBeOnTheScreen();
    expect(screen.getByText(/La contraseña es requerida/i)).toBeOnTheScreen();
  });

  it('should call LoginForm with correct values when values are valid', async () => {
    const { user } = setup(<LoginForm onSubmit={onSubmitMock} />);

    const button = screen.getByTestId('login-button');
    const input = screen.getByTestId('dni-email-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(input, '72849102');
    await user.type(passwordInput, '123456');
    await user.press(button);
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dniOrEmail: '72849102',
        password: '123456',
      }),
    );
  });
});
