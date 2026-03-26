import { useNavigate } from "react-router-dom";
import userIcon from "../assets/user-icon.svg";
import type { BlogPost } from "../types";

interface Props {
  post: BlogPost;
}

export function BlogPostCard({ post }: Props) {
  const date = new Date(post.createdAt);
  const navigate = useNavigate();

  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="w-72  rounded-md shadow pb-5 cursor-pointer"
    >
      <div className="h-30">
        <img
          className="h-full w-full object-cover object-center"
          src={post.coverImageUrl}
          alt="Image d'illustration de l'article"
        />
      </div>

      <div className="px-4">
        <p className="my-2 text-xl font-medium">{post.title}</p>
        <div className="mt-15 flex items-center gap-2">
          <span className=" overflow-hidden rounded-[100%]">
            <img
              className="w-10 object-center object-cover"
              src={post.author.avatarUrl ? post.author.avatarUrl : userIcon}
              alt="Avatar de l'auteur"
            />
          </span>
          <div className="flex flex-col text-sm text-gray-600">
            <p>
              {post.author.firstname} {post.author.lastname}
            </p>
            <p>
              {formattedDate} · {post.readingTime} min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
