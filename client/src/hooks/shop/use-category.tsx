"use client";
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';

export function useCategories() {
    const [categories, setCategories] = useState<{
        _id: string;
        name: string;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get('/shop/categories');
                setCategories(response.data);
                setIsLoading(false);
            } catch (error: any) {
                setError(error);
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);
    return { categories, isLoading, error };
}