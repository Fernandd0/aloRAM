import type { ReactionReport } from './types';
import * as React from 'react';
import { FocusAwareStatusBar, Pressable, ScrollView, Text, View } from '@/components/ui';
import { useAloRAMStore } from './store/use-aloram-store';

function ReactionCard({ rep }: { rep: ReactionReport }) {
  const isVoice = rep.channel === 'voice';
  const isFuerte = rep.severity === 'fuerte';
  const isMolesto = rep.severity === 'molesto';

  return (
    <View className="mb-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-2">
          <Text className="text-base font-bold text-stone-900 dark:text-white">{rep.medicationName || 'Medicamento'}</Text>
          <View className={`rounded-full px-2.5 py-0.5 ${isVoice ? 'bg-teal-100 dark:bg-teal-950' : 'bg-stone-100 dark:bg-stone-800'}`}>
            <Text className="text-xs font-bold text-teal-800 dark:text-teal-300">{isVoice ? '📞 Llamada' : '💬 Chat'}</Text>
          </View>
        </View>

        <View className={`rounded-full px-3 py-1 ${isFuerte ? 'bg-red-100' : isMolesto ? 'bg-amber-100' : 'bg-emerald-100'}`}>
          <Text className={`text-xs font-extrabold capitalize ${isFuerte ? 'text-red-700' : isMolesto ? 'text-amber-800' : 'text-emerald-800'}`}>
            {rep.severity}
          </Text>
        </View>
      </View>

      <Text className="mt-2 text-sm font-medium text-stone-700 dark:text-stone-200">
        "
        {rep.description}
        "
      </Text>

      <View className="mt-3 flex-row justify-between border-t border-stone-100 pt-2 dark:border-stone-800">
        <Text className="text-xs text-stone-400">
          Inicio:
          {rep.onset}
        </Text>
        <Text className="text-xs text-stone-400">{rep.createdAt}</Text>
      </View>
    </View>
  );
}

export function HistoryScreen() {
  const reactionReports = useAloRAMStore.use.reactionReports();
  const intakeLogs = useAloRAMStore.use.intakeLogs();
  const medications = useAloRAMStore.use.medications();
  const [selectedMedFilter, setSelectedMedFilter] = React.useState<string>('all');

  const filteredReports = reactionReports.filter(rep =>
    selectedMedFilter === 'all' ? true : rep.medicationName === selectedMedFilter,
  );

  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-950">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-extrabold text-stone-900 dark:text-white">Historial de Tratamiento</Text>
        <Text className="mt-1 mb-4 text-sm text-stone-500">Registro de tomas cotidianas y reportes de sensaciones o reacciones.</Text>

        <View className="mb-4">
          <Text className="mb-2 text-xs font-bold text-stone-400 uppercase">Filtrar por medicamento:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
            <Pressable onPress={() => setSelectedMedFilter('all')} className={`rounded-full border px-4 py-1.5 ${selectedMedFilter === 'all' ? 'border-emerald-600 bg-emerald-600' : 'border-stone-200 bg-white'}`}>
              <Text className={`text-xs font-bold ${selectedMedFilter === 'all' ? 'text-white' : 'text-stone-700'}`}>
                Todos (
                {reactionReports.length}
                )
              </Text>
            </Pressable>
            {medications.map(med => (
              <Pressable key={med.id} onPress={() => setSelectedMedFilter(med.name)} className={`rounded-full border px-4 py-1.5 ${selectedMedFilter === med.name ? 'border-emerald-600 bg-emerald-600' : 'border-stone-200 bg-white'}`}>
                <Text className={`text-xs font-bold ${selectedMedFilter === med.name ? 'text-white' : 'text-stone-700'}`}>{med.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Text className="mb-2 text-base font-extrabold text-stone-800 dark:text-stone-200">Reacciones y Síntomas Reportados</Text>
        {filteredReports.length === 0
          ? (
              <View className="mb-6 items-center rounded-2xl border border-stone-200 bg-white p-5 dark:bg-stone-900">
                <Text className="text-sm font-semibold text-stone-500">No hay reportes de reacciones para este filtro.</Text>
              </View>
            )
          : (
              filteredReports.map(rep => <ReactionCard key={rep.id} rep={rep} />)
            )}

        <Text className="mt-4 mb-2 text-base font-extrabold text-stone-800 dark:text-stone-200">Registro de Tomas de Hoy</Text>
        {intakeLogs.map(log => (
          <View key={log.id} className="mb-2 flex-row items-center justify-between rounded-2xl border border-stone-200 bg-white p-3.5 dark:bg-stone-900">
            <View>
              <Text className="text-sm font-bold text-stone-900 dark:text-white">{log.medicationName}</Text>
              <Text className="text-xs text-stone-400">
                Hora:
                {log.timestamp}
              </Text>
            </View>
            <Text className={`text-xs font-extrabold ${log.status === 'taken' ? 'text-emerald-600' : 'text-amber-600'}`}>{log.status === 'taken' ? '✓ TOMADO' : '⚠️ SE PASÓ'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
