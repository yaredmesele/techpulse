import { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Cpu, Search, Bell, Settings } from 'lucide-react';
import { Article } from '../types';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface HomeViewProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

export default function HomeView({ articles, onArticleSelect }: HomeViewProps) {
  const { colors, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const breakingNewsItems = articles.slice(0, 4);
  
  useEffect(() => {
    if (searchTerm || breakingNewsItems.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % breakingNewsItems.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
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
    <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.branding}>
          <View style={[styles.logoBox, { backgroundColor: isDark ? colors.surface : '#1b1b1b', borderColor: colors.border }]}>
            <Cpu color={colors.primary} size={24} />
          </View>
          <View>
            <Text style={[styles.brandName, { color: colors.text }]}>TechPulse</Text>
            <Text style={[styles.brandSlogan, { color: colors.textSecondary }]}>Refining Your Tech Horizon</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Bell color={colors.text} size={16} />
            <View style={[styles.notificationBadge, { borderColor: colors.card }]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Settings color={colors.text} size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search style={styles.searchIcon} color={colors.textSecondary} size={16} />
        <TextInput 
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search for news"
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* Breaking News */}
      {!searchTerm && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Breaking News!</Text>
            <TouchableOpacity><Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text></TouchableOpacity>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={breakingNewsItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.85 + 12}
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalScroll}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => onArticleSelect(item)}
                style={styles.breakingCard}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.breakingImage} />
                <View style={styles.breakingGradient} />
                <View style={styles.breakingContent}>
                  <Text style={styles.breakingTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.breakingMeta}>
                    <Text style={styles.breakingAuthor}>{item.author}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.breakingTime}>{item.timeAgo}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Trending News */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchTerm ? `Search Results (${trendingNews.length})` : 'Trending News!'}
          </Text>
          {!searchTerm && <TouchableOpacity><Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text></TouchableOpacity>}
        </View>
        <View style={styles.list}>
          {trendingNews.length > 0 ? (
            trendingNews.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => onArticleSelect(article)}
                style={styles.trendingItem}
              >
                <Image source={{ uri: article.imageUrl }} style={styles.trendingImage} />
                <View style={styles.trendingContent}>
                  <Text style={[styles.trendingTitle, { color: colors.text }]} numberOfLines={2}>{article.title}</Text>
                  <Text style={[styles.trendingSummary, { color: colors.textSecondary }]} numberOfLines={1}>{article.summary}</Text>
                  <View style={styles.trendingFooter}>
                    <View style={[styles.categoryBadgeSmall, { backgroundColor: isDark ? colors.surface : '#f0f0f0' }]}>
                      <Text style={[styles.categoryTextSmall, { color: colors.text }]}>{article.category}</Text>
                    </View>
                    <Text style={[styles.timeText, { color: colors.primary }]}>{article.timeAgo}</Text>
                  </View>
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
    gap: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  brandSlogan: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    backgroundColor: '#EF4444',
    borderRadius: 3,
    borderWidth: 1,
  },
  searchSection: {
    position: 'relative',
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 40,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
  },
  searchInput: {
    height: 44,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  breakingCard: {
    width: width * 0.85,
    height: 192,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  breakingImage: {
    ...StyleSheet.absoluteFill,
  },
  breakingGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(27, 27, 27, 0.4)',
  },
  breakingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  breakingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  breakingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakingAuthor: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  breakingTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  dot: {
    color: 'rgba(255,255,255,0.7)',
  },
  categoryBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    gap: 16,
  },
  trendingItem: {
    flexDirection: 'row',
    gap: 12,
  },
  trendingImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  trendingContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  trendingSummary: {
    fontSize: 10,
  },
  trendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  categoryBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTextSmall: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  emptyView: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
  }
});


