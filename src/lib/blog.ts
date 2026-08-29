export type BlogPost = {
  slug: string;
  title: string;
  date?: string;
  displayDate?: string;
  readTime?: string;
  category: string;
  image: string;
  excerpt: string;
  body?: string[];
};
