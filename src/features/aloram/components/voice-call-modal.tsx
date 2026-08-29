import * as React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import { Button, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { PhoneIcon } from '@/components/ui/icons';
import { setVapiMuted, speakText, startVapiCall, stopVapiCall } from '@/lib/vapi';
import { useAloRAMStore } from '../store/use-aloram-store';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function IASummaryReportView({ medication, setMedication, description, setDescription, severity, setSeverity, onClose, onSave }: any) {
  return (
    <SafeAreaView className="flex-1 bg-[#F5F2E9]">
      <View className="border-b border-stone-200/60 bg-white p-5 shadow-xs">
        <Text className="text-2xl font-black text-stone-900">📝 Nota Final aloRAM</Text>
        <Text className="mt-1 text-xs text-stone-500">Resumen procesado automáticamente al finalizar la llamada.</Text>
      </View>

      <ScrollView className="flex-1 space-y-4 p-5">
        <View className="space-y-4 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <View className="space-y-2">
            <Text className="text-xs font-bold text-stone-400 uppercase">🔗 Medicamento Identificado</Text>
            <Input value={medication} onChangeText={setMedication} placeholder="Ej. Paracetamol 500mg" />
          </View>

          <View className="space-y-2">
            <Text className="text-xs font-bold text-stone-400 uppercase">📝 Síntomas / Reacción Registrada</Text>
            <Input value={description} onChangeText={setDescription} multiline label="Descripción de síntomas" />

            <Text className="mt-3 text-xs font-bold text-stone-400 uppercase">Intensidad</Text>
            <View className="flex-row space-x-2">
              {(['leve', 'molesto', 'fuerte'] as const).map(sev => (
                <Pressable key={sev} onPress={() => setSeverity(sev)} className={`flex-1 items-center rounded-xl p-3 ${severity === sev ? 'bg-stone-900' : 'bg-stone-100'}`}>
                  <Text className={`text-xs font-bold capitalize ${severity === sev ? 'text-white' : 'text-stone-700'}`}>{sev}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="space-y-2 border-t border-stone-200/60 bg-white p-5">
        <Pressable onPress={onSave} className="items-center rounded-full bg-stone-900 py-4 shadow-md active:bg-black">
          <Text className="text-sm font-black text-white">➤ Confirmar y Guardar en Historial</Text>
        </Pressable>
        <Button label="Cerrar sin guardar" variant="outline" onPress={onClose} />
      </View>
    </SafeAreaView>
  );
}

function SesamePhoneCallScreen({ timerSeconds, isRinging, messages, isMuted, isSpeaker, callError, onToggleMute, onToggleSpeaker, onEndCall }: any) {
  const formatTimer = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F2E9]">
      {/* Top Assistant Name Pill */}
      <View className="items-center pt-4 pb-2">
        <View className="rounded-full border border-stone-200/60 bg-white/90 px-6 py-1.5 shadow-xs">
          <Text className="text-sm font-bold text-stone-800">aloRAM</Text>
        </View>
      </View>

      {/* Main Sesame AI Live Note Card */}
      <View className="my-auto flex-1 justify-center px-4">
        {callError && (
          <View className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Text className="text-xs font-bold text-amber-800">⚠️ Aviso de Conexión</Text>
            <Text className="mt-1 text-xs text-amber-700">{callError}</Text>
          </View>
        )}

        <View className="space-y-3 rounded-3xl border border-stone-200/70 bg-white p-6 shadow-xl">
          <View className="flex-row items-center space-x-2 border-b border-stone-100 pb-3">
            <Text className="text-base">📝</Text>
            <Text className="text-xs font-bold tracking-wider text-stone-400 uppercase">Note</Text>
          </View>

          <Text className="text-2xl font-black text-stone-900">
            Seguimiento de medicamentos
          </Text>

          <Text className="text-xs/relaxed text-stone-600">
            Resumen en vivo de tu conversación por voz con aloRAM sobre tu tratamiento y bienestar.
          </Text>

          <View className="mt-3 space-y-2 border-t border-stone-100 pt-3">
            {messages.length === 0
              ? (
                  <Text className="text-xs text-stone-400 italic">{isRinging ? 'Conectando con aloRAM...' : 'Escuchando la llamada...'}</Text>
                )
              : (
                  messages.slice(-4).map((msg: any, idx: number) => (
                    <View key={`msg-${idx}`} className="flex-row items-start space-x-2">
                      <Text className="text-xs font-bold text-stone-400">•</Text>
                      <Text className="flex-1 text-xs font-medium text-stone-700">
                        <Text className="font-bold text-stone-900">
                          {msg.sender}
                          :
                          {' '}
                        </Text>
                        {msg.text}
                      </Text>
                    </View>
                  ))
                )}
          </View>
        </View>
      </View>

      {/* Bottom Sesame AI Control Bar */}
      <View className="px-5 pb-8">
        <View className="flex-row items-center justify-between rounded-full border border-stone-300/40 bg-[#E8E4D9] p-2.5 shadow-md">
          {/* Left Pill: Red Hangup Icon + Timer */}
          <Pressable onPress={onEndCall} className="flex-row items-center space-x-3 rounded-full bg-white px-4 py-2.5 shadow-xs active:bg-red-50">
            <View className="size-7 items-center justify-center rounded-full bg-red-100">
              <PhoneIcon color="#dc2626" size={16} />
            </View>
            <Text className="text-sm font-extrabold text-stone-800">{formatTimer(timerSeconds)}</Text>
          </Pressable>

          {/* Right Circle Buttons: Mic & Speaker */}
          <View className="flex-row items-center space-x-2">
            <Pressable onPress={onToggleMute} className={`size-11 items-center justify-center rounded-full shadow-xs ${isMuted ? 'bg-amber-500' : 'bg-white'}`}>
              <Text className="text-base">{isMuted ? '🔇' : '🎙️'}</Text>
            </Pressable>

            <Pressable onPress={onToggleSpeaker} className={`size-11 items-center justify-center rounded-full shadow-xs ${isSpeaker ? 'bg-stone-900' : 'bg-white'}`}>
              <Text className={`text-base ${isSpeaker ? 'text-white' : 'text-stone-700'}`}>🔊</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function VoiceCallModal({ visible, onClose }: Props) {
  const user = useAloRAMStore.use.user();
  const medications = useAloRAMStore.use.medications();
  const addReactionReport = useAloRAMStore.use.addReactionReport();

  const [callPhase, setCallPhase] = React.useState<'ringing' | 'connected' | 'summary'>('ringing');
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isSpeaker, setIsSpeaker] = React.useState(true);
  const [transcriptMessages, setTranscriptMessages] = React.useState<Array<{ sender: string; text: string }>>([]);
  const [callError, setCallError] = React.useState<string | null>(null);

  const [summaryMedication, setSummaryMedication] = React.useState('');
  const [summaryDescription, setSummaryDescription] = React.useState('');
  const [summarySeverity, setSummarySeverity] = React.useState<'leve' | 'molesto' | 'fuerte'>('leve');

  React.useEffect(() => {
    if (!visible)
      return;
    setCallPhase('ringing');
    setTimerSeconds(0);
    setTranscriptMessages([]);
    setCallError(null);

    const sampleMed = medications[0]?.name ?? 'Paracetamol 500mg';
    setSummaryMedication(sampleMed);
    setSummaryDescription('Consulta de adherencia y síntomas');

    startVapiCall(user.name || 'Omar', medications, {
      onCallStart: () => {
        setCallPhase('connected');
        setCallError(null);
      },
      onCallEnd: () => setCallPhase('summary'),
      onTranscript: (text, sender) => {
        setTranscriptMessages(prev => [...prev, { sender, text }]);
        if (text.length > 5 && sender === user.name)
          setSummaryDescription(text);
      },
      onError: (err) => {
        console.warn('Vapi error in modal:', err);
        setCallError('Permite el acceso al micrófono para hablar con aloRAM.');
      },
    });

    const t1 = setTimeout(() => {
      setCallPhase(prev => (prev === 'ringing' ? 'connected' : prev));
      const greeting = `¡Hola ${user.name || 'Omar'}! Soy aloRAM. ¿Cómo te sientes hoy con tu ${sampleMed}?`;
      speakText(greeting);
      setTranscriptMessages(prev => prev.length === 0 ? [{ sender: 'aloRAM', text: greeting }] : prev);
    }, 1200);

    const t2 = setTimeout(() => {
      const respText = 'Anotado. He registrado el síntoma de mareo leve. Procura descansar y consultar a tu médico si persiste.';
      speakText(respText);
      setTranscriptMessages(prev => [
        ...prev,
        { sender: user.name || 'Omar', text: 'Hola aloRAM, todo bien pero sentí un mareo leve.' },
        { sender: 'aloRAM', text: respText },
      ]);
      setSummaryMedication(sampleMed);
      setSummaryDescription('Reportó mareo leve tras la toma del medicamento.');
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      stopVapiCall();
    };
  }, [visible, medications, user.name]);

  React.useEffect(() => {
    if (callPhase !== 'connected')
      return;
    const interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callPhase]);

  const handleSaveSummary = () => {
    addReactionReport({ medicationName: summaryMedication || 'Medicamento', description: summaryDescription || 'Llamada de voz aloRAM', onset: 'hoy', severity: summarySeverity, channel: 'voice' });
    onClose();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    setVapiMuted(!isMuted);
  };

  const handleEndCall = () => {
    stopVapiCall();
    setCallPhase('summary');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      {callPhase === 'summary'
        ? (
            <IASummaryReportView medication={summaryMedication} setMedication={setSummaryMedication} description={summaryDescription} setDescription={setSummaryDescription} severity={summarySeverity} setSeverity={setSummarySeverity} onClose={onClose} onSave={handleSaveSummary} />
          )
        : (
            <SesamePhoneCallScreen timerSeconds={timerSeconds} isRinging={callPhase === 'ringing'} messages={transcriptMessages} isMuted={isMuted} isSpeaker={isSpeaker} callError={callError} onToggleMute={handleToggleMute} onToggleSpeaker={() => setIsSpeaker(!isSpeaker)} onEndCall={handleEndCall} />
          )}
    </Modal>
  );
}
