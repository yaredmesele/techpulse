import { useState, useEffect } from 'react';
import { ChevronLeft, Bookmark, MessageCircle, Share2, ThumbsUp, Loader2, Eye } from 'lucide-react';
import { Article } from '../types';
import { motion } from 'motion/react';
import { fetchArticleDetail } from '../services/api';
import { incrementViewCount, subscribeToViewCount } from '../services/stats';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
}

export default function ArticleDetailView({ article: initialArticle, onBack }: ArticleDetailViewProps) {
  const [article, setArticle] = useState<Article>(initialArticle);
  const [loading, setLoading] = useState(true);
  const [firebaseViews, setFirebaseViews] = useState<number | null>(null);

  useEffect(() => {
    async function loadDetail() {
      // Increment view count via Firebase
      incrementViewCount(initialArticle.id);
      
      const detail = await fetchArticleDetail(initialArticle.id);
      if (detail) {
        setArticle(prev => ({ ...prev, ...detail }));
      }
      setLoading(false);
    }

    // Subscribe to Firebase views
    const unsubscribe = subscribeToViewCount(initialArticle.id, (count) => {
      setFirebaseViews(count);
    });

    loadDetail();
    window.scrollTo(0, 0);

    return () => unsubscribe();
  }, [initialArticle.id]);

  const displayViews = firebaseViews !== null ? firebaseViews.toLocaleString() : article.views;

  return (
    <div className="flex flex-col min-h-screen pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="relative h-[450px] -mx-4">
        <img 
          src={article.imageUrl} 
          className="w-full h-full object-cover" 
          alt={article.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-transparent to-brand/20" />
        
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-50">
          <button 
            onClick={onBack}
            className="p-3 bg-brand/20 backdrop-blur-xl rounded-full text-white hover:bg-brand/40 transition-all active:scale-95 shadow-xl border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="p-3 bg-accent rounded-full text-white shadow-lg active:scale-95 transition-all">
            <Bookmark className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <div className="absolute bottom-8 left-4 right-4">
           <h1 className="text-white text-3xl font-display font-bold leading-tight mb-4 drop-shadow-lg">
             {article.title}
           </h1>
           <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase border border-white/30">
               By {article.author}
             </div>
             <span className="text-white/60 text-xs font-medium">{article.timeAgo}</span>
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold">
                <Eye className="w-3.5 h-3.5" />
                <span>{displayViews}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-8">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-zinc-100 rounded w-full" />
            <div className="h-4 bg-zinc-100 rounded w-5/6" />
            <div className="h-4 bg-zinc-100 rounded w-full" />
            <div className="h-4 bg-zinc-100 rounded w-4/6" />
            <div className="h-4 bg-zinc-100 rounded w-full" />
          </div>
        ) : (
          <div 
            className="text-zinc-600 font-medium leading-relaxed max-w-none 
              [&>p]:mb-4 [&>p]:last:mb-0 
              [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-brand
              [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:text-brand
              [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2
              [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
              [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
              [&>img]:rounded-2xl [&>img]:my-6 [&>img]:w-full [&>img]:h-auto
              [&>blockquote]:border-l-4 [&>blockquote]:border-accent [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
        
        <div className="mt-10 pt-8 border-t border-zinc-100">
          <p className="text-zinc-400 text-sm italic mb-10">
            Source: {article.author}. All rights reserved. Check back for more updates as this story develops.
          </p>
        </div>
      </div>

      {/* Bottom Engagement Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-full py-4 px-8 border border-zinc-100 flex items-center justify-between shadow-2xl z-50">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 group transition-all text-brand">
            <ThumbsUp className="w-5 h-5 text-accent group-active:scale-125 transition-transform" />
            <span className="text-sm font-bold">{article.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 group transition-all text-brand">
            <Eye className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-bold">{displayViews}</span>
          </button>
          <button className="flex items-center gap-1.5 group transition-all text-brand">
            <MessageCircle className="w-5 h-5 text-zinc-400 group-active:scale-125 transition-transform" />
            <span className="text-sm font-bold">{article.comments}</span>
          </button>
        </div>
        <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-brand">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
