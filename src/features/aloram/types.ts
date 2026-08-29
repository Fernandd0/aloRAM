export type CheckinPreference = 'call' | 'message' | 'both';

export type UserProfile = {
  name: string;
  phone: string;
  age?: string;
  checkinPreference: CheckinPreference;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
};

export type Medication = {
  id: string;
  name: string;
  reason: string; // ej. Presión alta, dolor de cabeza
  dose: string; // ej. 1 pastilla, 500mg
  frequency: string; // ej. 1 vez al día, cada 8 horas
  times: string[]; // ej. ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  isContinuous: boolean;
  status: 'active' | 'paused';
  icon?: string;
};

export type IntakeLog = {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  status: 'taken' | 'skipped';
};

export type SeverityLevel = 'leve' | 'molesto' | 'fuerte';

export type ReactionReport = {
  id: string;
  medicationId?: string;
  medicationName?: string;
  description: string;
  onset: string; // ej. hoy, ayer, hace unos días
  severity: SeverityLevel;
  channel: 'voice' | 'chat';
  createdAt: string;
};

export type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';
