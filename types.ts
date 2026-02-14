
export enum AppStep {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  SCREENING = 'SCREENING',
  DASHBOARD = 'DASHBOARD'
}

export enum Language {
  EN = 'en',
  AR = 'ar'
}

export enum PumpIntensity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum SystemStatus {
  READY = 'Ready',
  PUMPING = 'Pumping',
  IDLE = 'Idle'
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  day: number; // 0-6 for weekly calendar
}

export interface Flavor {
  id: string;
  name: string;
}
