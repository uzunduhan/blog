export interface Post {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  isApproved: boolean;
  authorUsername: string;
  commentCount: number;
  imageUrl?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  imageUrl?: string;
}
