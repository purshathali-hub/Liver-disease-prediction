
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-light mt-12 py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="font-bold text-red-400 mb-2">DISCLAIMER</p>
                <p className="text-sm">
                    This tool provides a prediction for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
