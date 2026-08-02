
import React from 'react';
import type { PredictionResult } from '../types';

interface ResultDisplayProps {
    result: PredictionResult;
}

const getRiskColor = (prediction: PredictionResult['prediction']) => {
    switch (prediction) {
        case 'High Risk':
            return {
                bg: 'bg-red-100',
                border: 'border-red-500',
                text: 'text-red-800',
                pillBg: 'bg-red-500',
            };
        case 'Moderate Risk':
            return {
                bg: 'bg-yellow-100',
                border: 'border-yellow-500',
                text: 'text-yellow-800',
                pillBg: 'bg-yellow-500',
            };
        case 'Low Risk':
            return {
                bg: 'bg-blue-100',
                border: 'border-blue-500',
                text: 'text-blue-800',
                pillBg: 'bg-blue-500',
            };
        case 'No Disease':
        default:
            return {
                bg: 'bg-green-100',
                border: 'border-green-500',
                text: 'text-green-800',
                pillBg: 'bg-green-500',
            };
    }
};

const CheckIcon = () => (
    <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AlertIcon = () => (
    <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const { prediction, explanation, riskFactors, recommendations } = result;
    const colors = getRiskColor(prediction);

    return (
        <div className={`p-6 rounded-xl shadow-lg border-l-4 ${colors.bg} ${colors.border} ${colors.text}`}>
            <div className="flex items-center mb-4">
                <span className={`px-4 py-1 rounded-full text-white text-sm font-bold ${colors.pillBg}`}>
                    {prediction}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
            <p className="mb-6">{explanation}</p>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold mb-2 flex items-center"><AlertIcon />Key Risk Factors</h4>
                    {riskFactors.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {riskFactors.map((factor, index) => (
                                <li key={index}>{factor}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No significant risk factors identified from the data.</p>
                    )}
                </div>

                <div>
                    <h4 className="font-bold mb-2 flex items-center"><CheckIcon />General Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResultDisplay;
