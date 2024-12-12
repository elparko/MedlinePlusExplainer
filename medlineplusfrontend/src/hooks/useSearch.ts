import { useState } from 'react';
import { apiService } from '@/services/api';

interface SearchResult {
  topic_id: string;
  title: string;
  language: string;
  url: string;
  meta_desc: string;
  full_summary: string;
  // Add other fields as needed
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performSearch = async (query: string, language: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.search({
        query,
        language,
        n_results: 10
      });
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    results,
    isLoading,
    error,
    performSearch
  };
} 