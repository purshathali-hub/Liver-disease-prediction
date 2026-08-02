
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg text-dark font-semibold">AI is analyzing the data...</p>
        </div>
    );
};

export default Loader;
