import { useEffect, useState } from "react";
import { BlogPostRow } from "../components/BlogPostRow";
import { getAllPosts, getPostCategories } from "../queries";
import { TeamChoicePostsContainer } from "../components/TeamChoicePostsContainer";
import { CategoryBox } from "../components/CategoryBox";
import { useOutletContext } from "react-router-dom";
import type { contextType } from "../App";
import type { BlogPost, Category } from "../types";

export function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { onLargeScreen, onPageTransition, onSmallScreen, connectedUser } =
    useOutletContext<contextType>();

  useEffect(() => {
    onPageTransition();
  }, []);

  useEffect(() => {
    (async () => {
      const posts = await getAllPosts();
      const result = await getPostCategories();
      if (!result) return;
      const [status, categories] = result;
      setPosts(posts);
      if (status === 200) setCategories(categories);
    })();
  }, []);

  const loadPosts = async () => {
    const posts = await getAllPosts();
    setPosts(posts);
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 56px)" }}
      className={`${onLargeScreen && "ml-60"} w-full flex items-start border-l border-gray-100`}
    >
      <div className={`${onSmallScreen ? "w-full" : "w-2/3"}  px-5 pt-6`}>
        {posts.map((post: BlogPost) => {
          return (
            <BlogPostRow
              connectedUser={connectedUser}
              onPostDeletion={loadPosts}
              key={post.id}
              post={post}
            />
          );
        })}
      </div>
      {!onSmallScreen && (
        <div
          style={{ minHeight: "calc(100vh - 56px)" }}
          className="w-1/3 border-l border-gray-100  pt-10 pl-10 sticky top-10 self-start"
        >
          <h3 className="title text-2xl font-medium">Choix de l'équipe</h3>
          <TeamChoicePostsContainer />
          <h3 className="title text-2xl font-medium mb-4">Catégories</h3>
          <div>
            {categories.map((category) => {
              return <CategoryBox key={category.id} category={category} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
