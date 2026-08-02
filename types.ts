
export interface PatientData {
  Age: number;
  Gender: 'Male' | 'Female';
  Total_Bilirubin: number;
  Direct_Bilirubin: number;
  Alkaline_Phosphotase: number;
  Alamine_Aminotransferase: number;
  Aspartate_Aminotransferase: number;
  Total_Protiens: number;
  Albumin: number;
  Albumin_and_Globulin_Ratio: number;
}

export interface PredictionResult {
  prediction: 'No Disease' | 'Low Risk' | 'Moderate Risk' | 'High Risk';
  explanation: string;
  riskFactors: string[];
  recommendations: string[];
}

export interface FormField {
    id: keyof PatientData;
    label: string;
    type: 'number' | 'select';
    placeholder?: string;
    description: string;
    options?: string[];
}
