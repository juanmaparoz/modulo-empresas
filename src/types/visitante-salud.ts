/** Condiciones previas de salud (alineado al turnero / historial clínico). */
export type PreviousConditions = {
  hypertension: boolean;
  hypertensionBpSystolic?: number;
  hypertensionBpDiastolic?: number;
  hypertensionMedication?: string;

  allergy: boolean;
  allergyType?: string;

  diabetes: boolean;
  diabetesType?: string;

  respiratoryProblems: boolean;
  respiratoryProblemType?: string;

  heartCondition: boolean;
  heartConditionType?: string;
  heartConditionAntecedentDetail?: string;

  seizures: boolean;
  pregnancy: boolean;

  currentlyTakingMedications: boolean;
  medicationsDetail?: string;

  acuteMountainSickness: boolean;
  amsDate?: string;
  amsMedicallyTreated?: boolean;

  pulmonaryEdemaAltitude: boolean;
  pulmonaryEdemaDate?: string;
  pulmonaryEdemaMedicallyTreated?: boolean;

  cerebralEdemaAltitude: boolean;
  cerebralEdemaDate?: string;
  cerebralEdemaMedicallyTreated?: boolean;
};

export function emptyPreviousConditions(): PreviousConditions {
  return {
    hypertension: false,
    allergy: false,
    diabetes: false,
    respiratoryProblems: false,
    heartCondition: false,
    seizures: false,
    pregnancy: false,
    currentlyTakingMedications: false,
    acuteMountainSickness: false,
    pulmonaryEdemaAltitude: false,
    cerebralEdemaAltitude: false,
  };
}
