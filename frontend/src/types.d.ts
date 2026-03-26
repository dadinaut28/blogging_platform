export interface BlogPost {
  id: number;
  title: string;
  subTitle: string;
  content: string;
  categoryId: number | null;
  coverImageUrl: string;
  readingTime: number;
  viewsCount: number;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date | null;
  responses?: Response[];
  author: {
    id: number;
    firstname: string;
    lastname: string;
    avatarUrl: string | null;
  };
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  description: string | null;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: number;
  content: string;
  userId: number;
  postId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    avatarUrl: string;
  };
  replies: Response[];
}

interface TeamChoicePost {
  postId: number;
  createdAt: Date;
  post: BlogPost;
}
