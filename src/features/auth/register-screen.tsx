import type { RegisterFormProps } from './components/register-form';
import { useRouter } from 'expo-router';

import * as React from 'react';
import { FocusAwareStatusBar, ScrollView } from '@/components/ui';
import { RegisterForm } from './components/register-form';
import { useAuthStore } from './use-auth-store';

export function RegisterScreen() {
  const router = useRouter();
  const signUp = useAuthStore.use.signUp();

  const onSubmit: RegisterFormProps['onSubmit'] = (data) => {
    signUp(
      {
        dni: '72849102',
        name: data.name,
        email: 'usuario@aloram.app',
      },
      {
        access: 'aloram-access-token',
        refresh: 'aloram-refresh-token',
      },
    );
    router.replace('/');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <RegisterForm onSubmit={onSubmit} />
      </ScrollView>
    </>
  );
}
