import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import ellipsisIcon from "../assets/three_dots_icon.svg";
import { useState } from "react";
import { deleteOnePost } from "../queries";
import { createPortal } from "react-dom";
import type { BlogPost, User } from "../types";
interface Props {
  post: BlogPost;
  onPostDeletion: () => void;
  connectedUser: User;
}

export function BlogPostRow({ post, onPostDeletion, connectedUser }: Props) {
  const navigate = useNavigate();

  const date = new Date(post.createdAt);

  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);
  const [showOptionsBox, setShowOptionsBox] = useState(false);
  const [showPostDeletionConfirmationBox, setShowPostDeletionConfirmationBox] =
    useState(false);

  const handleDeleteConfirmationButtonClick = async () => {
    try {
      const status = await deleteOnePost(post.id);
      if (status) {
        if (status === 500) {
          setShowServerErrorMessage(true);
          setTimeout(() => setShowServerErrorMessage(false), 2500);
        } else if (status === 200) {
          onPostDeletion();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-3 my-4 w-75 relative blog-post-row">
      {showServerErrorMessage && (
        <div className="absolute right-1.5 top-0 bg-red-50 border border-red-400 rounded-md px-1.5 py-1">
          <p className="text-sm text-red-500">
            Erreur interne: réessayez plus tard !
          </p>
        </div>
      )}
      <div className="flex gap-1 items-center">
        <span className="w-6 h-6 rounded-[100%] overflow-hidden">
          <img
            className="object-center object-cover"
            src={
              post?.author.avatarUrl
                ? post?.author.avatarUrl
                : ".././icons/user-circle.png"
            }
            alt="Avatar de l'utilisateur"
          />
        </span>
        <button
          onClick={() => navigate(`/users/${post.authorId}`)}
          className=""
        >
          <h3 className="text-sm hover:underline ">
            {post.author.firstname} {post.author.lastname}
          </h3>
        </button>
      </div>
      <div className="flex mt-2.5  gap-2">
        <div className="overflow-hidden w-2/3">
          <h2
            onClick={() => navigate(`/posts/${post.id}`)}
            className="title text-lg md:text-2xl line-clamp-3 font-bold cursor-pointer"
          >
            {post.title}
          </h2>
          <p className="mt-1 text-ellipsis truncate font-medium text-gray-500">
            {post.subTitle}
          </p>
        </div>
        <div className="md:max-h-28 max-h-20 overflow-hidden w-1/3">
          <img
            className="object-center object-cover"
            src={post.coverImageUrl}
            alt="Image d'illustration de l'article"
          />
        </div>
      </div>
      <div className="flex items-center justify-between sm:w-1/2 mt-2">
        <div className="flex items-center">
          <p className="text-sm text-gray-500">{formattedDate}</p>
          {/* <Button className="bg-transparent">
            <img className="w-6" src=".././icons/icon-like.png" alt="" />
          </Button> */}
          <Button className="bg-transparent ">
            <img
              className="w-6"
              src=".././icons/icon-comment.png"
              alt="Icone commentaire"
            />
          </Button>
        </div>
        <Button
          onClick={() => {
            setShowOptionsBox((v) => !v);
            console.log(connectedUser?.id, post.author.id);
          }}
          className="bg-transparent"
        >
          <img src={ellipsisIcon} alt="Icone ellipsis" />
        </Button>
      </div>

      {showOptionsBox && connectedUser?.id === post.author.id && (
        <div className="flex flex-col gap-1.5 bg-gray-50 absolute px-2.5 py-1 -top-3 -right-5 rounded-md border border-gray-100">
          <Button
            onClick={() => {
              setShowPostDeletionConfirmationBox(true);
              setShowOptionsBox(false);
            }}
            className=" text-red-500 bg-transparent"
          >
            Supprimer
          </Button>

          <Button
            onClick={() => navigate(`/edit-post/${post.id}`)}
            className="text-blue-500 bg-transparent"
          >
            Modifier
          </Button>
        </div>
      )}
      {showPostDeletionConfirmationBox &&
        createPortal(
          <div className="fixed px-3.5 rounded-md bg-gray-50 border border-gray-100 top-1/2 left-1/2 -translate-x-1/2 py-4 shadow">
            <p className="text-red-500 text-sm font-medium">
              Voulez vous vraiment supprimer cet article ?
            </p>

            <div className="flex justify-center items-center gap-4 mt-3.5">
              <Button onClick={handleDeleteConfirmationButtonClick}>Oui</Button>
              <Button onClick={() => setShowPostDeletionConfirmationBox(false)}>
                Non
              </Button>
            </div>
          </div>,
          document.body,
        )}

      <hr className="mt-5" />
    </div>
  );
}
