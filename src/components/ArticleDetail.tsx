import React, { useState } from 'react';
import { X, ExternalLink, Calendar, User, Share2, Sparkles, Copy, Check } from 'lucide-react';
import { Article } from '../types';
import { summarizeArticle } from '../services/geminiApi';
import LoadingSpinner from './LoadingSpinner';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSummarize = async () => {
    if (!article.content && !article.description) {
      setSummaryError('No content available to summarize');
      return;
    }

    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      const contentToSummarize = article.content || article.description || '';
      const generatedSummary = await summarizeArticle(contentToSummarize);
      setSummary(generatedSummary);
      
      // Save to localStorage for "My Summaries"
      const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
      const summaryData = {
        id: Date.now(),
        article: article,
        summary: generatedSummary,
        createdAt: new Date().toISOString(),
      };
      savedSummaries.push(summaryData);
      localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));
    } catch (error) {
      setSummaryError('Failed to generate summary. Please try again.');
      console.error('Summary generation error:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || '',
          url: article.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(article.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Article Details</h2>
              <p className="text-sm text-gray-500">{article.source.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Image */}
            {article.urlToImage && (
              <div className="mb-6">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              {article.author && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>

            {/* Description */}
            {article.description && (
              <div className="mb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {article.description}
                </p>
              </div>
            )}

            {/* Content */}
            {article.content && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {article.content.replace('[+chars]', '...')}
                </p>
              </div>
            )}

            {/* AI Summary Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">AI Summary</h3>
                </div>
                {!summary && !isGeneratingSummary && (
                  <button
                    onClick={handleSummarize}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Generate Summary
                  </button>
                )}
              </div>

              {isGeneratingSummary && (
                <div className="text-center py-8">
                  <LoadingSpinner />
                  <p className="text-gray-600 mt-4">Generating AI summary...</p>
                </div>
              )}

              {summaryError && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-700">{summaryError}</p>
                </div>
              )}

              {summary && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {summary}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Read Full Article Button */}
            <div className="text-center">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Read Full Article</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;