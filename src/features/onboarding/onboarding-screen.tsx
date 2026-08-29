import { useRouter } from 'expo-router';
import * as React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
import { Cover } from './components/cover';

export function OnboardingScreen() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center p-4">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end px-4">
        <Text className="my-2 text-center text-4xl font-bold text-primary-700">
          VacunaCare
        </Text>
        <Text className="mb-4 text-center text-lg text-gray-600">
          Tu control digital de vacunación rápido y seguro
        </Text>

        <Text className="my-1.5 text-left text-base text-gray-700">
          💉
          {' '}
          <Text className="font-semibold">Carnet Digital:</Text>
          {' '}
          Lleva tu historial de vacunas en tu móvil.
        </Text>
        <Text className="my-1.5 text-left text-base text-gray-700">
          🆔
          {' '}
          <Text className="font-semibold">Registro por DNI:</Text>
          {' '}
          Validación directa con tu número de documento.
        </Text>
        <Text className="my-1.5 text-left text-base text-gray-700">
          🔔
          {' '}
          <Text className="font-semibold">Alertas de Dosis:</Text>
          {' '}
          Notificaciones de refuerzos y próximas vacunas.
        </Text>
        <Text className="my-1.5 text-left text-base text-gray-700">
          🛡️
          {' '}
          <Text className="font-semibold">Certificado Oficial:</Text>
          {' '}
          Genera códigos QR válidos para viajes y trámites.
        </Text>
      </View>
      <SafeAreaView className="mt-6 w-full px-4">
        <Button
          label="Registrarse con DNI"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/register');
          }}
        />
        <View className="mt-2">
          <Button
            label="Ya tengo cuenta (Iniciar Sesión)"
            variant="outline"
            onPress={() => {
              setIsFirstTime(false);
              router.replace('/login');
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
