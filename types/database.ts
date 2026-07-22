export interface Post {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  user_name: string;
  likes_count: number;
  edited: boolean;
}

export interface Comment {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  likes_count: number;
  edited: boolean;
}

export interface Ad {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  user_id: string;
  image_url: string | null;
  is_premium: boolean;
}

export interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  sender_name: string;
  ad_id?: string;
  ads?: {
    title: string;
  };
}
