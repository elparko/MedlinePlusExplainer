import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
  onError?: (error: Error) => void;
}

export function SearchBar({ onSearchResults, onError }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguage();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.search({
        query: query.trim(),
        language: currentLanguage,
        n_results: 10
      });
      
      onSearchResults(response.results);
    } catch (error) {
      console.error('Search error:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search medical conditions..."
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button 
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
} 