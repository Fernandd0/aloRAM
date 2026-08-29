import * as React from 'react';
import { FocusAwareStatusBar, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { setVapiMuted, startVapiCall, stopVapiCall } from '@/lib/vapi';
import { AloRAMAvatar } from './components/aloram-avatar';
import { useAloRAMStore } from './store/use-aloram-store';

function CallSummaryView({ med, setMed, desc, setDesc, sev, setSev, onSave }: any) {
  return (
    <View className="flex-1 bg-stone-50 p-6 pt-12">
      <Text className="text-2xl font-extrabold text-emerald-800">Esto fue lo que entendí</Text>
      <Text className="mb-4 text-sm text-stone-600">Resumen de tu llamada de voz con aloRAM.</Text>
      <ScrollView className="flex-1 space-y-4">
        <View className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <Input value={med} onChangeText={setMed} label="Medicamento" />
          <Input value={desc} onChangeText={setDesc} label="¿Qué sentiste?" multiline />
          <Text className="mt-4 mb-2 text-xs font-bold text-stone-400 uppercase">Intensidad</Text>
          <View className="flex-row space-x-2">
            {(['leve', 'molesto', 'fuerte'] as const).map(item => (
              <Pressable key={item} onPress={() => setSev(item)} className={`flex-1 items-center rounded-xl p-3 ${sev === item ? 'bg-emerald-600' : 'bg-stone-100'}`}>
                <Text className={`font-bold capitalize ${sev === item ? 'text-white' : 'text-stone-700'}`}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <Pressable onPress={onSave} className="mt-4 items-center rounded-2xl bg-emerald-600 py-4 shadow-lg">
        <Text className="text-base font-extrabold text-white">Guardar en Historial</Text>
      </Pressable>
    </View>
  );
}

function SesameCallInterface({ callState, timerSeconds, messages, isMuted, onStart, onEnd, onToggleMute }: any) {
  const formatTimer = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <View className="flex-1 justify-between p-6 pt-12">
      <View className="items-center">
        <Text className="text-xs font-bold tracking-widest text-emerald-300 uppercase">Sesame AI Voice Engine</Text>
        <Text className="mt-1 text-3xl font-extrabold text-white">aloRAM</Text>
        <Text className="mt-1 text-base text-emerald-200">{callState === 'idle' ? 'Toca para llamar' : callState === 'ringing' ? 'Conectando...' : formatTimer(timerSeconds)}</Text>
      </View>

      <View className="my-auto items-center">
        <AloRAMAvatar size="xl" isCalling={callState === 'connected' || callState === 'ringing'} />
      </View>

      {callState !== 'idle' && (
        <View className="h-44 rounded-3xl border border-emerald-800/50 bg-emerald-900/60 p-4">
          <Text className="mb-2 text-xs font-bold text-emerald-300 uppercase">💬 Transcripción en vivo</Text>
          <ScrollView className="flex-1">
            {messages.map((msg: any, idx: number) => (
              <View key={`msg-${idx}`} className={`mb-2.5 max-w-[85%] rounded-2xl p-3 ${msg.sender === 'aloRAM' ? 'self-start bg-emerald-800/80' : 'self-end bg-teal-700/80'}`}>
                <Text className="text-xs font-bold text-emerald-200">{msg.sender}</Text>
                <Text className="mt-0.5 text-sm font-medium text-white">{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className="mt-6 items-center pb-6">
        {callState === 'idle'
          ? (
              <Pressable onPress={onStart} className="w-full items-center rounded-full bg-emerald-500 py-4 shadow-xl active:bg-emerald-600">
                <Text className="text-lg font-extrabold text-emerald-950">📞 Hablar con aloRAM</Text>
              </Pressable>
            )
          : (
              <View className="w-full flex-row items-center justify-around">
                <Pressable onPress={onToggleMute} className={`size-14 items-center justify-center rounded-full ${isMuted ? 'bg-amber-500' : 'bg-emerald-800'}`}>
                  <Text className="text-xs font-bold text-white">{isMuted ? 'Mute' : 'Micro'}</Text>
                </Pressable>
                <Pressable onPress={onEnd} className="size-20 items-center justify-center rounded-full bg-red-600 shadow-xl">
                  <Text className="text-base font-extrabold text-white">Colgar</Text>
                </Pressable>
              </View>
            )}
      </View>
    </View>
  );
}

export function CallTabScreen() {
  const user = useAloRAMStore.use.user();
  const medications = useAloRAMStore.use.medications();
  const addReactionReport = useAloRAMStore.use.addReactionReport();

  const [callState, setCallState] = React.useState<'idle' | 'ringing' | 'connected' | 'summary'>('idle');
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{ sender: string; text: string }>>([]);

  const [summaryMed, setSummaryMed] = React.useState('');
  const [summaryDesc, setSummaryDesc] = React.useState('');
  const [summarySev, setSummarySev] = React.useState<'leve' | 'molesto' | 'fuerte'>('leve');

  const handleStartCall = () => {
    setCallState('ringing');
    setTimerSeconds(0);
    setMessages([]);
    const sampleMed = medications[0]?.name ?? 'Losartán';
    setSummaryMed(sampleMed);
    setSummaryDesc('Reporte conversacional con aloRAM');

    startVapiCall(user.name || 'Amigo', medications, {
      onCallStart: () => setCallState('connected'),
      onCallEnd: () => setCallState('summary'),
      onTranscript: (text, sender) => {
        setMessages(prev => [...prev, { sender, text }]);
        if (text.length > 5 && sender === user.name)
          setSummaryDesc(text);
      },
      onError: () => setCallState('connected'),
    });

    setTimeout(() => {
      setCallState('connected');
      setMessages(prev => (prev.length === 0 ? [{ sender: 'aloRAM', text: `¡Hola ${user.name || 'amigo'}! Soy aloRAM. ¿Cómo estás hoy con tu ${sampleMed}?` }] : prev));
    }, 1500);
  };

  const handleEndCall = () => {
    stopVapiCall();
    setCallState('summary');
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setVapiMuted(next);
  };

  const handleSaveSummary = () => {
    addReactionReport({ medicationName: summaryMed || 'Medicamento', description: summaryDesc || 'Reporte por voz Vapi AI', onset: 'hoy', severity: summarySev, channel: 'voice' });
    setCallState('idle');
  };

  React.useEffect(() => {
    if (callState !== 'connected')
      return;
    const interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callState]);

  return (
    <View className="flex-1 bg-emerald-950">
      <FocusAwareStatusBar />
      {callState === 'summary'
        ? (
            <CallSummaryView med={summaryMed} setMed={setSummaryMed} desc={summaryDesc} setDesc={setSummaryDesc} sev={summarySev} setSev={setSummarySev} onSave={handleSaveSummary} />
          )
        : (
            <SesameCallInterface callState={callState} timerSeconds={timerSeconds} messages={messages} isMuted={isMuted} onStart={handleStartCall} onEnd={handleEndCall} onToggleMute={handleToggleMute} />
          )}
    </View>
  );
}
