import type { CheckinPreference } from '@/features/aloram/types';
import Env from 'env';
import * as React from 'react';
import { Button, FocusAwareStatusBar, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { useAloRAMStore } from '@/features/aloram/store/use-aloram-store';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { LanguageItem } from './components/language-item';
import { SettingsContainer } from './components/settings-container';
import { SettingsItem } from './components/settings-item';
import { ThemeItem } from './components/theme-item';

function ProfileSection({ name, setName, phone, setPhone, isSaved, onSave }: { name: string; setName: (v: string) => void; phone: string; setPhone: (v: string) => void; isSaved: boolean; onSave: () => void }) {
  return (
    <View className="mb-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:bg-stone-900">
      <Text className="mb-3 text-xs font-bold text-emerald-700 uppercase">👤 Datos personales</Text>
      <Input label="Tu Nombre" value={name} onChangeText={setName} />
      <Input label="Número de Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Button label={isSaved ? '✓ Guardado' : 'Guardar Perfil'} onPress={onSave} className="mt-2" />
    </View>
  );
}

function PreferenceSection({ preference, onSelect }: { preference: CheckinPreference; onSelect: (p: CheckinPreference) => void }) {
  return (
    <View className="mb-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:bg-stone-900">
      <Text className="mb-2 text-xs font-bold text-emerald-700 uppercase">📞 Preferencia de Check-in</Text>
      <View className="space-y-2">
        {([
          { key: 'call', label: '📞 Llámame (Llamada de voz)' },
          { key: 'message', label: '💬 Mándame un mensaje' },
          { key: 'both', label: '⭐ Las dos opciones' },
        ] as const).map(opt => (
          <Pressable key={opt.key} onPress={() => onSelect(opt.key)} className={`flex-row items-center justify-between rounded-2xl border p-3.5 ${preference === opt.key ? 'border-emerald-600 bg-emerald-50' : 'border-stone-200 bg-stone-50'}`}>
            <Text className="text-sm font-bold text-stone-800">{opt.label}</Text>
            {preference === opt.key && <Text className="text-xs font-extrabold text-emerald-600">SELECCIONADO</Text>}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const signOut = useAuth.use.signOut();
  const user = useAloRAMStore.use.user();
  const setUserProfile = useAloRAMStore.use.setUserProfile();
  const medications = useAloRAMStore.use.medications();
  const deleteMedication = useAloRAMStore.use.deleteMedication();

  const [name, setName] = React.useState(user.name || '');
  const [phone, setPhone] = React.useState(user.phone || '');
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSaveProfile = () => {
    setUserProfile({ name, phone });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="flex-1 px-4 pt-14">
          <Text className="mb-4 text-2xl font-extrabold text-stone-900 dark:text-white">Ajustes de aloRAM</Text>
          <ProfileSection name={name} setName={setName} phone={phone} setPhone={setPhone} isSaved={isSaved} onSave={handleSaveProfile} />
          <PreferenceSection preference={user.checkinPreference} onSelect={p => setUserProfile({ checkinPreference: p })} />

          <View className="mb-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:bg-stone-900">
            <Text className="mb-2 text-xs font-bold text-emerald-700 uppercase">
              💊 Gestionar Medicamentos (
              {medications.length}
              )
            </Text>
            {medications.map(med => (
              <View key={med.id} className="flex-row items-center justify-between border-t border-stone-100 py-3">
                <View>
                  <Text className="text-sm font-bold text-stone-900">{med.name}</Text>
                  <Text className="text-xs text-stone-400">{med.reason}</Text>
                </View>
                <Pressable onPress={() => deleteMedication(med.id)} className="rounded-xl bg-red-100 px-3 py-1.5"><Text className="text-xs font-bold text-red-700">Eliminar</Text></Pressable>
              </View>
            ))}
          </View>

          <SettingsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </SettingsContainer>
          <SettingsContainer title="settings.about">
            <SettingsItem text="settings.app_name" value={Env.EXPO_PUBLIC_NAME} />
            <SettingsItem text="settings.version" value={Env.EXPO_PUBLIC_VERSION} />
          </SettingsContainer>
          <View className="my-6"><SettingsContainer><SettingsItem text="settings.logout" onPress={signOut} /></SettingsContainer></View>
        </View>
      </ScrollView>
    </>
  );
}
