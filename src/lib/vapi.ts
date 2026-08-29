import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPI_API_KEY || '60639c9c-4ee0-4b4e-a801-487122d8f68b';
const VAPI_ASSISTANT_ID = process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID;

let vapiInstance: Vapi | null = null;

export function getVapiInstance(): Vapi {
  if (!vapiInstance) {
    vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
  }
  return vapiInstance;
}

export type VapiCallbacks = {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onTranscript?: (text: string, sender: string) => void;
  onError?: (error: any) => void;
};

export async function startVapiCall(
  userName: string,
  medications: Array<{ name: string; dose: string; reason: string }>,
  callbacks: VapiCallbacks = {},
) {
  const vapi = getVapiInstance();

  // Clear previous listeners
  vapi.removeAllListeners();

  if (callbacks.onCallStart)
    vapi.on('call-start', callbacks.onCallStart);
  if (callbacks.onCallEnd)
    vapi.on('call-end', callbacks.onCallEnd);
  if (callbacks.onSpeechStart)
    vapi.on('speech-start', callbacks.onSpeechStart);
  if (callbacks.onSpeechEnd)
    vapi.on('speech-end', callbacks.onSpeechEnd);
  if (callbacks.onError)
    vapi.on('error', callbacks.onError);

  vapi.on('message', (message: any) => {
    if (message.type === 'transcript') {
      const text = message.transcript;
      const role = message.role === 'assistant' ? 'aloRAM' : userName || 'Tú';
      if (text && callbacks.onTranscript) {
        callbacks.onTranscript(text, role);
      }
    }
  });

  const medSummary = medications.map(m => `${m.name} (${m.dose} para ${m.reason})`).join(', ');

  const systemPrompt = `Eres aloRAM, un asistente médico personal y amigo amigable, cálido y empático en español latino. 
Hablas directamente con ${userName || 'tu paciente'} para saber cómo se siente hoy con sus medicamentos: ${medSummary || 'sus remedios'}.
Habla con frases cortas, naturales y humanas. Haz una sola pregunta a la vez. Pregúntale si sintió algún mareo, dolor u otra molestia.`;

  try {
    // Check if user configured an Assistant ID in Vapi Dashboard
    if (VAPI_ASSISTANT_ID) {
      await vapi.start(VAPI_ASSISTANT_ID);
    }
    else {
      // Fallback: Start with inline assistant payload
      await vapi.start({
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
          ],
        },
        voice: {
          provider: 'playht',
          voiceId: 's3://voice-cloning-zero-shot/d9207869-7c85-48b2-a400-d86c75c8793f/original/manifest.json', // Standard fallback voice
        },
      });
    }
  }
  catch (error: any) {
    console.warn('Vapi start error:', error);
    if (callbacks.onError)
      callbacks.onError(error);
  }
}

export function stopVapiCall() {
  if (vapiInstance) {
    try {
      vapiInstance.stop();
    }
    catch (e) {
      console.error('Error stopping Vapi call:', e);
    }
  }
}

export function setVapiMuted(isMuted: boolean) {
  if (vapiInstance) {
    try {
      vapiInstance.setMuted(isMuted);
    }
    catch (e) {
      console.error('Error setting Vapi mute:', e);
    }
  }
}
