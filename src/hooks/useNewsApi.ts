import { useState, useEffect } from 'react';
import { Article } from '../types';
import { newsApi } from '../services/newsApi';

export const useNewsApi = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, Article[]>>(new Map());

  const fetchArticles = async (category?: string, query?: string) => {
    const cacheKey = category || query || 'general';
    
    // Check cache first
    if (cache.has(cacheKey)) {
      setArticles(cache.get(cacheKey)!);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (query) {
        response = await newsApi.searchArticles(query);
      } else {
        response = await newsApi.getTopHeadlines('us', category);
      }

      const validArticles = response.articles.filter(
        article => article.title && article.title !== '[Removed]'
      );

      setArticles(validArticles);
      
      // Cache the results
      setCache(prev => new Map(prev.set(cacheKey, validArticles)));
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    fetchArticles,
  };
};