import type {
  CallStatus,
  IntakeLog,
  Medication,
  ReactionReport,
  UserProfile,
} from '../types';
import { create } from 'zustand';
import { createSelectors } from '@/lib/utils';

type AloRAMState = {
  user: UserProfile;
  medications: Medication[];
  intakeLogs: IntakeLog[];
  reactionReports: ReactionReport[];
  callStatus: CallStatus;
  callTranscript: string[];
  lastCallSummary: ReactionReport | null;

  // Actions
  setUserProfile: (profile: Partial<UserProfile>) => void;
  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, med: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  logIntake: (medicationId: string, medicationName: string, status: 'taken' | 'skipped') => void;
  addReactionReport: (report: Omit<ReactionReport, 'id' | 'createdAt'>) => void;
  setCallStatus: (status: CallStatus) => void;
  addTranscriptLine: (line: string) => void;
  setLastCallSummary: (summary: ReactionReport | null) => void;
};

const initialUser: UserProfile = {
  name: 'María García',
  phone: '+51 987654321',
  age: '64',
  checkinPreference: 'both',
  emergencyContactName: 'Carlos García (Hijo)',
  emergencyContactPhone: '+51 912345678',
};

const initialMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Losartán',
    reason: 'Presión alta',
    dose: '1 pastilla (50mg)',
    frequency: '1 vez al día',
    times: ['08:00 AM'],
    startDate: '2026-01-10',
    isContinuous: true,
    status: 'active',
  },
  {
    id: 'med-2',
    name: 'Omeprazol',
    reason: 'Protector gástrico',
    dose: '1 cápsula (20mg)',
    frequency: '1 vez al día',
    times: ['07:30 AM'],
    startDate: '2026-02-01',
    isContinuous: true,
    status: 'active',
  },
  {
    id: 'med-3',
    name: 'Paracetamol',
    reason: 'Dolor articular',
    dose: '1 pastilla (500mg)',
    frequency: 'Cada 8 horas (si hay dolor)',
    times: ['09:00 AM', '05:00 PM', '09:00 PM'],
    startDate: '2026-08-20',
    isContinuous: false,
    endDate: '2026-09-05',
    status: 'active',
  },
];

const initialReports: ReactionReport[] = [
  {
    id: 'rep-1',
    medicationId: 'med-1',
    medicationName: 'Losartán',
    description: 'Un poco de mareo leve al levantarme de la cama.',
    onset: 'hace 2 días',
    severity: 'leve',
    channel: 'voice',
    createdAt: '2026-08-27 10:15',
  },
];

const _useAloRAMStore = create<AloRAMState>(set => ({
  user: initialUser,
  medications: initialMedications,
  intakeLogs: [],
  reactionReports: initialReports,
  callStatus: 'idle',
  callTranscript: [],
  lastCallSummary: null,

  setUserProfile: profile =>
    set(state => ({ user: { ...state.user, ...profile } })),

  addMedication: med =>
    set(state => ({
      medications: [
        ...state.medications,
        { ...med, id: `med-${Date.now()}` },
      ],
    })),

  updateMedication: (id, med) =>
    set(state => ({
      medications: state.medications.map(m =>
        m.id === id ? { ...m, ...med } : m,
      ),
    })),

  deleteMedication: id =>
    set(state => ({
      medications: state.medications.filter(m => m.id !== id),
    })),

  logIntake: (medicationId, medicationName, status) =>
    set(state => ({
      intakeLogs: [
        {
          id: `intake-${Date.now()}`,
          medicationId,
          medicationName,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status,
        },
        ...state.intakeLogs,
      ],
    })),

  addReactionReport: report =>
    set(state => ({
      reactionReports: [
        {
          ...report,
          id: `report-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        },
        ...state.reactionReports,
      ],
    })),

  setCallStatus: callStatus => set({ callStatus }),

  addTranscriptLine: line =>
    set(state => ({ callTranscript: [...state.callTranscript, line] })),

  setLastCallSummary: lastCallSummary => set({ lastCallSummary }),
}));

export const useAloRAMStore = createSelectors(_useAloRAMStore);
