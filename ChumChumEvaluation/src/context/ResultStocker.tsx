// context/ResultContext.js
import React, { createContext, useState, ReactNode} from 'react';

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
    }[];
}
interface Result {
    eachTimeScore: number[];
    totalScore: number;
    userImageData: string[];
    originalImageData: string[];
    rank: string;
    graphData: ChartData;
}

interface ResultContext {
    result: Result | null;
    setResult: React.Dispatch<React.SetStateAction<Result | null>>;
}

export const ResultStocker = createContext<ResultContext | undefined>(undefined);

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [result, setResult] = useState<Result | null>(null);

    return(
        <ResultStocker.Provider value={{ result, setResult}}>
            {children}
        </ResultStocker.Provider>
    );
};
