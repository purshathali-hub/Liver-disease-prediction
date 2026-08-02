
import React, { useState, useCallback } from 'react';
import type { PatientData, PredictionResult } from './types';
import { INITIAL_PATIENT_DATA } from './constants';
import { predictLiverDisease } from './services/geminiService';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import Footer from './components/Footer';

function App() {
    const [patientData, setPatientData] = useState<PatientData>(INITIAL_PATIENT_DATA);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormChange = useCallback((field: keyof PatientData, value: string | number) => {
        setPatientData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const result = await predictLiverDisease(patientData);
            setPrediction(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light font-sans text-dark">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <PredictionForm 
                        patientData={patientData}
                        onFormChange={handleFormChange}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                    
                    {isLoading && <Loader />}
                    
                    {error && (
                        <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {prediction && !isLoading && (
                        <div className="mt-8">
                            <ResultDisplay result={prediction} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
