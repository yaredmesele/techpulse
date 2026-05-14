
import { Article } from '../types';

export const mockArticles: Article[] = [
  {
    id: '1',
    category: 'Health',
    title: 'Four Cases Of Covid Subvariant BF.7 Detected In Bengal; All From US',
    summary: 'The health department has reported new cases of the subvariant, tracing origins back to international travel.',
    content: `
India's health minister has called for a return to Covid-appropriate behaviour, including wearing masks in public, as the country steps up surveillance of cases.

Top health officials have also asked people to get vaccinated and take booster doses. India had relaxed its mask-wearing rules earlier this year after a drop in infection levels.

Over the past few months, India reported four Covid-19 cases caused by BF.7, the Omicron subvariant linked to a spike in cases in China.
    `,
    date: 'June 10, 2023',
    timeAgo: '2 hours ago',
    author: 'Economics Times',
    readTime: '5 min',
    likes: '12.5K',
    comments: '10.6K',
    views: '45.2K',
    imageUrl: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    category: 'Environment',
    title: "Barrington Lake wildfire 'being held' not expected to move weather permitting",
    summary: 'A wildfire in Shelburne County, N.S. is showing signs of stabilization according to local authorities.',
    content: 'Detailed content about the Barrington Lake wildfire...',
    date: 'June 10, 2023',
    timeAgo: '15 min ago',
    author: 'CBC News',
    readTime: '3 min',
    likes: '1.2K',
    comments: '400',
    views: '3.1K',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    category: 'Technology',
    title: 'Physicists discover important new property for graphene conventional form',
    summary: 'A breakthrough in material science could lead to next-generation computing efficiency.',
    content: 'Detailed content about graphene research...',
    date: 'June 10, 2023',
    timeAgo: '35 min ago',
    author: 'Science Daily',
    readTime: '6 min',
    likes: '8.4K',
    comments: '2.1K',
    views: '12.8K',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    category: 'Business',
    title: 'Saudi Arabia will host the 10th session of the Arab-Chinese Business Conference',
    summary: 'Investment and trade between the regions expected to reach new highs during the summit.',
    content: 'Detailed content about the trade conference...',
    date: 'June 10, 2023',
    timeAgo: '50 min ago',
    author: 'Reuters',
    readTime: '4 min',
    likes: '5.2K',
    comments: '1.8K',
    views: '8.9K',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'
  }
];
