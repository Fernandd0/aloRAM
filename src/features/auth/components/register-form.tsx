import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Input, Pressable, Text, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  dni: z
    .string({ message: 'El DNI es obligatorio' })
    .min(8, 'El DNI debe tener al menos 8 dígitos')
    .max(12, 'DNI no válido')
    .regex(/^\d+$/, 'El DNI solo debe contener números'),
  name: z
    .string({ message: 'El nombre es obligatorio' })
    .min(2, 'Ingrese un nombre válido'),
  email: z
    .string({ message: 'El correo electrónico es obligatorio' })
    .min(1, 'El correo es obligatorio')
    .email('Formato de correo no válido'),
  password: z
    .string({ message: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
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
      <Text testID="register-form-title" className="pb-2 text-center text-3xl font-bold text-primary-700">
        Registro VacunaCare
      </Text>
      <Text className="mb-6 max-w-xs text-center text-gray-500">
        Regístrate con tu DNI para gestionar y consultar tu carnet digital de vacunación.
      </Text>
    </View>
  );
}

function RegisterFooter({ onNavigateLogin }: { onNavigateLogin: () => void }) {
  return (
    <View className="mt-4 flex-row justify-center">
      <Text className="text-gray-600">¿Ya tienes una cuenta? </Text>
      <Pressable onPress={onNavigateLogin}>
        <Text className="font-bold text-primary-600">Inicia sesión</Text>
      </Pressable>
    </View>
  );
}

export function RegisterForm({ onSubmit = () => {} }: RegisterFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: { dni: '', name: '', email: '', password: '', confirmPassword: '' },
    validators: { onChange: schema as any },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
      <View className="flex-1 justify-center p-4">
        <RegisterHeader />
        <form.Field
          name="dni"
          children={field => (
            <Input testID="dni-input" label="DNI (Documento de Identidad)" placeholder="Ej. 72849102" keyboardType="numeric" maxLength={12} value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
          )}
        />
        <form.Field
          name="name"
          children={field => (
            <Input testID="name-input" label="Nombre Completo" placeholder="Ej. Juan Pérez" value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
          )}
        />
        <form.Field
          name="email"
          children={field => (
            <Input testID="email-input" label="Correo Electrónico" placeholder="ejemplo@correo.com" keyboardType="email-address" autoCapitalize="none" value={field.state.value} onBlur={field.handleBlur} onChangeText={field.handleChange} error={getFieldError(field)} />
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
            <Button testID="register-button" label="Registrarme" onPress={form.handleSubmit} loading={isSubmitting} />
          )}
        />
        <RegisterFooter onNavigateLogin={() => router.push('/login')} />
      </View>
    </KeyboardAvoidingView>
  );
}
