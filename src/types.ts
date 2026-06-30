export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Author {
  name: string;
  avatarUrl: string;
}

export type PinCategory = 'soccer' | 'lifestyle' | 'interior' | 'fashion' | 'food' | 'general';

export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: PinCategory;
  author: Author;
  likes: number;
  likedByUser?: boolean;
  tags: string[];
  price?: string; // For shoppable pins
  comments: Comment[];
  aspectRatio: string; // Tailwind class, e.g., 'aspect-[3/4]', 'aspect-square'
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  pinIds: string[];
  coverUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  boards: Board[];
  likedPinIds: string[];
  savedPinIds: string[]; // Pin IDs saved outside of specific boards (General collection)
}
