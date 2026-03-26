import { useEffect, useRef } from "react";
import {
  useLoaderData,
  useOutletContext,
  useParams,
  useRevalidator,
} from "react-router-dom";
import { BlogPostCard } from "../components/BlogPostCard";
import { capitalize } from "../lib/capitalize";
import type { contextType } from "../App";
import type { BlogPost } from "../types";

export function Category() {
  const { slug } = useParams();
  const { revalidate } = useRevalidator();
  const previousSlugRef = useRef("");
  const { category, categoryPosts } = useLoaderData();
  const { onLargeScreen, onPageTransition } = useOutletContext<contextType>();

  useEffect(() => {
    onPageTransition();
  }, []);

  // Reload posts when the current slug is different from the previous. previousSlugRef.current === falsy means it is the first render, a previous slug doesn't exist so a comparaison is not needed.
  useEffect(() => {
    if (previousSlugRef.current && previousSlugRef.current !== slug) {
      revalidate();
    }

    if (slug) previousSlugRef.current = slug;
  }, [slug, revalidate]);

  return (
    <div
      style={{ minHeight: "calc(100vh - 56px)" }}
      className={`${onLargeScreen ? "ml-60" : "ml-0"} border-l border-gray-100 pt-8 px-[5%]`}
    >
      <h2 className="title text-3xl md:text-5xl font-medium mb-7">
        {capitalize(category)}
      </h2>
      {categoryPosts.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {categoryPosts.map((post: BlogPost) => {
            return <BlogPostCard post={post} />;
          })}
        </div>
      ) : (
        <p>Aucun article dans cette catégorie pour l'instant</p>
      )}
    </div>
  );
}
