import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { Search, ChevronLeft, Globe, Heart, Cpu, Briefcase, Shirt, Gamepad2 } from 'lucide-react';
import { Article } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CategoryViewProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  onBack: () => void;
}

export default function CategoryView({ articles, onArticleSelect, onBack }: CategoryViewProps) {
  const { colors, isDark } = useTheme();
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
    { id: 'Environment', icon: Globe, color: '#e8f5e9', textColor: '#2e7d32' },
    { id: 'Health', icon: Heart, color: '#ffebee', textColor: '#c62828' },
    { id: 'Technology', icon: Cpu, color: '#e3f2fd', textColor: '#1565c0' },
    { id: 'Business', icon: Briefcase, color: '#e8eaf6', textColor: '#283593' },
    { id: 'Fashion', icon: Shirt, color: '#fce4ec', textColor: '#ad1457' },
    { id: 'Gaming', icon: Gamepad2, color: '#fff3e0', textColor: '#ef6c00' },
  ] as const;

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>News Category</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search style={styles.searchIcon} color={colors.textSecondary} size={20} />
        <TextInput 
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search for news"
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Category</Text>
          <TouchableOpacity><Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View style={[styles.categoryIconCircle, { backgroundColor: isDark ? colors.surface : cat.color }]}>
                <cat.icon color={isDark ? colors.primary : cat.textColor} size={24} />
              </View>
              <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>{cat.id}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular News */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchTerm ? `Results (${filteredArticles.length})` : 'Popular News!'}
          </Text>
          {!searchTerm && <TouchableOpacity><Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text></TouchableOpacity>}
        </View>
        <View style={styles.list}>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => onArticleSelect(article)}
                style={styles.newsItem}
              >
                <Image source={{ uri: article.imageUrl }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>{article.title}</Text>
                  <Text style={[styles.newsTime, { color: colors.textSecondary }]}>{article.timeAgo}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyView}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No matches for "{searchTerm}"</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 24,
  },
  container: {
    gap: 32,
  },
  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchSection: {
    position: 'relative',
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 48,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
  },
  searchInput: {
    height: 48,
    fontSize: 14,
  },
  section: {
    marginHorizontal: -16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  list: {
    paddingHorizontal: 16,
    gap: 20,
  },
  newsItem: {
    flexDirection: 'row',
    gap: 16,
  },
  newsImage: {
    width: 112,
    height: 80,
    borderRadius: 16,
  },
  newsContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  newsTime: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyView: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
  }
});

