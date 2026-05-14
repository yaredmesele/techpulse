import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { ChevronLeft, Bookmark, MessageCircle, Share2, ThumbsUp, Eye } from 'lucide-react';
import { Article } from '../types';
import { fetchArticleDetail } from '../services/api';
import { incrementViewCount, subscribeToViewCount } from '../services/stats';
import RenderHTML from 'react-native-render-html';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
}

export default function ArticleDetailView({ article: initialArticle, onBack }: ArticleDetailViewProps) {
  const { colors, isDark } = useTheme();
  const [article, setArticle] = useState<Article>(initialArticle);
  const [loading, setLoading] = useState(true);
  const [firebaseViews, setFirebaseViews] = useState<number | null>(null);

  useEffect(() => {
    async function loadDetail() {
      incrementViewCount(initialArticle.id);
      
      const detail = await fetchArticleDetail(initialArticle.id);
      if (detail) {
        setArticle(prev => ({ ...prev, ...detail }));
      }
      setLoading(false);
    }

    const unsubscribe = subscribeToViewCount(initialArticle.id, (count) => {
      setFirebaseViews(count);
    });

    loadDetail();

    return () => unsubscribe();
  }, [initialArticle.id]);

  const displayViews = firebaseViews !== null ? firebaseViews.toLocaleString() : article.views;

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Top Header */}
      <View style={styles.header}>
        <Image source={{ uri: article.imageUrl }} style={styles.headerImage} />
        <View style={styles.gradient} />
        
        <View style={styles.topActions}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]}>
            <Bookmark color="#fff" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
           <Text style={styles.title}>{article.title}</Text>
           <View style={styles.meta}>
             <View style={styles.authorBadge}>
               <Text style={styles.authorText}>By {article.author}</Text>
             </View>
             <Text style={styles.timeAgo}>{article.timeAgo}</Text>
             <View style={styles.viewMeta}>
               <Eye color="rgba(255,255,255,0.8)" size={14} />
               <Text style={styles.viewText}>{displayViews}</Text>
             </View>
           </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentArea}>
        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading content...</Text>
          </View>
        ) : (
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: article.content }}
            tagsStyles={{
              p: { marginBottom: 16, color: colors.text, lineHeight: 22, fontSize: 16 },
              h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: colors.text },
              h2: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: colors.text },
              ul: { marginBottom: 16 },
              li: { marginBottom: 8, fontSize: 16, color: colors.text },
              img: { borderRadius: 16, marginVertical: 20 },
              blockquote: { borderLeftWidth: 4, borderLeftColor: colors.primary, paddingLeft: 16, fontStyle: 'italic', marginVertical: 20 }
            }}
          />
        )}
        
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.sourceText, { color: colors.textSecondary }]}>
            Source: {article.author}. All rights reserved. Check back for more updates as this story develops.
          </Text>
        </View>
      </View>
    </View>
  </ScrollView>
    {/* Bottom Engagement Bar */}
      <View style={styles.engagementBarContainer}>
        <View style={[styles.engagementBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.engagementActions}>
            <TouchableOpacity style={styles.engagementButton}>
              <ThumbsUp color={colors.primary} size={20} />
              <Text style={[styles.engagementText, { color: colors.text }]}>{article.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.engagementButton}>
              <Eye color={colors.textSecondary} size={20} />
              <Text style={[styles.engagementText, { color: colors.text }]}>{displayViews}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.engagementButton}>
              <MessageCircle color={colors.textSecondary} size={20} />
              <Text style={[styles.engagementText, { color: colors.text }]}>{article.comments}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  container: {
    paddingBottom: 120,
  },
  header: {
    height: 450,
    position: 'relative',
  },
  headerImage: {
    ...StyleSheet.absoluteFill,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(27, 27, 27, 0.4)',
  },
  topActions: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(27, 27, 27, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerContent: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 34,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  authorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeAgo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  viewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
  },
  contentArea: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  loadingArea: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#999',
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sourceText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  engagementBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  engagementBar: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  engagementActions: {
    flexDirection: 'row',
    gap: 20,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  engagementText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1b1b1b',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
