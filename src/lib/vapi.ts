import VapiWeb from '@vapi-ai/web';
import { Platform } from 'react-native';
import 'react-native-get-random-values';

const VAPI_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPI_API_KEY || '60639c9c-4ee0-4b4e-a801-487122d8f68b';
export const VAPI_ASSISTANT_ID = process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID || '3842d719-98ab-4b75-92aa-f2f911c09d35';

let vapiInstance: any = null;

function createMockVapi(noticeMessage?: string) {
  const listeners: Record<string, Array<(...args: any[]) => void>> = {};
  let timer: any = null;

  return {
    on: (event: string, fn: (...args: any[]) => void) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    removeAllListeners: () => {
      if (timer) {
        clearTimeout(timer);
      }
      for (const k in listeners) {
        delete listeners[k];
      }
    },
    start: async () => {
      if (listeners['call-start']) {
        for (const fn of listeners['call-start']) {
          fn();
        }
      }
      timer = setTimeout(() => {
        if (listeners.message) {
          for (const fn of listeners.message) {
            fn({
              type: 'transcript',
              role: 'assistant',
              transcript: noticeMessage || '¡Hola! Soy aloRAM, tu asistente de salud. ¿Cómo te sientes hoy con tu tratamiento?',
            });
          }
        }
      }, 500);
    },
    stop: () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (listeners['call-end']) {
        for (const fn of listeners['call-end']) {
          fn();
        }
      }
    },
    setMuted: () => {},
  };
}

export function getVapiInstance(): any {
  if (!vapiInstance) {
    if (Platform.OS === 'web') {
      try {
        vapiInstance = new VapiWeb(VAPI_PUBLIC_KEY);
      }
      catch (e) {
        console.warn('VapiWeb init error:', e);
        vapiInstance = createMockVapi('No se pudo inicializar el cliente Vapi Web.');
      }
    }
    else {
      try {
        const VapiNative = require('@vapi-ai/react-native').default || require('@vapi-ai/react-native');
        vapiInstance = new VapiNative(VAPI_PUBLIC_KEY);
      }
      catch (e) {
        console.warn('VapiNative TurboModule not supported in this client:', e);
        vapiInstance = createMockVapi(
          'Simulación aloRAM activa. Para voz WebRTC en vivo en móvil, usa Development Build (npx expo run:android). En Web (pnpm web) la voz funciona 100%.',
        );
      }
    }
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
  medications: Array<{ name: string; dose?: string; reason?: string }>,
  callbacks: VapiCallbacks = {},
) {
  const vapi = getVapiInstance();

  // Clear previous listeners
  try {
    vapi.removeAllListeners();
  }
  catch (e) {
    console.warn('Vapi removeAllListeners warning:', e);
  }

  if (callbacks.onCallStart) {
    vapi.on('call-start', () => {
      callbacks.onCallStart?.();
    });
  }
  if (callbacks.onCallEnd) {
    vapi.on('call-end', () => {
      callbacks.onCallEnd?.();
    });
  }
  if (callbacks.onSpeechStart) {
    vapi.on('speech-start', () => {
      callbacks.onSpeechStart?.();
    });
  }
  if (callbacks.onSpeechEnd) {
    vapi.on('speech-end', () => {
      callbacks.onSpeechEnd?.();
    });
  }
  if (callbacks.onError) {
    vapi.on('error', (error: any) => {
      console.error('Vapi Web SDK error event:', error);
      callbacks.onError?.(error);
    });
  }

  vapi.on('message', (message: any) => {
    if (message.type === 'transcript' || message.type === 'transcript[final]') {
      const text = message.transcript;
      const role = message.role === 'assistant' ? 'aloRAM' : userName || 'Tú';
      if (text && callbacks.onTranscript) {
        callbacks.onTranscript(text, role);
      }
    }
  });

  const medSummary = medications.map(m => `${m.name}${m.dose ? ` (${m.dose})` : ''}`).join(', ');

  try {
    if (VAPI_ASSISTANT_ID) {
      await vapi.start(VAPI_ASSISTANT_ID, {
        variableValues: {
          userName: userName || 'Amigo',
          medications: medSummary || 'medicamentos habituales',
        },
      });
    }
    else {
      await vapi.start({
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Eres aloRAM, un asistente médico de voz en español para ${userName || 'el paciente'}.`,
            },
          ],
        },
      });
    }
  }
  catch (error: any) {
    console.error('Vapi start error:', error);
    if (callbacks.onError) {
      callbacks.onError(error);
    }
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
      if (typeof vapiInstance.setMuted === 'function') {
        vapiInstance.setMuted(isMuted);
      }
    }
    catch (e) {
      console.warn('Vapi mute warning:', e);
    }
  }
}
