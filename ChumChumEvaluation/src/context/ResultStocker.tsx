// context/ResultContext.js
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface Result {
    eachTimeScore: number[];
    totalScore: number;
    userImageData: string[];
    originalImageData: string[];

}

interface ResultContext {
    result: Result | null;
    setResult: React.Dispatch<React.SetStateAction<Result | null>>;
}

export const ResultStocker = createContext<ResultContext | undefined>(undefined);

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [result, setResult] = useState<Result | null>(null);

    const calculateTotalScore = () => Number{
        let total = 0.0;
        result?.eachTimeScore.forEach((score) => {
            total += score;
        });

        return total;
    };
    
    useEffect(() => {
            if(result){
                let totalScore = calculateTotalScore();
            }
        },[result]
    );
    return (
      <ResultStocker.Provider value={{ result, setResult }}>
        {children}
      </ResultStocker.Provider>
    );
  };
