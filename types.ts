
export type Language = 'en' | 'tw';

export interface Translations {
  [key: string]: any;
}

export interface Biomarkers {
  [key: string]: string;
}

export interface TestResult {
  id?: string;
  status: string;
  color: 'green' | 'yellow' | 'red';
  rec: string;
  biomarkers: Biomarkers;
  timestamp: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  availability: string;
  fee: string;
  image: string;
}

export interface BookingDetails {
  doctorName: string;
  date: string;
  time: string;
}

export interface Nutrient {
  name: string;
  value: string;
}

export interface FoodData {
  name: string;
  nutrients: Nutrient[];
  impactScore: 'Low Impact' | 'Moderate Impact' | 'High Impact';
  consumptionImpact: string;
  alternatives: string[];
}

export interface AIReport {
  summary: string;
  observations: string[];
  recommendations: string[];
}

export interface UserProfile {
    uid: string;
    name: string;
    age: string | null;
    gender: string;
    conditions: string[];
    createdAt: string;
}

export interface Vitals {
    systolic: string | null;
    diastolic: string | null;
    glucose: string | null;
    weight: string | null;
    height: string | null;
    timestamp: string;
    bmi: string;
}

export interface DummyUser {
    uid: string;
    email?: string;
    displayName?: string;
    isAnonymous: boolean;
}

export interface AppServices {
    user: DummyUser | null;
    appId: string;
}