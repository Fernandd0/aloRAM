import * as React from 'react';
import { Button, FocusAwareStatusBar, Pressable, ScrollView, Text, View } from '@/components/ui';
import { AddMedicationModal } from './components/add-medication-modal';
import { AloRAMAvatar } from './components/aloram-avatar';
import { ChatReportModal } from './components/chat-report-modal';
import { MedicationCard } from './components/medication-card';
import { VoiceCallModal } from './components/voice-call-modal';
import { useAloRAMStore } from './store/use-aloram-store';

function MainHeroCard({ onStartCall, onStartManual }: { onStartCall: () => void; onStartManual: () => void }) {
  return (
    <View className="my-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-stone-900">
      <Text className="text-center text-2xl font-black text-slate-900 dark:text-white">
        Reporte de Eventos Adversos
      </Text>
      <Text className="mt-2 text-center text-xs/relaxed text-slate-500 dark:text-stone-300">
        Relate los síntomas o reacciones inesperadas utilizando su voz. Nuestro sistema de inteligencia artificial estructurará la información de forma segura.
      </Text>
      <View className="mt-6 space-y-3">
        <Pressable onPress={onStartCall} className="flex-row items-center justify-center rounded-2xl bg-blue-600 py-4 shadow-md active:bg-blue-700">
          <Text className="mr-2 text-base">🎙️</Text>
          <Text className="text-base font-extrabold text-white">Iniciar Reporte por Voz</Text>
        </Pressable>
        <Pressable onPress={onStartManual} className="flex-row items-center justify-center rounded-2xl border border-blue-600 bg-white py-3.5 active:bg-blue-50 dark:bg-transparent">
          <Text className="mr-2 text-sm">📝</Text>
          <Text className="text-sm font-bold text-blue-600">Reporte Manual</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const user = useAloRAMStore.use.user();
  const medications = useAloRAMStore.use.medications();
  const reactions = useAloRAMStore.use.reactionReports();
  const activeMeds = (medications || []).filter(m => m.status === 'active');

  const [showCallModal, setShowCallModal] = React.useState(false);
  const [showAddMedModal, setShowAddMedModal] = React.useState(false);
  const [showChatReportModal, setShowChatReportModal] = React.useState(false);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-stone-950">
      <FocusAwareStatusBar />
      <View className="flex-row items-center justify-between bg-white px-5 pt-12 pb-3 shadow-xs dark:bg-stone-900">
        <View className="flex-row items-center space-x-3">
          <AloRAMAvatar size="sm" />
          <View>
            <Text className="text-xs font-bold text-blue-600 uppercase">aloRAM Reporte</Text>
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
              Hola,
              {user?.name || 'Usuario'}
            </Text>
          </View>
        </View>
        <Pressable className="size-9 items-center justify-center rounded-full bg-slate-100">
          <Text className="text-base font-bold text-slate-600">👤</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-4 pt-4">
        <MainHeroCard onStartCall={() => setShowCallModal(true)} onStartManual={() => setShowChatReportModal(true)} />

        <View className="mt-4">
          <Text className="text-base font-extrabold text-slate-900 dark:text-white">Mis Reportes</Text>
          <Text className="text-xs text-slate-400">Resumen actualizado</Text>
          <View className="mt-3 flex-row space-x-3">
            <View className="flex-1 items-center rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <Text className="text-2xl font-black text-blue-700">{(reactions || []).length}</Text>
              <Text className="mt-1 text-xs font-bold text-blue-600">En Revisión</Text>
            </View>
            <View className="flex-1 items-center rounded-2xl border border-emerald-200 bg-emerald-100 p-4">
              <Text className="text-2xl font-black text-emerald-800">{activeMeds.length + 5}</Text>
              <Text className="mt-1 text-xs font-bold text-emerald-700">Aprobados</Text>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-extrabold text-slate-900 dark:text-white">Medicamentos Registrados</Text>
            <Pressable onPress={() => setShowAddMedModal(true)}><Text className="text-xs font-bold text-blue-600">+ Agregar</Text></Pressable>
          </View>
          {activeMeds.length === 0
            ? (
                <View className="items-center rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
                  <Text className="mb-2 text-3xl">💊</Text>
                  <Text className="text-sm font-bold text-slate-700">Aún no tienes medicamentos registrados</Text>
                  <Button label="+ Agregar medicamento" onPress={() => setShowAddMedModal(true)} className="mt-3" />
                </View>
              )
            : (
                activeMeds.map(med => <MedicationCard key={med.id} medication={med} />)
              )}
        </View>
      </ScrollView>

      <Pressable className="absolute right-5 bottom-6 size-12 items-center justify-center rounded-full bg-blue-600 shadow-lg active:bg-blue-700">
        <Text className="text-lg font-bold text-white">?</Text>
      </Pressable>

      <VoiceCallModal visible={showCallModal} onClose={() => setShowCallModal(false)} />
      <AddMedicationModal visible={showAddMedModal} onClose={() => setShowAddMedModal(false)} />
      <ChatReportModal visible={showChatReportModal} onClose={() => setShowChatReportModal(false)} />
    </View>
  );
}
