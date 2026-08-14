import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (baseURL) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}${endpoint}`);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Optionally fetch initial data here
    }, [baseURL]);

    return { data, loading, error, fetchData };
};

export default useApi;