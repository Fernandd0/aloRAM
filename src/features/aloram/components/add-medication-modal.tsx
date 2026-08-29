import * as React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import { Button, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { useAloRAMStore } from '../store/use-aloram-store';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MEDICATION_SUGGESTIONS = [
  'Paracetamol',
  'Losartán',
  'Omeprazol',
  'Amoxicilina',
  'Metformina',
  'Ibuprofeno',
  'Aspirina',
  'Atorvastatina',
];

const FREQUENCY_OPTIONS = [
  '1 vez al día',
  '2 veces al día (cada 12h)',
  '3 veces al día (cada 8h)',
  'Solo cuando tengo dolor',
];

function StepName({ name, setName }: { name: string; setName: (v: string) => void }) {
  return (
    <View className="my-auto space-y-4">
      <Text className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">
        1. ¿Qué medicamento estás tomando?
      </Text>
      <Input placeholder="Ej. Paracetamol o Losartán" value={name} onChangeText={setName} autoFocus />
      <Text className="mt-2 text-xs font-semibold text-stone-400">Sugerencias rápidas:</Text>
      <View className="flex-row flex-wrap gap-2 pt-1">
        {MEDICATION_SUGGESTIONS.slice(0, 6).map(sugg => (
          <Pressable key={sugg} onPress={() => setName(sugg)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:bg-emerald-950">
            <Text className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
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
        <Text className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">2. ¿Para qué te lo recetaron?</Text>
        <Input placeholder="Ej. Presión alta" value={reason} onChangeText={setReason} autoFocus />
      </View>
    );
  }
  if (step === 3) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">3. ¿Cuánto tomas cada vez? (Dosis)</Text>
        <Input placeholder="Ej. 1 pastilla, 500mg" value={dose} onChangeText={setDose} autoFocus />
      </View>
    );
  }
  if (step === 4) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">4. ¿Cuántas veces al día?</Text>
        <ScrollView className="max-h-60 space-y-2">
          {FREQUENCY_OPTIONS.map(opt => (
            <Pressable key={opt} onPress={() => setFrequency(opt)} className={`rounded-2xl border p-4 ${frequency === opt ? 'border-emerald-600 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
              <Text className="font-semibold text-stone-800">{opt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }
  if (step === 5) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">5. ¿A qué hora sueles tomarlo?</Text>
        <Input placeholder="Ej. 08:00 AM" value={time} onChangeText={setTime} />
      </View>
    );
  }
  if (step === 6) {
    return (
      <View className="my-auto space-y-4">
        <Text className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">6. ¿Desde cuándo lo estás tomando?</Text>
        <Input placeholder="Ej. Hoy" value={startDate} onChangeText={setStartDate} />
      </View>
    );
  }
  return null;
}

function StepSummary({
  name,
  reason,
  dose,
  frequency,
  time,
  startDate,
}: {
  name: string;
  reason: string;
  dose: string;
  frequency: string;
  time: string;
  startDate: string;
}) {
  return (
    <ScrollView className="my-auto">
      <Text className="mb-2 text-2xl font-extrabold text-stone-800 dark:text-stone-100">7. Confirmar Medicamento</Text>
      <View className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 dark:bg-emerald-950/40">
        <Text className="text-xs font-bold text-emerald-700 uppercase">Resumen del tratamiento</Text>
        <Text className="mt-2 text-2xl font-bold text-stone-900">{name || 'Medicamento'}</Text>
        <View className="mt-4 space-y-2 border-t border-emerald-200/60 pt-3">
          <Text className="text-sm text-stone-700">
            🎯 Motivo:
            {reason || 'General'}
          </Text>
          <Text className="text-sm text-stone-700">
            💊 Dosis:
            {dose || '1 toma'}
          </Text>
          <Text className="text-sm text-stone-700">
            ⏰ Frecuencia:
            {frequency || 'Diario'}
            {' '}
            (
            {time}
            )
          </Text>
          <Text className="text-sm text-stone-700">
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
      name: name || 'Medicamento',
      reason: reason || 'Tratamiento personal',
      dose: dose || '1 toma',
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
      <SafeAreaView className="flex-1 bg-stone-50 dark:bg-stone-900">
        <View className="flex-1 justify-between p-5">
          <View>
            <View className="flex-row items-center justify-between">
              <Pressable onPress={step === 1 ? onClose : handleBack} className="p-2">
                <Text className="text-sm font-semibold text-emerald-700">{step === 1 ? 'Cancelar' : '← Volver'}</Text>
              </Pressable>
              <Text className="text-xs font-bold text-stone-400">
                Paso
                {step}
                {' '}
                de 7
              </Text>
            </View>
            <View className="mt-2 h-2 w-full rounded-full bg-stone-200">
              <View className="h-full rounded-full bg-emerald-600" style={{ width: `${(step / 7) * 100}%` }} />
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
            {step < 7 ? <Button label="Siguiente →" onPress={handleNext} /> : <Button label="Guardar Medicamento" onPress={handleConfirm} />}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
