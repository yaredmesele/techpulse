
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  timeAgo: string;
  author: string;
  imageUrl: string;
  readTime: string;
  likes: string;
  comments: string;
  views: string;
  isBookmarked?: boolean;
}

export type View = 'home' | 'category' | 'saved' | 'profile' | 'article';
