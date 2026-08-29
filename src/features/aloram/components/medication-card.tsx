import type { Medication } from '../types';
import * as React from 'react';
import { Pressable, Text, View } from '@/components/ui';
import { useAloRAMStore } from '../store/use-aloram-store';

type Props = {
  medication: Medication;
};

export function MedicationCard({ medication }: Props) {
  const logIntake = useAloRAMStore.use.logIntake();
  const intakeLogs = useAloRAMStore.use.intakeLogs();

  const todayLog = intakeLogs.find(log => log.medicationId === medication.id);

  const handleTake = () => {
    logIntake(medication.id, medication.name, 'taken');
  };

  const handleSkip = () => {
    logIntake(medication.id, medication.name, 'skipped');
  };

  return (
    <View className="mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-800">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center space-x-2">
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
              {medication.name}
            </Text>
            <View className="rounded-full bg-blue-100 px-2.5 py-0.5 dark:bg-blue-950">
              <Text className="text-xs font-bold text-blue-800 dark:text-blue-300">
                {medication.reason}
              </Text>
            </View>
          </View>

          <Text className="mt-1.5 text-sm font-semibold text-slate-600 dark:text-stone-300">
            💊
            {' '}
            {medication.dose}
            {' '}
            •
            {' '}
            {medication.frequency}
          </Text>

          <Text className="mt-1 text-xs text-slate-400">
            ⏰ Próxima toma:
            {' '}
            <Text className="font-bold text-blue-600 dark:text-blue-400">{medication.times[0] || '08:00 AM'}</Text>
          </Text>
        </View>
      </View>

      <View className="mt-4 border-t border-slate-100 pt-3 dark:border-stone-700">
        {todayLog
          ? (
              <View
                className={`items-center rounded-2xl p-3 ${
                  todayLog.status === 'taken'
                    ? 'border border-emerald-300 bg-emerald-100 dark:bg-emerald-950'
                    : 'border border-amber-300 bg-amber-100 dark:bg-amber-950'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    todayLog.status === 'taken'
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {todayLog.status === 'taken'
                    ? `✓ Registrado: Tomado a las ${todayLog.timestamp}`
                    : `⚠️ Registrado: Se te pasó la toma de las ${todayLog.timestamp}`}
                </Text>
              </View>
            )
          : (
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={handleTake}
                  className="flex-1 items-center rounded-2xl bg-blue-600 py-3 shadow-xs active:bg-blue-700"
                >
                  <Text className="text-xs font-extrabold text-white">✓ Ya lo tomé</Text>
                </Pressable>

                <Pressable
                  onPress={handleSkip}
                  className="flex-1 items-center rounded-2xl border border-slate-300 bg-slate-100 py-3 active:bg-slate-200 dark:bg-stone-700"
                >
                  <Text className="text-xs font-bold text-slate-700 dark:text-stone-200">Se me pasó</Text>
                </Pressable>
              </View>
            )}
      </View>
    </View>
  );
}
