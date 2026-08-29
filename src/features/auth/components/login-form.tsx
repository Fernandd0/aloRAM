import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Input, Pressable, Text, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  dniOrEmail: z
    .string({
      message: 'El DNI o correo electrónico es requerido',
    })
    .min(1, 'El DNI o correo electrónico es requerido'),
  password: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: (data: FormType) => void;
};

export function LoginForm({ onSubmit = () => {} }: LoginFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      dniOrEmail: '',
      password: '',
    },
    validators: {
      onChange: schema as any,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-2 text-center text-3xl font-bold text-primary-700"
          >
            VacunaCare
          </Text>
          <Text className="mb-6 max-w-xs text-center text-gray-500">
            ¡Bienvenido! Ingresa con tu DNI o correo registrado para acceder a tu historial de vacunas.
          </Text>
        </View>

        <form.Field
          name="dniOrEmail"
          children={field => (
            <Input
              testID="dni-email-input"
              label="DNI o Correo Electrónico"
              placeholder="Ej. 72849102 o correo@ejemplo.com"
              autoCapitalize="none"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Field
          name="password"
          children={field => (
            <Input
              testID="password-input"
              label="Contraseña"
              placeholder="******"
              secureTextEntry={true}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Subscribe
          selector={state => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button
              testID="login-button"
              label="Iniciar Sesión"
              onPress={form.handleSubmit}
              loading={isSubmitting}
            />
          )}
        />

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">¿No tienes cuenta? </Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text className="font-bold text-primary-600">Regístrate con DNI</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
