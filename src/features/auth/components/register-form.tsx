import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Input, Pressable, Text, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  phone: z
    .string({ message: 'El teléfono es obligatorio' })
    .min(7, 'Ingrese un teléfono válido'),
  name: z
    .string({ message: 'El nombre es obligatorio' })
    .min(2, 'Ingrese un nombre válido'),
  password: z
    .string({ message: 'La contraseña es obligatoria' })
    .min(4, 'La contraseña debe tener al menos 4 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterFormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: (data: RegisterFormType) => void;
};

function RegisterHeader() {
  return (
    <View className="items-center justify-center">
      <Text testID="register-form-title" className="pb-2 text-center text-3xl font-extrabold text-blue-700">
        Registro aloRAM
      </Text>
      <Text className="mb-4 max-w-xs text-center text-xs text-slate-500">
        Crea tu cuenta con tu número de teléfono para recibir llamadas de seguimiento y gestionar tu salud.
      </Text>
    </View>
  );
}

function RegisterFooter({ onNavigateLogin }: { onNavigateLogin: () => void }) {
  return (
    <View className="mt-4 flex-row justify-center">
      <Text className="text-slate-600">¿Ya tienes una cuenta? </Text>
      <Pressable onPress={onNavigateLogin}>
        <Text className="font-bold text-blue-600">Inicia sesión</Text>
      </Pressable>
    </View>
  );
}

export function RegisterForm({ onSubmit = () => {} }: RegisterFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: { phone: '', name: '', password: '', confirmPassword: '' },
    validators: { onChange: schema as any },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
      <View className="flex-1 justify-center p-4">
        <RegisterHeader />
        <form.Field
          name="phone"
          children={field => (
            <Input testID="phone-input" label="Número de Teléfono (Para llamadas Vapi)" placeholder="Ej. +51 987654321" keyboardType="phone-pad" value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
          )}
        />
        <form.Field
          name="name"
          children={field => (
            <Input testID="name-input" label="Nombre Completo" placeholder="Ej. Juan Pérez" value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
          )}
        />
        <form.Field
          name="password"
          children={field => (
            <Input testID="password-input" label="Contraseña" placeholder="******" secureTextEntry={true} value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
          )}
        />
        <form.Field
          name="confirmPassword"
          children={field => (
            <Input testID="confirm-password-input" label="Confirmar Contraseña" placeholder="******" secureTextEntry={true} value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
          )}
        />
        <form.Subscribe
          selector={state => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button testID="register-button" label="Registrarme" onPress={form.handleSubmit} loading={isSubmitting} className="mt-2" />
          )}
        />
        <RegisterFooter onNavigateLogin={() => router.push('/login')} />
      </View>
    </KeyboardAvoidingView>
  );
}
