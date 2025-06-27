import axios from 'axios';
import { NewsApiResponse } from '../types';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
  },
});

export const newsApi = {
  getTopHeadlines: async (country = 'us', category?: string): Promise<NewsApiResponse> => {
    const response = await api.get('/top-headlines', {
      params: {
        country,
        category,
        pageSize: 20,
      },
    });
    return response.data;
  },

  searchArticles: async (query: string): Promise<NewsApiResponse> => {
    const response = await api.get('/everything', {
      params: {
        q: query,
        sortBy: 'publishedAt',
        pageSize: 20,
        language: 'en',
      },
    });
    return response.data;
  },
};