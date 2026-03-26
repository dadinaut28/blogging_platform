import { useParams } from "react-router-dom";
import { BlogPostRow } from "../components/BlogPostRow";
import { useEffect, useState } from "react";
import { getOneUserPosts } from "../queries";
import type { BlogPost } from "../types";

export function UserHome() {
  const { id } = useParams();

  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const posts = await getOneUserPosts(Number(id));
      setPosts(posts);
    })();
  }, [id]);

  const loadPosts = async () => {
    const posts = await getOneUserPosts(Number(id));
    setPosts(posts);
  };

  return (
    <div>
      {posts?.length === 0 ? (
        <p className="mt-10 text-gray-600 text-lg font-medium">
          Aucun article pour l'instant
        </p>
      ) : (
        posts.map((post) => (
          <BlogPostRow onPostDeletion={loadPosts} key={post?.id} post={post} />
        ))
      )}
    </div>
  );
}
