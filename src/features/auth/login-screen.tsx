import type { LoginFormProps } from './components/login-form';
import { useRouter } from 'expo-router';

import * as React from 'react';
import { FocusAwareStatusBar } from '@/components/ui';
import { LoginForm } from './components/login-form';
import { useAuthStore } from './use-auth-store';

export function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    const isDni = /^\d+$/.test(data.dniOrEmail);
    signIn(
      { access: 'vacunacare-access-token', refresh: 'vacunacare-refresh-token' },
      {
        dni: isDni ? data.dniOrEmail : '72849102',
        email: !isDni ? data.dniOrEmail : 'usuario@vacunacare.org',
        name: 'Usuario Registrado',
      },
    );
    router.replace('/');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
