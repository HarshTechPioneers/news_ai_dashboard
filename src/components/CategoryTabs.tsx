import React from 'react';
import { TrendingUp, Laptop, Heart, Gamepad2, Briefcase, Zap, Globe, Music } from 'lucide-react';
import { Category } from '../types';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  { id: 'general', name: 'General', icon: 'Globe' },
  { id: 'business', name: 'Business', icon: 'Briefcase' },
  { id: 'technology', name: 'Technology', icon: 'Laptop' },
  { id: 'health', name: 'Health', icon: 'Heart' },
  { id: 'sports', name: 'Sports', icon: 'TrendingUp' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Music' },
  { id: 'science', name: 'Science', icon: 'Zap' },
];

const iconMap = {
  Globe,
  Briefcase,
  Laptop,
  Heart,
  TrendingUp,
  Music,
  Zap,
  Gamepad2,
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;