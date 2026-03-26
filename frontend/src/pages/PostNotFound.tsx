import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts } from "../queries";
import type { BlogPost } from "../types";
import { Button } from "../components/ui/button";
import { BlogPostCard } from "../components/BlogPostCard";

export function PostNotFound() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const posts = await getAllPosts();
      setPosts(posts.slice(0, 4));
    })();
  }, []);
  return (
    <div className="w-full">
      <nav className="fixed top-0 left-0 right-0 h-14 px-5 flex items-center border-b border-gray-100 bg-white">
        <Button
          onClick={() => navigate("/")}
          className="bg-transparent text-black text-2xl font-medium"
        >
          <span>
            We<span className="text-blue-600">Blog</span>
          </span>
        </Button>
      </nav>
      <div className="mt-14">
        <div className="pt-20 pb-10 border-l border-gray-200">
          <div className="flex flex-col items-center">
            <p>NOT FOUND</p>
            <p className="text-8xl text-gray-500 my-2.5">404</p>
            <Link className="text-blue-600 underline" to="/">
              Accueil
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => {
                return <BlogPostCard key={post.id} post={post} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
