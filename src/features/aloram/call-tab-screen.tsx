import * as React from 'react';
import { FocusAwareStatusBar, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { setVapiMuted, startVapiCall, stopVapiCall } from '@/lib/vapi';
import { useAloRAMStore } from './store/use-aloram-store';

function SummaryCardView({ med, setMed, desc, setDesc, sev, setSev, onSave }: any) {
  return (
    <View className="flex-1 bg-[#F5F2E9] p-5 pt-10">
      <Text className="text-2xl font-black text-stone-900">📝 Nota Final aloRAM</Text>
      <Text className="mb-3 text-xs text-stone-500">Resumen procesado automáticamente tras finalizar la llamada.</Text>

      <ScrollView className="flex-1 space-y-4">
        <View className="space-y-4 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <Input value={med} onChangeText={setMed} label="🔗 Medicamento Identificado" />
          <Input value={desc} onChangeText={setDesc} multiline label="📝 Síntomas Registrados" />
          <Text className="mt-2 text-xs font-bold text-stone-400 uppercase">Intensidad</Text>
          <View className="flex-row space-x-2">
            {(['leve', 'molesto', 'fuerte'] as const).map(item => (
              <Pressable key={item} onPress={() => setSev(item)} className={`flex-1 items-center rounded-xl p-3 ${sev === item ? 'bg-stone-900' : 'bg-stone-100'}`}>
                <Text className={`text-xs font-bold capitalize ${sev === item ? 'text-white' : 'text-stone-700'}`}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable onPress={onSave} className="mt-4 items-center rounded-full bg-stone-900 py-4 shadow-md active:bg-black">
        <Text className="text-base font-black text-white">➤ Confirmar y Guardar en Historial</Text>
      </Pressable>
    </View>
  );
}

function SesamePhoneCallTabInterface({ callState, timerSeconds, messages, isMuted, isSpeaker, onStartCall, onEndCall, onToggleMute, onToggleSpeaker }: any) {
  const formatTimer = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;

  let noteStatusText = 'Presiona abajo para llamar a aloRAM';
  if (callState === 'ringing')
    noteStatusText = 'Conectando con aloRAM...';
  if (callState === 'connected')
    noteStatusText = 'Escuchando la llamada...';

  return (
    <View className="flex-1 justify-between bg-[#F5F2E9] p-4 pt-10">
      <View className="items-center pt-2">
        <View className="rounded-full border border-stone-200/60 bg-white/90 px-6 py-1.5 shadow-xs">
          <Text className="text-sm font-bold text-stone-800">aloRAM</Text>
        </View>
      </View>

      <View className="my-auto flex-1 justify-center px-2">
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
                  <Text className="text-xs text-stone-400 italic">{noteStatusText}</Text>
                )
              : (
                  messages.slice(-4).map((msg: any, idx: number) => (
                    <View key={`m-${idx}`} className="flex-row items-start space-x-2">
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

      <View className="pb-6">
        {callState === 'idle'
          ? (
              <Pressable onPress={onStartCall} className="w-full flex-row items-center justify-center rounded-full bg-stone-900 py-4 shadow-xl active:bg-black">
                <Text className="mr-2 text-xl">📞</Text>
                <Text className="text-lg font-black text-white">Llamar a aloRAM</Text>
              </Pressable>
            )
          : (
              <View className="flex-row items-center justify-between rounded-full border border-stone-300/40 bg-[#E8E4D9] p-2.5 shadow-md">
                <Pressable onPress={onEndCall} className="flex-row items-center space-x-3 rounded-full bg-white px-4 py-2.5 shadow-xs active:bg-red-50">
                  <View className="size-7 items-center justify-center rounded-full bg-red-100">
                    <Text className="text-xs font-bold text-red-600">📞</Text>
                  </View>
                  <Text className="text-sm font-extrabold text-stone-800">{formatTimer(timerSeconds)}</Text>
                </Pressable>

                <View className="flex-row items-center space-x-2">
                  <Pressable onPress={onToggleMute} className={`size-11 items-center justify-center rounded-full shadow-xs ${isMuted ? 'bg-amber-500' : 'bg-white'}`}>
                    <Text className="text-base">{isMuted ? '🔇' : '🎙️'}</Text>
                  </Pressable>

                  <Pressable onPress={onToggleSpeaker} className={`size-11 items-center justify-center rounded-full shadow-xs ${isSpeaker ? 'bg-stone-900' : 'bg-white'}`}>
                    <Text className={`text-base ${isSpeaker ? 'text-white' : 'text-stone-700'}`}>🔊</Text>
                  </Pressable>
                </View>
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
  const [isSpeaker, setIsSpeaker] = React.useState(true);
  const [messages, setMessages] = React.useState<Array<{ sender: string; text: string }>>([]);

  const [summaryMed, setSummaryMed] = React.useState('');
  const [summaryDesc, setSummaryDesc] = React.useState('');
  const [summarySev, setSummarySev] = React.useState<'leve' | 'molesto' | 'fuerte'>('leve');

  const handleStartCall = () => {
    setCallState('ringing');
    setTimerSeconds(0);
    setMessages([]);
    const sampleMed = medications[0]?.name ?? 'Paracetamol 500mg';
    setSummaryMed(sampleMed);
    setSummaryDesc('Consulta de adherencia y síntomas por voz');

    startVapiCall(user.name || 'Omar', medications, {
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
      setMessages(prev => (prev.length === 0 ? [{ sender: 'aloRAM', text: `¡Hola ${user.name || 'Omar'}! Soy aloRAM. ¿Cómo estás hoy con tu ${sampleMed}?` }] : prev));
    }, 1500);
  };

  const handleSaveSummary = () => {
    addReactionReport({ medicationName: summaryMed || 'Medicamento', description: summaryDesc || 'Llamada de voz aloRAM', onset: 'hoy', severity: summarySev, channel: 'voice' });
    setCallState('idle');
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

  React.useEffect(() => {
    if (callState !== 'connected')
      return;
    const interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callState]);

  return (
    <View className="flex-1 bg-[#F5F2E9]">
      <FocusAwareStatusBar />
      {callState === 'summary'
        ? (
            <SummaryCardView med={summaryMed} setMed={setSummaryMed} desc={summaryDesc} setDesc={setSummaryDesc} sev={summarySev} setSev={setSummarySev} onSave={handleSaveSummary} />
          )
        : (
            <SesamePhoneCallTabInterface callState={callState} timerSeconds={timerSeconds} messages={messages} isMuted={isMuted} isSpeaker={isSpeaker} onStartCall={handleStartCall} onEndCall={handleEndCall} onToggleMute={handleToggleMute} onToggleSpeaker={() => setIsSpeaker(!isSpeaker)} />
          )}
    </View>
  );
}
