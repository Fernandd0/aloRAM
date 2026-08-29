import * as React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import { Button, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { useAloRAMStore } from '../store/use-aloram-store';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MEDICATION_SUGGESTIONS = [
  'Paracetamol 500mg',
  'Losartán 50mg',
  'Omeprazol 20mg',
  'Amoxicilina 500mg',
  'Metformina 850mg',
  'Ibuprofeno 400mg',
  'Atorvastatina 20mg',
];

const DOSE_SUGGESTIONS = [
  '500mg (1 pastilla)',
  '50mg (1 pastilla)',
  '20mg (1 cápsula)',
  '100mg',
  '1 tableta',
  '2 pastillas',
];

const FREQUENCY_OPTIONS = [
  '1 vez al día (cada 24h)',
  '2 veces al día (cada 12h)',
  '3 veces al día (cada 8h)',
  'Solo cuando sea necesario',
];

function StepName({ name, setName }: { name: string; setName: (v: string) => void }) {
  return (
    <View className="my-auto space-y-4">
      <Text className="text-2xl font-extrabold text-slate-900 dark:text-stone-100">
        1. ¿Qué medicamento estás tomando?
      </Text>
      <Input placeholder="Ej. Paracetamol 500mg" value={name} onChangeText={setName} autoFocus />
      <Text className="mt-2 text-xs font-bold text-slate-400 uppercase">Sugerencias habituales:</Text>
      <View className="flex-row flex-wrap gap-2 pt-1">
        {MEDICATION_SUGGESTIONS.map(sugg => (
          <Pressable key={sugg} onPress={() => setName(sugg)} className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 dark:bg-blue-950">
            <Text className="text-xs font-bold text-blue-700 dark:text-blue-300">
              +
              {sugg}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function StepDetails({
  step,
  reason,
  setReason,
  dose,
  setDose,
  frequency,
  setFrequency,
  time,
  setTime,
  startDate,
  setStartDate,
}: {
  step: number;
  reason: string;
  setReason: (v: string) => void;
  dose: string;
  setDose: (v: string) => void;
  frequency: string;
  setFrequency: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
}) {
  if (step === 2) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-stone-100">2. ¿Para qué te lo recetaron?</Text>
        <Input placeholder="Ej. Dolor o presión alta" value={reason} onChangeText={setReason} autoFocus />
      </View>
    );
  }
  if (step === 3) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-stone-100">3. Dosis (ej. 500mg)</Text>
        <Input placeholder="Ej. 500mg o 1 pastilla" value={dose} onChangeText={setDose} autoFocus />
        <Text className="mt-2 text-xs font-bold text-slate-400 uppercase">Dosis comunes:</Text>
        <View className="flex-row flex-wrap gap-2">
          {DOSE_SUGGESTIONS.map(d => (
            <Pressable key={d} onPress={() => setDose(d)} className="rounded-full border border-slate-300 bg-slate-100 px-3.5 py-1.5">
              <Text className="text-xs font-semibold text-slate-700">{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }
  if (step === 4) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-stone-100">4. ¿Frecuencia de toma?</Text>
        <ScrollView className="max-h-60 space-y-2">
          {FREQUENCY_OPTIONS.map(opt => (
            <Pressable key={opt} onPress={() => setFrequency(opt)} className={`rounded-2xl border p-4 ${frequency === opt ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}>
              <Text className="font-bold text-slate-800">{opt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }
  if (step === 5) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-stone-100">5. ¿A qué hora sueles tomarlo?</Text>
        <Input placeholder="Ej. 08:00 AM" value={time} onChangeText={setTime} />
      </View>
    );
  }
  if (step === 6) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-stone-100">6. ¿Desde cuándo lo estás tomando?</Text>
        <Input placeholder="Ej. Hoy o Desde hace 3 días" value={startDate} onChangeText={setStartDate} />
      </View>
    );
  }
  return null;
}

function StepSummary({ name, reason, dose, frequency, time, startDate }: any) {
  return (
    <ScrollView className="my-auto space-y-3">
      <Text className="text-2xl font-black text-slate-900 dark:text-stone-100">7. Confirmar Medicamento</Text>
      <View className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-xs">
        <Text className="text-xs font-bold text-blue-700 uppercase">Resumen de receta</Text>
        <Text className="mt-1 text-2xl font-extrabold text-slate-900">{name || 'Medicamento'}</Text>
        <View className="mt-4 space-y-2 border-t border-blue-200/60 pt-3">
          <Text className="text-sm font-medium text-slate-700">
            🎯 Motivo:
            {reason || 'General'}
          </Text>
          <Text className="text-sm font-medium text-slate-700">
            💊 Dosis:
            {dose || '500mg'}
          </Text>
          <Text className="text-sm font-medium text-slate-700">
            ⏰ Frecuencia:
            {frequency || 'Diario'}
            {' '}
            (
            {time}
            )
          </Text>
          <Text className="text-sm font-medium text-slate-700">
            📅 Inicio:
            {startDate}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export function AddMedicationModal({ visible, onClose }: Props) {
  const addMedication = useAloRAMStore.use.addMedication();
  const [step, setStep] = React.useState(1);

  const [name, setName] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [dose, setDose] = React.useState('');
  const [frequency, setFrequency] = React.useState('');
  const [time, setTime] = React.useState('08:00 AM');
  const [startDate, setStartDate] = React.useState('Hoy');

  const handleNext = () => step < 7 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleConfirm = () => {
    addMedication({
      name: name || 'Paracetamol 500mg',
      reason: reason || 'Tratamiento personal',
      dose: dose || '500mg',
      frequency: frequency || '1 vez al día',
      times: [time],
      startDate,
      isContinuous: true,
      status: 'active',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-stone-900">
        <View className="flex-1 justify-between p-5">
          <View>
            <View className="flex-row items-center justify-between">
              <Pressable onPress={step === 1 ? onClose : handleBack} className="p-2">
                <Text className="text-sm font-bold text-blue-600">{step === 1 ? 'Cancelar' : '← Volver'}</Text>
              </Pressable>
              <Text className="text-xs font-bold text-slate-400">
                Paso
                {step}
                {' '}
                de 7
              </Text>
            </View>
            <View className="mt-2 h-2 w-full rounded-full bg-slate-200">
              <View className="h-full rounded-full bg-blue-600" style={{ width: `${(step / 7) * 100}%` }} />
            </View>
          </View>

          {step === 1 && <StepName name={name} setName={setName} />}
          {step >= 2 && step <= 6 && (
            <StepDetails
              step={step}
              reason={reason}
              setReason={setReason}
              dose={dose}
              setDose={setDose}
              frequency={frequency}
              setFrequency={setFrequency}
              time={time}
              setTime={setTime}
              startDate={startDate}
              setStartDate={setStartDate}
            />
          )}
          {step === 7 && (
            <StepSummary name={name} reason={reason} dose={dose} frequency={frequency} time={time} startDate={startDate} />
          )}

          <View className="mt-4 pt-3">
            {step < 7
              ? (
                  <Button label="Siguiente →" onPress={handleNext} className="bg-blue-600" />
                )
              : (
                  <Button label="Guardar Medicamento" onPress={handleConfirm} className="bg-blue-600" />
                )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
