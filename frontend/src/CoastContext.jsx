import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { FALLBACK_DATASETS } from './data/fallbackData';

const CoastContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const CoastProvider = ({ children }) => {
    const [datasets, setDatasets] = useState(FALLBACK_DATASETS); // Default to fallback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/datasets`, { timeout: 3000 });
            setDatasets(res.data);
            setError(null);
        } catch (err) {
            console.warn("Backend disconnected. Using high-fidelity fallback data.", err);
            setError("Backend connection timed out. Showing fallback data.");
            setDatasets(FALLBACK_DATASETS); // Ensure fallback is used on error
        } finally {
            // Small artificial delay for premium loading feel
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <CoastContext.Provider value={{ datasets, loading, error, refreshData }}>
            {children}
        </CoastContext.Provider>
    );
};

export const useCoast = () => useContext(CoastContext);
