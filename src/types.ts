export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Technology' | 'Business' | 'Science' | 'Sports' | 'Entertainment' | 'World';
  author: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  source: string;
}

export type Category = NewsItem['category'] | 'All';
