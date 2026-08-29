import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Input, Pressable, Text, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  phone: z
    .string({
      message: 'El número de teléfono es requerido',
    })
    .min(1, 'El número de teléfono es requerido'),
  password: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(1, 'La contraseña es requerida'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: (data: FormType) => void;
};

export function LoginForm({ onSubmit = () => {} }: LoginFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      phone: '',
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
      <View className="flex-1 justify-center bg-slate-50 p-6 dark:bg-stone-900">
        <View className="mb-8 items-center justify-center">
          <View className="mb-3 size-16 items-center justify-center rounded-3xl bg-blue-600 shadow-md">
            <Text className="text-2xl">💊</Text>
          </View>
          <Text
            testID="form-title"
            className="pb-1 text-center text-3xl font-black text-blue-900 dark:text-white"
          >
            aloRAM
          </Text>
          <Text className="max-w-xs text-center text-xs font-medium text-slate-500">
            Ingresa tu número de teléfono y contraseña para acceder a tus medicamentos y reportes de salud por voz.
          </Text>
        </View>

        <View className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-stone-800">
          <form.Field
            name="phone"
            children={field => (
              <Input
                testID="phone-input"
                label="Número de Teléfono"
                placeholder="Ej. 987654321"
                autoCapitalize="none"
                keyboardType="phone-pad"
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
                className="mt-2 rounded-2xl bg-blue-600 py-3.5"
              />
            )}
          />
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-xs text-slate-500">¿Aún no tienes cuenta? </Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text className="text-xs font-bold text-blue-600">Regístrate gratis</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
