import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Calendar, ExternalLink, Trash2, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface SavedSummary {
  id: number;
  article: Article;
  summary: string;
  createdAt: string;
}

const MySummaries: React.FC = () => {
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);

  useEffect(() => {
    const summaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
    setSavedSummaries(summaries.reverse()); // Show newest first
  }, []);

  const deleteSummary = (id: number) => {
    const updatedSummaries = savedSummaries.filter(summary => summary.id !== id);
    setSavedSummaries(updatedSummaries);
    localStorage.setItem('savedSummaries', JSON.stringify(updatedSummaries.reverse()));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (savedSummaries.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookmarkCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Summaries Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start reading articles and generate AI summaries to see them here. Your saved summaries will appear in this section.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Tip</span>
            </div>
            <p className="text-sm text-gray-600">
              Click on any article and use the "Generate Summary" button to create AI-powered summaries!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Summaries</h1>
        <p className="text-gray-600">Your AI-generated article summaries</p>
      </div>

      <div className="space-y-6">
        {savedSummaries.map((savedSummary) => (
          <div
            key={savedSummary.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {savedSummary.article.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {savedSummary.article.source.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Summarized on {formatDate(savedSummary.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteSummary(savedSummary.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-900 text-sm">AI Summary</span>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {savedSummary.summary}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Original article published {new Date(savedSummary.article.publishedAt).toLocaleDateString()}
                </div>
                <a
                  href={savedSummary.article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Read Original</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySummaries;