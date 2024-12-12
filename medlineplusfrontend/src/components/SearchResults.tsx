import { Card, CardContent } from './ui/card';

interface SearchResult {
  topic_id: string;
  title: string;
  language: string;
  url?: string;
  meta_desc?: string;
  full_summary?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No results found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.topic_id}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
            {result.meta_desc && (
              <p className="text-muted-foreground mb-4">{result.meta_desc}</p>
            )}
            {result.url && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Read more
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 