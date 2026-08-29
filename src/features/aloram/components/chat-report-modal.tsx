import * as React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import { Button, Input, Pressable, ScrollView, Text, View } from '@/components/ui';
import { useAloRAMStore } from '../store/use-aloram-store';
import { AloRAMAvatar } from './aloram-avatar';

type Props = { visible: boolean; onClose: () => void };
type ChatMessage = { id: string; sender: 'aloRAM' | 'user'; text: string; options?: string[]; actionType?: string };

function ChatFooterControls({ currentAction, currentOptions, inputText, setInputText, onSelectMed, onSubmitDesc, onSelectOnset, onSelectSev, onClose }: any) {
  return (
    <View className="border-t border-stone-200 bg-white p-4">
      {currentAction === 'medication_select' && (
        <View className="flex-row flex-wrap gap-2">
          {currentOptions.map((opt: string) => (
            <Pressable key={opt} onPress={() => onSelectMed(opt)} className="rounded-full border border-emerald-300 bg-emerald-100 px-4 py-2">
              <Text className="text-sm font-bold text-emerald-800">{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {currentAction === 'input_text' && (
        <View className="flex-row items-center space-x-2">
          <View className="flex-1"><Input placeholder="Escribe lo que sentiste..." value={inputText} onChangeText={setInputText} /></View>
          <Button label="Enviar" onPress={() => onSubmitDesc(inputText)} />
        </View>
      )}

      {currentAction === 'onset_select' && (
        <View className="flex-row flex-wrap gap-2">
          {currentOptions.map((opt: string) => (
            <Pressable key={opt} onPress={() => onSelectOnset(opt)} className="rounded-full border border-stone-300 bg-stone-100 px-4 py-2">
              <Text className="text-sm font-semibold text-stone-800">{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {currentAction === 'severity_select' && (
        <View className="space-y-2">
          {currentOptions.map((opt: string) => (
            <Pressable key={opt} onPress={() => onSelectSev(opt)} className={`items-center rounded-2xl p-3 ${opt.includes('Fuerte') ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <Text className="text-sm font-extrabold text-stone-900">{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {currentAction === 'completed' && <Button label="Finalizar y cerrar" onPress={onClose} />}
    </View>
  );
}

export function ChatReportModal({ visible, onClose }: Props) {
  const medications = useAloRAMStore.use.medications();
  const addReactionReport = useAloRAMStore.use.addReactionReport();
  const user = useAloRAMStore.use.user();

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [selectedMed, setSelectedMed] = React.useState('');
  const [descriptionText, setDescriptionText] = React.useState('');
  const [selectedOnset, setSelectedOnset] = React.useState('');
  const [inputText, setInputText] = React.useState('');

  React.useEffect(() => {
    if (!visible)
      return;
    setMessages([{ id: 'msg-init', sender: 'aloRAM', text: `Hola ${user.name || 'amigo'}, ¿con cuál de tus medicamentos crees que se relaciona esto?`, actionType: 'medication_select', options: medications.map(m => m.name).concat(['Otro']) }]);
  }, [visible, medications, user.name]);

  const handleSelectMed = (medName: string) => {
    setSelectedMed(medName);
    setMessages(prev => [...prev, { id: `m1-${Date.now()}`, sender: 'user', text: medName }, { id: `m2-${Date.now()}`, sender: 'aloRAM', text: 'Entendido. Cuéntame qué sentiste exactamente:', actionType: 'input_text' }]);
  };

  const handleSubmitDesc = (text: string) => {
    if (!text.trim())
      return;
    setDescriptionText(text);
    setInputText('');
    setMessages(prev => [...prev, { id: `m1-${Date.now()}`, sender: 'user', text }, { id: `m2-${Date.now()}`, sender: 'aloRAM', text: '¿Cuándo empezó este síntoma?', actionType: 'onset_select', options: ['Hoy mismo', 'Ayer', 'Hace unos días'] }]);
  };

  const handleSelectOnset = (onset: string) => {
    setSelectedOnset(onset);
    setMessages(prev => [...prev, { id: `m1-${Date.now()}`, sender: 'user', text: onset }, { id: `m2-${Date.now()}`, sender: 'aloRAM', text: '¿Cómo clasificarías la intensidad de esta molestia?', actionType: 'severity_select', options: ['Leve', 'Molesto pero manejable', 'Fuerte o preocupante'] }]);
  };

  const handleSelectSev = (sevLabel: string) => {
    const sev: 'leve' | 'molesto' | 'fuerte' = sevLabel.includes('Fuerte') ? 'fuerte' : sevLabel.includes('Molesto') ? 'molesto' : 'leve';
    setMessages(prev => [...prev, { id: `m1-${Date.now()}`, sender: 'user', text: sevLabel }, { id: `m2-${Date.now()}`, sender: 'aloRAM', text: sev === 'fuerte' ? '🚨 ATENCIÓN: Te recomiendo buscar atención médica.' : '¡Gracias! Ya guardé tu reporte en tu historial.', actionType: 'completed' }]);
    addReactionReport({ medicationName: selectedMed || 'Medicamento', description: descriptionText || 'Reporte', onset: selectedOnset || 'recientemente', severity: sev, channel: 'chat' });
  };

  const currentAction = messages[messages.length - 1]?.actionType;
  const currentOptions = messages[messages.length - 1]?.options ?? [];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView className="flex-1 bg-stone-50">
        <View className="flex-row items-center justify-between border-b border-stone-200 bg-white p-4">
          <View className="flex-row items-center space-x-3">
            <AloRAMAvatar size="sm" />
            <Text className="text-base font-bold text-stone-900">aloRAM</Text>
          </View>
          <Pressable onPress={onClose} className="p-2"><Text className="text-sm font-bold text-stone-500">Cerrar</Text></Pressable>
        </View>
        <ScrollView className="flex-1 space-y-4 p-4">
          {messages.map(msg => (
            <View key={msg.id} className={`mb-3 max-w-[85%] rounded-3xl p-4 ${msg.sender === 'aloRAM' ? 'self-start border border-stone-200 bg-white' : 'self-end bg-emerald-600'}`}>
              <Text className={`text-sm ${msg.sender === 'aloRAM' ? 'text-stone-800' : 'font-medium text-white'}`}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <ChatFooterControls currentAction={currentAction} currentOptions={currentOptions} inputText={inputText} setInputText={setInputText} onSelectMed={handleSelectMed} onSubmitDesc={handleSubmitDesc} onSelectOnset={handleSelectOnset} onSelectSev={handleSelectSev} onClose={onClose} />
      </SafeAreaView>
    </Modal>
  );
}
