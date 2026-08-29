import * as React from 'react';
import { Button, FocusAwareStatusBar, Pressable, ScrollView, Text, View } from '@/components/ui';
import { AddMedicationModal } from './components/add-medication-modal';
import { AloRAMAvatar } from './components/aloram-avatar';
import { ChatReportModal } from './components/chat-report-modal';
import { MedicationCard } from './components/medication-card';
import { VoiceCallModal } from './components/voice-call-modal';
import { useAloRAMStore } from './store/use-aloram-store';

function CallBannerCard({ onOpenCall }: { onOpenCall: () => void }) {
  return (
    <Pressable onPress={onOpenCall} className="my-4 overflow-hidden rounded-3xl bg-linear-to-tr from-emerald-800 to-teal-700 p-5 shadow-lg active:opacity-95">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">🎙️ LLAMADA DE VOZ VAPI</Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">Hablar con aloRAM</Text>
          <Text className="mt-1 text-sm font-medium text-emerald-100">Llamada natural conversacional para saber cómo estás y cómo te sienta tu medicina.</Text>
        </View>
        <AloRAMAvatar size="lg" isCalling />
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t border-emerald-600/40 pt-3">
        <Text className="text-xs font-bold text-emerald-200">📞 Presiona para que aloRAM te llame ahora</Text>
        <Text className="text-xs font-extrabold text-white underline">Iniciar llamada →</Text>
      </View>
    </Pressable>
  );
}

function FixedBottomCallButton({ onOpenCall }: { onOpenCall: () => void }) {
  return (
    <View className="absolute inset-x-4 bottom-3 z-20">
      <Pressable
        onPress={onOpenCall}
        className="flex-row items-center justify-between rounded-full border border-emerald-400/40 bg-emerald-600 px-5 py-3.5 shadow-xl active:bg-emerald-700"
      >
        <View className="flex-row items-center space-x-3">
          <AloRAMAvatar size="sm" isCalling />
          <View>
            <Text className="text-xs font-bold tracking-wider text-emerald-200 uppercase">Panel de Llamadas Vapi</Text>
            <Text className="text-base font-extrabold text-white">📞 Hablar con aloRAM ahora</Text>
          </View>
        </View>
        <View className="rounded-full bg-white/20 px-3 py-1">
          <Text className="text-xs font-extrabold text-white">Llamar →</Text>
        </View>
      </Pressable>
    </View>
  );
}

export function HomeScreen() {
  const user = useAloRAMStore.use.user();
  const medications = useAloRAMStore.use.medications();
  const activeMeds = medications.filter(m => m.status === 'active');

  const [showCallModal, setShowCallModal] = React.useState(false);
  const [showAddMedModal, setShowAddMedModal] = React.useState(false);
  const [showChatReportModal, setShowChatReportModal] = React.useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-950">
      <FocusAwareStatusBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between py-2">
          <View>
            <Text className="text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
              {greeting}
              ,
              {user.name || 'Amigo'}
              {' '}
              👋
            </Text>
            <Text className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Hoy te toca tomar
              {' '}
              {activeMeds.length}
              {' '}
              medicamento
              {activeMeds.length === 1 ? '' : 's'}
            </Text>
          </View>
          <AloRAMAvatar size="sm" />
        </View>

        <CallBannerCard onOpenCall={() => setShowCallModal(true)} />

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-extrabold text-stone-900 dark:text-white">Tus medicamentos activos</Text>
          <Pressable onPress={() => setShowAddMedModal(true)}><Text className="text-sm font-bold text-emerald-700">+ Agregar</Text></Pressable>
        </View>

        {activeMeds.length === 0
          ? (
              <View className="items-center rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-center">
                <Text className="mb-2 text-3xl">💊</Text>
                <Text className="text-base font-bold text-stone-800">Aún no tienes medicamentos registrados</Text>
                <Button label="+ Agregar medicamento" onPress={() => setShowAddMedModal(true)} className="mt-4" />
              </View>
            )
          : (
              activeMeds.map(med => <MedicationCard key={med.id} medication={med} />)
            )}

        <View className="mt-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <Text className="text-xs font-bold tracking-wider text-stone-400 uppercase">💬 Chequeo rápido</Text>
          <Text className="mt-1 text-lg font-bold text-stone-900">¿Cómo te has sentido últimamente?</Text>
          <Button label="Reportar síntomas por chat" variant="outline" onPress={() => setShowChatReportModal(true)} className="mt-4" />
        </View>
      </ScrollView>

      {/* Persistent Bottom Call Action Button */}
      <FixedBottomCallButton onOpenCall={() => setShowCallModal(true)} />

      <VoiceCallModal visible={showCallModal} onClose={() => setShowCallModal(false)} />
      <AddMedicationModal visible={showAddMedModal} onClose={() => setShowAddMedModal(false)} />
      <ChatReportModal visible={showChatReportModal} onClose={() => setShowChatReportModal(false)} />
    </View>
  );
}
