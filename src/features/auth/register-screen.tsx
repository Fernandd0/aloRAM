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
        dni: data.dni,
        name: data.name,
        email: data.email,
      },
      {
        access: 'vacunacare-access-token',
        refresh: 'vacunacare-refresh-token',
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
