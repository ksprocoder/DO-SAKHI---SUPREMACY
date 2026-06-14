export type FitProfileType = 'standard_adjustment' | 'custom_measurements' | 'stylist_guidance';
export type MeasurementUnit = 'in' | 'cm';

export interface TailoringMeasurements {
  bust?: string;
  waist?: string;
  hips?: string;
  shoulder?: string;
  sleeveLength?: string;
  armhole?: string;
  upperArm?: string;
  kurtiLength?: string;
  bottomWaist?: string;
  bottomLength?: string;
  inseam?: string;
  height?: string;
}

export interface TailoringPreferences {
  fitEase?: 'comfort' | 'regular' | 'relaxed' | '';
  lengthPreference?: string;
  sleevePreference?: string;
  necklinePreference?: string;
  bottomPreference?: string;
}

export interface CustomTailoringProfile {
  enabled: boolean;
  fitProfile: FitProfileType;
  unit: MeasurementUnit;
  measurements: TailoringMeasurements;
  preferences: TailoringPreferences;
  notes?: string;
  confirmedAt?: string;
}
