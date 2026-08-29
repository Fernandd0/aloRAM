import * as React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import { Button, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { setVapiMuted, startVapiCall, stopVapiCall } from '@/lib/vapi';
import { useAloRAMStore } from '../store/use-aloram-store';
import { AloRAMAvatar } from './aloram-avatar';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function SummaryView({ medication, setMedication, description, setDescription, severity, setSeverity, onClose, onSave }: any) {
  return (
    <View className="flex-1 bg-stone-50 p-5">
      <Text className="text-2xl font-bold text-emerald-800">Esto fue lo que entendí</Text>
      <Text className="mb-4 text-sm text-stone-600">Resumen automático de tu conversación por voz con aloRAM.</Text>
      <ScrollView className="flex-1 space-y-4">
        <View className="rounded-2xl border border-stone-200 bg-white p-4">
          <Input value={medication} onChangeText={setMedication} label="Medicamento" />
          <Input value={description} onChangeText={setDescription} label="¿Qué sentiste?" multiline />
          <Text className="mt-4 mb-2 text-xs font-bold text-stone-400 uppercase">Intensidad</Text>
          <View className="flex-row space-x-2">
            {(['leve', 'molesto', 'fuerte'] as const).map(sev => (
              <Pressable key={sev} onPress={() => setSeverity(sev)} className={`flex-1 items-center rounded-xl p-3 ${severity === sev ? 'bg-emerald-600' : 'bg-stone-100'}`}>
                <Text className={`font-bold capitalize ${severity === sev ? 'text-white' : 'text-stone-700'}`}>{sev}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="mt-4 flex-row space-x-3">
        <Button label="Descartar" variant="outline" onPress={onClose} className="flex-1" />
        <Button label="Confirmar y Guardar" onPress={onSave} className="flex-1" />
      </View>
    </View>
  );
}

function ActiveCallScreen({ timerSeconds, isRinging, showTranscript, setShowTranscript, messages, isMuted, onToggleMute, onEndCall }: any) {
  const formatTimer = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <View className="flex-1 justify-between p-6">
      <View className="items-center pt-8">
        <Text className="text-xs font-semibold tracking-widest text-emerald-200 uppercase">Llamada de voz conversacional (Vapi AI)</Text>
        <Text className="mt-1 text-3xl font-extrabold text-white">aloRAM</Text>
        <Text className="mt-1 text-base text-emerald-100">{isRinging ? 'Conectando...' : formatTimer(timerSeconds)}</Text>
      </View>

      <View className="my-6 items-center">
        <AloRAMAvatar size="xl" isCalling={!isRinging} />
      </View>

      <View className="flex-1 rounded-3xl bg-emerald-950/60 p-4">
        <View className="mb-2 flex-row items-center justify-between border-b border-emerald-800/40 pb-2">
          <Text className="text-xs font-bold text-emerald-300 uppercase">💬 Transcripción Vapi en vivo</Text>
          <Pressable onPress={() => setShowTranscript(!showTranscript)}>
            <Text className="text-xs text-emerald-300 underline">{showTranscript ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        </View>

        {showTranscript && (
          <ScrollView className="flex-1">
            {messages.map((msg: any, idx: number) => (
              <View key={`m-${idx}`} className={`mb-3 max-w-[85%] rounded-2xl p-3 ${msg.sender === 'aloRAM' ? 'self-start bg-emerald-800/80' : 'self-end bg-teal-700/80'}`}>
                <Text className="text-xs font-bold text-emerald-200">{msg.sender}</Text>
                <Text className="mt-0.5 text-sm font-medium text-white">{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View className="mt-6 flex-row items-center justify-around pb-4">
        <Pressable onPress={onToggleMute} className={`size-14 items-center justify-center rounded-full ${isMuted ? 'bg-amber-500' : 'bg-emerald-800'}`}>
          <Text className="text-xs font-bold text-white">{isMuted ? 'Mute' : 'Micro'}</Text>
        </Pressable>

        <Pressable onPress={onEndCall} className="size-20 items-center justify-center rounded-full bg-red-600 shadow-lg">
          <Text className="text-base font-extrabold text-white">Colgar</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function VoiceCallModal({ visible, onClose }: Props) {
  const user = useAloRAMStore.use.user();
  const medications = useAloRAMStore.use.medications();
  const addReactionReport = useAloRAMStore.use.addReactionReport();

  const [callPhase, setCallPhase] = React.useState<'ringing' | 'connected' | 'summary'>('ringing');
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [showTranscript, setShowTranscript] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [transcriptMessages, setTranscriptMessages] = React.useState<Array<{ sender: string; text: string }>>([]);

  const [summaryMedication, setSummaryMedication] = React.useState('');
  const [summaryDescription, setSummaryDescription] = React.useState('');
  const [summarySeverity, setSummarySeverity] = React.useState<'leve' | 'molesto' | 'fuerte'>('leve');

  React.useEffect(() => {
    if (!visible)
      return;

    setCallPhase('ringing');
    setTimerSeconds(0);
    setTranscriptMessages([]);

    const sampleMed = medications[0]?.name ?? 'Losartán';
    setSummaryMedication(sampleMed);
    setSummaryDescription('Reporte conversacional con aloRAM');

    // Start Vapi Call
    startVapiCall(
      user.name || 'Amigo',
      medications,
      {
        onCallStart: () => {
          setCallPhase('connected');
        },
        onCallEnd: () => {
          setCallPhase('summary');
        },
        onTranscript: (text, sender) => {
          setTranscriptMessages(prev => [...prev, { sender, text }]);
          if (text.length > 5 && sender === user.name) {
            setSummaryDescription(text);
          }
        },
        onError: (err) => {
          console.error('Vapi Error:', err);
          setCallPhase('connected'); // Fallback if web audio permission or dev fallback
        },
      },
    );

    // Fallback simulation timer if Vapi Web connection is pending
    const fallbackTimer = setTimeout(() => {
      setCallPhase('connected');
      setTranscriptMessages(prev =>
        prev.length === 0
          ? [{ sender: 'aloRAM', text: `¡Hola ${user.name || 'amigo'}! Soy aloRAM. ¿Cómo estás hoy con tu ${sampleMed}?` }]
          : prev,
      );
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      stopVapiCall();
    };
  }, [visible, medications, user.name]);

  React.useEffect(() => {
    if (callPhase !== 'connected')
      return;
    const interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callPhase]);

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setVapiMuted(nextMute);
  };

  const handleEndCall = () => {
    stopVapiCall();
    setCallPhase('summary');
  };

  const handleSaveSummary = () => {
    addReactionReport({
      medicationName: summaryMedication || 'Medicamento',
      description: summaryDescription || 'Reporte de voz registrado con Vapi AI',
      onset: 'hoy',
      severity: summarySeverity,
      channel: 'voice',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView className="flex-1 bg-emerald-900">
        {callPhase === 'summary'
          ? (
              <SummaryView medication={summaryMedication} setMedication={setSummaryMedication} description={summaryDescription} setDescription={setSummaryDescription} severity={summarySeverity} setSeverity={setSummarySeverity} onClose={onClose} onSave={handleSaveSummary} />
            )
          : (
              <ActiveCallScreen timerSeconds={timerSeconds} isRinging={callPhase === 'ringing'} showTranscript={showTranscript} setShowTranscript={setShowTranscript} messages={transcriptMessages} isMuted={isMuted} onToggleMute={handleToggleMute} onEndCall={handleEndCall} />
            )}
      </SafeAreaView>
    </Modal>
  );
}
