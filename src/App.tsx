import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import ArticleDetailView from './components/ArticleDetailView';
import { mockArticles } from './data/mockContent';
import { fetchArticles } from './services/api';
import { Article, View } from './types';
import { Bookmark, ChevronRight, Cpu, Loader2 } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchArticles();
      setArticles(data.length > 0 ? data : mockArticles);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-muted text-sm font-mono animate-pulse uppercase tracking-[0.2em]">Synchronizing Data...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView articles={articles} onArticleSelect={handleArticleSelect} />;
      case 'category':
        return <CategoryView articles={articles} onArticleSelect={handleArticleSelect} onBack={() => setCurrentView('home')} />;
      case 'article':
        return selectedArticle ? (
          <ArticleDetailView article={selectedArticle} onBack={() => setCurrentView('home')} />
        ) : <HomeView articles={articles} onArticleSelect={handleArticleSelect} />;
      case 'saved':
        return (
          <div className="flex flex-col items-center justify-center p-20 py-40 bg-white rounded-3xl border border-zinc-100 shadow-sm">
             <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-muted" />
             </div>
             <h3 className="font-bold text-lg">No saved articles yet</h3>
             <p className="text-muted text-sm text-center">Save your favorite news stories to read them later in this section.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col items-center gap-6 py-20">
            <div className="w-24 h-24 bg-brand rounded-[32px] flex items-center justify-center text-accent shadow-2xl shadow-brand/40 border-4 border-white overflow-hidden">
               <Cpu className="w-12 h-12" />
            </div>
            <div className="text-center">
              <h2 className="font-display font-bold text-2xl tracking-tighter">TechPulse Digital</h2>
              <p className="text-muted font-medium text-sm mt-1">Intelligence for the Modern Era</p>
            </div>
            
            <div className="mt-8 w-full max-w-sm space-y-3">
              {['About TechPulse', 'Content Sources', 'Notification Control', 'Privacy Policy', 'Contact Editors'].map(item => (
                <button key={item} className="w-full text-left px-6 py-4 bg-white rounded-2xl border border-zinc-100 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <span className="font-medium text-xs uppercase tracking-widest">{item}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return <HomeView articles={articles} onArticleSelect={handleArticleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-brand">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-[0_0_80px_rgba(0,0,0,0.05)] border-x border-zinc-50 relative overflow-x-hidden">
        <main className={cn(
          "px-4 pb-32 transition-all duration-300",
          currentView === 'article' ? "pt-0" : "pt-8"
        )}>
          {renderContent()}
        </main>

        <BottomNav 
          currentView={currentView === 'article' ? 'home' : currentView} 
          onViewChange={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0 });
          }} 
        />
      </div>
    </div>
  );
}

