import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import MySummaries from './components/MySummaries';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useNewsApi } from './hooks/useNewsApi';
import { Article } from './types';

function App() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [currentSection, setCurrentSection] = useState<'home' | 'saved'>('home');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles, loading, error, fetchArticles } = useNewsApi();

  useEffect(() => {
    fetchArticles(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setIsSearchMode(false);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchMode(true);
    fetchArticles(undefined, query);
  };

  const handleNavigate = (section: 'home' | 'saved') => {
    setCurrentSection(section);
    if (section === 'home') {
      setIsSearchMode(false);
      fetchArticles(activeCategory);
    }
  };

  const handleRetry = () => {
    if (isSearchMode) {
      fetchArticles(undefined, searchQuery);
    } else {
      fetchArticles(activeCategory);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />
      
      {currentSection === 'home' && (
        <>
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSearchMode ? `Search Results for "${searchQuery}"` : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`}
              </h1>
              <p className="text-gray-600">
                {isSearchMode 
                  ? `Found ${articles.length} articles matching your search`
                  : 'Stay updated with the latest headlines and stories'
                }
              </p>
            </div>

            {/* Content */}
            {loading && <LoadingSpinner />}
            
            {error && (
              <ErrorMessage message={error} onRetry={handleRetry} />
            )}

            {!loading && !error && articles.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600">
                  {isSearchMode 
                    ? 'Try searching with different keywords'
                    : 'No articles available in this category at the moment'
                  }
                </p>
              </div>
            )}

            {!loading && !error && articles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={`${article.url}-${index}`}
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {currentSection === 'saved' && <MySummaries />}

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default App;