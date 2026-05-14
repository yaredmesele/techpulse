import { Home, Grid, Bookmark, User } from 'lucide-react';
import { View } from '../types';
import { cn } from '../lib/utils';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'category', label: 'Category', icon: Grid },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 px-6 py-3 pb-8 sm:pb-6 flex items-center justify-between">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id as View)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-300 relative",
            currentView === tab.id ? "text-accent" : "text-muted hover:text-brand"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            currentView === tab.id && "bg-accent/10"
          )}>
            <tab.icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          {currentView === tab.id && (
            <div className="absolute -top-1 w-1 h-1 bg-accent rounded-full" />
          )}
        </button>
      ))}
    </nav>
  );
}
