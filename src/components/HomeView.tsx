import { useState, useMemo, useEffect, useRef } from 'react';
import { Cpu, Search, Bell, Settings, ChevronRight } from 'lucide-react';
import { Article } from '../types';
import { motion } from 'motion/react';

interface HomeViewProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

export default function HomeView({ articles, onArticleSelect }: HomeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const breakingNewsItems = articles.slice(0, 4);
  
  useEffect(() => {
    if (searchTerm) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % breakingNewsItems.length;
        if (scrollRef.current) {
          const container = scrollRef.current;
          const items = container.children;
          if (items[next]) {
            items[next].scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest'
            });
          }
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [searchTerm, breakingNewsItems.length]);

  const trendingNews = useMemo(() => {
    const base = articles.slice(4).length > 0 ? articles.slice(4) : articles.slice(1);
    if (!searchTerm.trim()) return base;
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-accent shadow-lg shadow-brand/20 border border-white/10 overflow-hidden">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base leading-none">TechPulse</h2>
            <p className="text-muted text-[10px] font-medium mt-1">Refining Your Tech Horizon</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 bg-white rounded-full shadow-sm text-brand border border-zinc-50 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
          </button>
          <button className="p-1.5 bg-white rounded-full shadow-sm text-brand border border-zinc-50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for news"
          className="w-full bg-white border border-zinc-100 rounded-full py-3 pl-10 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
      </div>

      {/* Breaking News - Hidden if searching to show filtered results prominently */}
      {!searchTerm && (
        <section className="-mx-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="font-display font-bold text-lg">Breaking News!</h3>
            <button className="text-accent text-xs font-semibold hover:underline">View All</button>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 px-4 pb-2 snap-x snap-mandatory scrollbar-none scroll-smooth"
          >
            {breakingNewsItems.map((article) => (
              <motion.div
                key={article.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onArticleSelect(article)}
                className="relative min-w-[85%] h-48 rounded-[24px] overflow-hidden shadow-lg snap-center cursor-pointer group shrink-0"
              >
                <img 
                  src={article.imageUrl} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={article.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-white font-display font-bold text-base leading-tight mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-white/70 text-[9px] font-medium">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.timeAgo}</span>
                    <span className="ml-auto bg-accent px-2 py-0.5 rounded-full text-white font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending News */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg">
            {searchTerm ? `Search Results (${trendingNews.length})` : 'Trending News!'}
          </h3>
          {!searchTerm && <button className="text-accent text-xs font-semibold hover:underline">View All</button>}
        </div>
        <div className="flex flex-col gap-3">
          {trendingNews.length > 0 ? (
            trendingNews.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onArticleSelect(article)}
                className="flex gap-3 group cursor-pointer"
              >
                <img 
                  src={article.imageUrl} 
                  className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                  alt={article.title}
                />
                <div className="flex flex-col justify-center gap-0.5 flex-1">
                  <h4 className="font-bold text-xs leading-snug line-clamp-2 transition-colors group-hover:text-accent">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-muted font-medium line-clamp-1">{article.summary}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-brand tracking-tight font-bold bg-zinc-100 px-1.5 py-0.5 rounded uppercase">{article.category}</span>
                    <span className="text-[9px] text-accent font-bold">{article.timeAgo}</span>
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

