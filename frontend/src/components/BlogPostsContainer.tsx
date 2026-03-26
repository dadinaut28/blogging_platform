import { useEffect, useState } from "react";
import type { BlogPost } from "../types";
import { BlogPostRow } from "./BlogPostRow";
import { getAllPosts } from "../queries";

export function BlogPostsContainer() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    (async () => {
      const posts = await getAllPosts();
      setPosts(posts);
    })();
  }, []);

  const reloadPosts = async () => {
    const posts = await getAllPosts();
    setPosts(posts);
  };
  return (
    <div>
      {posts.map((post) => {
        return (
          <BlogPostRow onPostDeletion={reloadPosts} key={post.id} post={post} />
        );
      })}
    </div>
  );
}
