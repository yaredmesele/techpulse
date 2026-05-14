import { useState, useMemo } from 'react';
import { Search, ChevronLeft, Globe, Heart, Cpu, Briefcase, Shirt, Gamepad2 } from 'lucide-react';
import { Article } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CategoryViewProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  onBack: () => void;
}

export default function CategoryView({ articles, onArticleSelect, onBack }: CategoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return articles;
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const categories = [
    { id: 'Environment', icon: Globe, color: 'bg-green-100 text-green-600' },
    { id: 'Health', icon: Heart, color: 'bg-red-100 text-red-600' },
    { id: 'Technology', icon: Cpu, color: 'bg-blue-100 text-blue-600' },
    { id: 'Business', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
    { id: 'Gaming', icon: Gamepad2, color: 'bg-orange-100 text-orange-600' },
  ] as const;

  return (
    <div className="flex flex-col gap-8 pb-24">
      {/* Top Bar */}
      <div className="relative flex items-center justify-center py-2">
        <button 
          onClick={onBack}
          className="absolute left-0 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-display font-bold text-xl">News Category</h2>
      </div>

      {/* Search */}
      <div className="relative group">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for news"
          className="w-full bg-white border border-zinc-100 rounded-full py-4 pl-12 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-colors" />
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl">All Category</h3>
          <button className="text-accent text-sm font-semibold">View All</button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button key={cat.id} className="flex flex-col items-center gap-2 group min-w-[70px]">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110",
                cat.color
              )}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-tight">{cat.id}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular News */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl">
            {searchTerm ? `Results (${filteredArticles.length})` : 'Popular News!'}
          </h3>
          {!searchTerm && <button className="text-accent text-sm font-semibold">View All</button>}
        </div>
        <div className="flex flex-col gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onArticleSelect(article)}
                className="flex gap-4 group cursor-pointer"
              >
                <img 
                  src={article.imageUrl} 
                  className="w-28 h-20 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                  alt={article.title}
                />
                <div className="flex flex-col justify-between gap-1 flex-1">
                  <h4 className="font-bold text-sm leading-tight line-clamp-2 transition-colors group-hover:text-accent">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted font-medium">
                     <span>{article.timeAgo}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted text-sm">No matches for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
