import { useState, useEffect } from 'react';
import { View as RNView, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import ArticleDetailView from './components/ArticleDetailView';
import { mockArticles } from './data/mockContent';
import { fetchArticles } from './services/api';
import { Article, View } from './types';
import { Bookmark, ChevronRight, Cpu, Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const { width } = Dimensions.get('window');

function AppContent() {
  const { colors, isDark, toggleTheme } = useTheme();
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
  };

  const renderContent = () => {
    if (loading) {
      return (
        <RNView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Synchronizing Data...</Text>
        </RNView>
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
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <RNView style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
               <RNView style={[styles.iconCircle, { backgroundColor: isDark ? '#262626' : '#f9f9f9' }]}>
                  <Bookmark color={colors.textSecondary} size={32} />
               </RNView>
               <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved articles yet</Text>
               <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Save your favorite news stories to read them later in this section.</Text>
            </RNView>
          </ScrollView>
        );
      case 'profile':
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <RNView style={styles.profileContainer}>
              <RNView style={[styles.avatarContainer, { backgroundColor: isDark ? colors.surface : '#1b1b1b', borderColor: colors.card }]}>
                 <Cpu color={colors.primary} size={48} />
              </RNView>
              <RNView style={styles.profileHeader}>
                <Text style={[styles.profileName, { color: colors.text }]}>TechPulse Digital</Text>
                <Text style={[styles.profileSub, { color: colors.textSecondary }]}>Intelligence for the Modern Era</Text>
              </RNView>
              
              <RNView style={styles.menuContainer}>
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={toggleTheme}>
                  <RNView style={styles.menuLeft}>
                    {isDark ? <Sun size={16} color={colors.primary} /> : <Moon size={16} color={colors.primary} />}
                    <Text style={[styles.menuText, { color: colors.text, marginLeft: 12 }]}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
                  </RNView>
                  <ChevronRight color={colors.textSecondary} size={16} />
                </TouchableOpacity>

                {['About TechPulse', 'Content Sources', 'Notification Control', 'Privacy Policy', 'Contact Editors'].map(item => (
                  <TouchableOpacity key={item} style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.menuText, { color: colors.text }]}>{item}</Text>
                    <ChevronRight color={colors.textSecondary} size={16} />
                  </TouchableOpacity>
                ))}
              </RNView>
            </RNView>
          </ScrollView>
        );
      default:
        return <HomeView articles={articles} onArticleSelect={handleArticleSelect} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RNView style={[styles.container, { backgroundColor: colors.background }]}>
        <RNView style={styles.contentContainer}>
          {renderContent()}
        </RNView>

        <BottomNav 
          currentView={currentView === 'article' ? 'home' : currentView} 
          onViewChange={(v) => {
            setCurrentView(v);
            setSelectedArticle(null); // Clear selected article when switching tabs
          }} 
        />
      </RNView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 24,
  },
  centerContainer: {
    flex: 1,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '500',
  },
  emptyContainer: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  profileHeader: {
    marginTop: 24,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSub: {
    fontSize: 14,
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 32,
    width: '100%',
  },
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  }
});

