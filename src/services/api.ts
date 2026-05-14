import { Article } from '../types';

interface ApiBlog {
  id: number;
  title: string;
  description: string | null;
  images: string[];
  created_at: string;
  like_count: number;
  view_count: number;
  source_name: string | null;
}

interface ApiCategory {
  id: number;
  name: string;
  blogs: {
    data: ApiBlog[];
  };
}

interface ApiResponse {
  success: boolean;
  data: ApiCategory[];
}

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

function getTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch('https://blogit.freedomforexacademy.com/api/blog-list');
    const result: ApiResponse = await response.json();

    if (!result.success) throw new Error('API failed');

    const allArticles: Article[] = [];
    const articlesMap = new Map<string, number>();

    result.data.forEach(category => {
      category.blogs.data.forEach(blog => {
        const description = blog.description || "";
        const cleanSummary = stripHtml(description).slice(0, 150);
        const timestamp = new Date(blog.created_at).getTime();
        
        allArticles.push({
          id: blog.id.toString(),
          title: blog.title,
          summary: cleanSummary + (cleanSummary.length >= 150 ? '...' : ''),
          content: description,
          category: category.name,
          date: new Date(blog.created_at).toLocaleDateString(),
          timeAgo: getTimeAgo(blog.created_at),
          author: blog.source_name || 'TechPulse',
          imageUrl: blog.images[0] || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
          readTime: `${Math.max(1, Math.floor(description.length / 500))} min`,
          likes: blog.like_count >= 1000 ? `${(blog.like_count / 1000).toFixed(1)}K` : blog.like_count.toString(),
          comments: '0',
          views: blog.view_count?.toString() || (Math.floor(Math.random() * 500) + 100).toString(),
          isBookmarked: false
        });
        articlesMap.set(blog.id.toString(), timestamp);
      });
    });

    return allArticles.sort((a, b) => {
      const timeA = articlesMap.get(a.id) || 0;
      const timeB = articlesMap.get(b.id) || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function fetchArticleDetail(id: string): Promise<Partial<Article> | null> {
  try {
    const response = await fetch(`https://blogit.freedomforexacademy.com/api/blog-detail/${id}`);
    const result = await response.json();

    if (!result.success || !result.data) return null;

    const blog = result.data;
    return {
      id: blog.id.toString(),
      title: blog.title,
      content: blog.description || "",
      imageUrl: blog.images?.[0] || blog.background_image || undefined,
      likes: blog.like_count?.toString() || "0",
      views: blog.view_count?.toString() || "0",
      date: blog.created_at ? new Date(blog.created_at).toLocaleDateString() : undefined,
    };
  } catch (error) {
    console.error('Fetch detail error:', error);
    return null;
  }
}

export async function incrementViewCount(blogId: string): Promise<void> {
  try {
    await fetch('https://blogit.freedomforexacademy.com/api/add-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          type: 'view',
          blog_ids: [blogId]
        }
      ]),
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}
