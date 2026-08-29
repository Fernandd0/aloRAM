import type { RegisterFormProps } from './register-form';

import * as React from 'react';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { RegisterForm } from './register-form';

afterEach(cleanup);

const onSubmitMock: jest.Mock<RegisterFormProps['onSubmit']> = jest.fn();

describe('registerForm', () => {
  it('renders title correctly', async () => {
    setup(<RegisterForm />);
    expect(await screen.findByTestId('register-form-title')).toBeOnTheScreen();
  });

  it('displays required validation errors on empty submit', async () => {
    const { user } = setup(<RegisterForm />);
    const button = screen.getByTestId('register-button');

    await user.press(button);
    expect(await screen.findByText(/El DNI debe tener al menos 8 dígitos/i)).toBeOnTheScreen();
    expect(screen.getByText(/Ingrese un nombre válido/i)).toBeOnTheScreen();
  });

  it('calls onSubmit with valid form data', async () => {
    const { user } = setup(<RegisterForm onSubmit={onSubmitMock} />);

    await user.type(screen.getByTestId('dni-input'), '72849102');
    await user.type(screen.getByTestId('name-input'), 'Juan Pérez');
    await user.type(screen.getByTestId('email-input'), 'juan@vacunacare.org');
    await user.type(screen.getByTestId('password-input'), '123456');
    await user.type(screen.getByTestId('confirm-password-input'), '123456');

    await user.press(screen.getByTestId('register-button'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dni: '72849102',
        name: 'Juan Pérez',
        email: 'juan@vacunacare.org',
      }),
    );
  });
});
