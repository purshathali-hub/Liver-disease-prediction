
import type { FormField } from './types';

export const INITIAL_PATIENT_DATA = {
    Age: 50,
    Gender: 'Male' as const,
    Total_Bilirubin: 1.1,
    Direct_Bilirubin: 0.3,
    Alkaline_Phosphotase: 200,
    Alamine_Aminotransferase: 40,
    Aspartate_Aminotransferase: 35,
    Total_Protiens: 6.7,
    Albumin: 3.5,
    Albumin_and_Globulin_Ratio: 0.9,
};

export const FORM_FIELDS: FormField[] = [
    { id: 'Age', label: 'Age', type: 'number', placeholder: 'e.g., 45', description: "Patient's age in years." },
    { id: 'Gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], description: "Patient's biological gender." },
    { id: 'Total_Bilirubin', label: 'Total Bilirubin', type: 'number', placeholder: 'e.g., 1.1', description: 'Total bilirubin level in mg/dL. Normal is typically below 1.2 mg/dL.' },
    { id: 'Direct_Bilirubin', label: 'Direct Bilirubin', type: 'number', placeholder: 'e.g., 0.3', description: 'Direct bilirubin level in mg/dL. Normal is typically below 0.3 mg/dL.' },
    { id: 'Alkaline_Phosphotase', label: 'Alkaline Phosphatase', type: 'number', placeholder: 'e.g., 200', description: 'Alkaline Phosphatase level in IU/L. Normal range varies, but often 44 to 147 IU/L.' },
    { id: 'Alamine_Aminotransferase', label: 'Alamine Aminotransferase (ALT)', type: 'number', placeholder: 'e.g., 40', description: 'ALT/SGPT level in IU/L. Normal is typically 7 to 56 IU/L.' },
    { id: 'Aspartate_Aminotransferase', label: 'Aspartate Aminotransferase (AST)', type: 'number', placeholder: 'e.g., 35', description: 'AST/SGOT level in IU/L. Normal is typically 10 to 40 IU/L.' },
    { id: 'Total_Protiens', label: 'Total Proteins', type: 'number', placeholder: 'e.g., 6.7', description: 'Total protein level in g/dL. Normal range is typically 6.0 to 8.3 g/dL.' },
    { id: 'Albumin', label: 'Albumin', type: 'number', placeholder: 'e.g., 3.5', description: 'Albumin level in g/dL. Normal range is typically 3.4 to 5.4 g/dL.' },
    { id: 'Albumin_and_Globulin_Ratio', label: 'Albumin/Globulin Ratio', type: 'number', placeholder: 'e.g., 0.9', description: 'The A/G ratio. Normal range is typically slightly over 1.' },
];
