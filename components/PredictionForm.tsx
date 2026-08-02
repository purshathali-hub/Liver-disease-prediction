
import React from 'react';
import type { PatientData } from '../types';
import { FORM_FIELDS } from '../constants';

interface PredictionFormProps {
    patientData: PatientData;
    onFormChange: (field: keyof PatientData, value: string | number) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const PredictionForm: React.FC<PredictionFormProps> = ({ patientData, onFormChange, onSubmit, isLoading }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-dark mb-6">Enter Patient Data</h2>
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {FORM_FIELDS.map((field) => (
                        <div key={field.id} className="group">
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                {field.label}
                                <span className="relative">
                                  <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-2 py-1 text-xs text-white rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-full opacity-0 m-4 mx-auto w-48 text-center">
                                      {field.description}
                                  </span>
                                  <InfoIcon />
                                </span>
                            </label>
                            {field.type === 'number' ? (
                                <input
                                    type="number"
                                    name={field.id}
                                    id={field.id}
                                    step="any"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                    placeholder={field.placeholder}
                                    value={patientData[field.id]}
                                    onChange={(e) => onFormChange(field.id, parseFloat(e.target.value) || 0)}
                                    required
                                />
                            ) : (
                                <select
                                    name={field.id}
                                    id={field.id}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                    value={patientData[field.id]}
                                    onChange={(e) => onFormChange(field.id, e.target.value)}
                                    required
                                >
                                    {field.options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center items-center py-3 px-12 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        {isLoading ? 'Analyzing...' : 'Predict Disease Risk'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PredictionForm;
