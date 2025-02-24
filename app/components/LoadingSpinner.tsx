import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="loader" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <style jsx>{`
                .loader {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #09f;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .visually-hidden {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    margin: -1px;
                    padding: 0;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    border: 0;
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;