import type { CheckinPreference } from '@/features/aloram/types';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Button, FocusAwareStatusBar, Input, Pressable, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { AloRAMAvatar } from '@/features/aloram/components/aloram-avatar';
import { useAloRAMStore } from '@/features/aloram/store/use-aloram-store';
import { useIsFirstTime } from '@/lib/hooks';

function Step1Welcome() {
  return (
    <View className="my-auto items-center space-y-6 text-center">
      <AloRAMAvatar size="xl" />
      <View className="items-center px-2">
        <Text className="text-4xl font-extrabold text-stone-900 dark:text-white">aloRAM</Text>
        <Text className="mt-3 text-center text-lg/relaxed text-stone-600 dark:text-stone-300">
          "Hola, soy aloRAM. Te ayudo a llevar tus medicamentos y a saber cómo te están sentando."
        </Text>
      </View>
    </View>
  );
}

function Step2Register({ name, setName, phone, setPhone, age, setAge }: { name: string; setName: (v: string) => void; phone: string; setPhone: (v: string) => void; age: string; setAge: (v: string) => void }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="my-auto space-y-4">
      <Text className="text-3xl font-extrabold text-stone-900 dark:text-white">Cuéntame de ti</Text>
      <Input label="Tu Nombre" placeholder="Ej. María García" value={name} onChangeText={setName} />
      <Input label="Número de Teléfono (Para llamadas)" placeholder="Ej. +51 987654321" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <Input label="Edad (Opcional)" placeholder="Ej. 64" keyboardType="numeric" value={age} onChangeText={setAge} />
    </ScrollView>
  );
}

function Step3Preference({ preference, setPreference }: { preference: CheckinPreference; setPreference: (v: CheckinPreference) => void }) {
  return (
    <View className="my-auto space-y-4">
      <Text className="text-3xl font-extrabold text-stone-900 dark:text-white">¿Cómo prefieres que te pregunte?</Text>
      {(
        [
          { key: 'call', title: '📞 Llámame', desc: 'Llamada de voz natural conversacional.' },
          { key: 'message', title: '💬 Mándame un mensaje', desc: 'Notificación en la app y chat guiado.' },
          { key: 'both', title: '⭐ Las dos opciones', desc: 'Llamada de voz y mensajes según la ocasión.' },
        ] as const
      ).map(opt => (
        <Pressable key={opt.key} onPress={() => setPreference(opt.key)} className={`rounded-3xl border p-5 ${preference === opt.key ? 'border-emerald-600 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
          <Text className="text-lg font-bold text-stone-900">{opt.title}</Text>
          <Text className="mt-1 text-sm text-stone-600">{opt.desc}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function OnboardingScreen() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const setUserProfile = useAloRAMStore.use.setUserProfile();
  const user = useAloRAMStore.use.user();
  const [step, setStep] = React.useState(1);

  const [name, setName] = React.useState(user.name || '');
  const [phone, setPhone] = React.useState(user.phone || '');
  const [age, setAge] = React.useState(user.age || '');
  const [preference, setPreference] = React.useState<CheckinPreference>(user.checkinPreference || 'both');

  const handleFinishOnboarding = () => {
    setUserProfile({ name: name || 'Amigo', phone: phone || '+51 987654321', age, checkinPreference: preference });
    setIsFirstTime(false);
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-50 dark:bg-stone-900">
      <FocusAwareStatusBar />
      <View className="flex-1 justify-between p-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-extrabold text-emerald-700 uppercase">aloRAM • Tu asistente de salud</Text>
          <Text className="text-xs font-bold text-stone-400">
            Paso
            {step}
            {' '}
            de 4
          </Text>
        </View>

        {step === 1 && <Step1Welcome />}
        {step === 2 && <Step2Register name={name} setName={setName} phone={phone} setPhone={setPhone} age={age} setAge={setAge} />}
        {step === 3 && <Step3Preference preference={preference} setPreference={setPreference} />}
        {step === 4 && (
          <View className="my-auto items-center space-y-6 text-center">
            <AloRAMAvatar size="lg" />
            <Text className="text-center text-3xl font-extrabold text-stone-900">
              ¡Todo listo,
              {name || 'amigo'}
              !
            </Text>
            <Button label="Ir a la pantalla principal" onPress={handleFinishOnboarding} className="mt-4 w-full" />
          </View>
        )}

        {step < 4 && <Button label={step === 1 ? 'Empezar' : 'Continuar →'} onPress={() => setStep(step + 1)} />}
      </View>
    </SafeAreaView>
  );
}
