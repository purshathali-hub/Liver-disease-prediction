
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-primary shadow-md">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    AI Liver Disease Predictor
                </h1>
                <p className="text-secondary mt-1">
                    An informational tool for predicting liver disease risk in rural populations.
                </p>
            </div>
        </header>
    );
};

export default Header;
