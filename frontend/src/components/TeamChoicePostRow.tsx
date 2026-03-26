import starIcon from "../assets/star_icon.svg";
import userIcon from "../assets/user-icon.svg";
import type { TeamChoicePost } from "../types";

interface Props {
  teamChoicePost: TeamChoicePost;
}

export function TeamChoicePostRow({ teamChoicePost }: Props) {
  const date = new Date(teamChoicePost.post.createdAt);

  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="my-8">
      <div className="flex gap-3 items-center">
        <span className="w-8 h-8 rounded-sm overflow-hidden">
          <img
            className="object-center object-cover"
            src={
              teamChoicePost.post.author.avatarUrl
                ? teamChoicePost.post.author.avatarUrl
                : userIcon
            }
            alt="Avatar de l'auteur"
          />
        </span>
        <p className="text-sm">
          {teamChoicePost.post.author.firstname}{" "}
          {teamChoicePost.post.author.lastname}
        </p>
      </div>
      <h2 className="title text-lg font-medium my-2">
        {teamChoicePost.post.title}
      </h2>
      <div className="flex gap-2.5">
        <img className="w-5" src={starIcon} alt="Icone étoile" />
        <p className="text-gray-500 text-sm">{formattedDate}</p>
      </div>
    </div>
  );
}
