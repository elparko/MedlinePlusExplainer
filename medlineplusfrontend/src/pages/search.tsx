import { useSearch } from '@/hooks/useSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { Alert } from '@/components/ui/alert';

export default function SearchPage() {
  const { results, isLoading, error, performSearch } = useSearch();
  const { currentLanguage } = useLanguage();

  const handleSearchResults = (searchResults: any[]) => {
    // Update the results directly instead of calling performSearch
    setResults(searchResults);
  };

  const handleSearchError = (error: Error) => {
    setError(error);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Medical Information Search</h1>
      
      <SearchBar 
        onSearchResults={handleSearchResults}
        onError={handleSearchError}
      />

      {error && (
        <Alert variant="destructive">
          {error.message}
        </Alert>
      )}

      <SearchResults 
        results={results}
        isLoading={isLoading}
      />
    </div>
  );
} 