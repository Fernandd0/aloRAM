import type { LoginFormProps } from './components/login-form';
import { Redirect, useRouter } from 'expo-router';

import * as React from 'react';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAloRAMStore } from '@/features/aloram/store/use-aloram-store';
import { LoginForm } from './components/login-form';
import { useAuthStore } from './use-auth-store';

export function LoginScreen() {
  const router = useRouter();
  const status = useAuthStore.use.status();
  const signIn = useAuthStore.use.signIn();
  const setUserProfile = useAloRAMStore.use.setUserProfile();

  if (status === 'signIn') {
    return <Redirect href="/" />;
  }

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    const userPhone = data.phone || '987654321';
    signIn(
      { access: 'aloram-access-token', refresh: 'aloram-refresh-token' },
      {
        dni: '72849102',
        email: 'usuario@aloram.app',
        name: 'Omar Pérez',
      },
    );
    setUserProfile({ phone: userPhone, name: 'Omar Pérez' });
    router.replace('/');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
