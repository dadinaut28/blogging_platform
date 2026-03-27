import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getOneUserPosts } from "../queries";
import { BlogPostRow } from "../components/BlogPostRow";
import type { profileContextType } from "./Profile";
import type { BlogPost } from "../types";

export function ProfileHome() {
  const { user } = useOutletContext<profileContextType>();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const posts = await getOneUserPosts(user.id);
      setPosts(posts);
    })();
  }, [user]);

  const loadData = async () => {
    const posts = await getOneUserPosts(user.id);
    setPosts(posts);
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => {
          return (
            <BlogPostRow
              connectedUser={user}
              key={post.id}
              onPostDeletion={loadData}
              post={post}
            />
          );
        })
      ) : (
        <p className="mt-5 text-gray-600 text-lg font-medium">
          Aucun poste pour l'instant
        </p>
      )}
    </div>
  );
}
