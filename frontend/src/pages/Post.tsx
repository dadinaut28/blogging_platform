import {
  useLoaderData,
  useOutletContext,
  useParams,
  useRevalidator,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { ResponsesSection } from "../components/ResponsesSection";
import { getOnePostResponses } from "../queries";
import userIcon from "../assets/user-icon.svg";
import { ResponsesSideBar } from "../components/ResponsesSideBar";
import type { contextType } from "../App";

export function Post() {
  const { id } = useParams();
  const post = useLoaderData();
  const { revalidate } = useRevalidator();
  const { onLargeScreen, onPageTransition } = useOutletContext<contextType>();

  useEffect(() => {
    onPageTransition();
  }, []);

  const [formattedDate, setFormattedDate] = useState("");
  const [showResponseSideBar, setShowResponseSideBar] = useState(false);
  const [responses, setResponses] = useState([]);

  const reloadData = async () => {
    // const result = await getOnePost(Number(id))
    // if(!result) return
    // const [status, post] = result;
    revalidate();

    const responses = await getOnePostResponses(Number(id));
    setResponses(responses);
  };

  useEffect(() => {
    if (!post) return;
    const date = new Date(post.createdAt);

    (() => {
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setFormattedDate(formattedDate);
    })();
  }, [post]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const responses = await getOnePostResponses(Number(id));
      setResponses(responses);
    })();
  }, [id]);

  return (
    <div
      style={{ borderLeft: "1px solid lightgray" }}
      className={`${onLargeScreen ? "ml-60" : "ml-0"} pt-20 px-[10%] pb-20`}
    >
      <h2 className="title text-4xl font-bold">{post?.title}</h2>
      <h3 className="title text-2xl text-gray-600  my-4">{post?.subTitle}</h3>
      <div className="flex gap-3 mt-8 items-center text-sm font-medium  text-gray-600">
        <span className="w-10 h-10 overflow-hidden rounded-[100%]">
          <img
            className="w-full object-center object-cover"
            src={post?.author.avatarUrl ? post?.author.avatarUrl : userIcon}
            alt="Avatar de l'auteur"
          />
        </span>
        <p className="text-black">
          {post?.author.firstname} {post?.author.lastname}
        </p>
        <p>{post?.readingTime} min de lecture</p>
        <p>{formattedDate}</p>
      </div>
      <PostReactionRow
        onCommentButtonClick={() => setShowResponseSideBar(true)}
        commentsNumber={post?.responses.length}
      />
      <div className="my-12 h-80 md:h-125 overflow-hidden">
        <img
          className="object-center object-cover w-full"
          src={post?.coverImageUrl}
          alt="Image d'illstration de l'article de blog"
        />
      </div>
      <p className="my-8 text-xl leading-10">{post?.content}</p>
      <h2 className="my-5 title text-3xl font-bold">Réponses</h2>
      {post?.responses.length > 0 ? (
        <ResponsesSection
          reloadData={reloadData}
          responses={responses}
          postId={Number(post?.id)}
        />
      ) : (
        <p className="text-center text-lg text-gray-500 font-medium">
          Aucune réponse pour l'instant
        </p>
      )}

      {showResponseSideBar && (
        <ResponsesSideBar
          onNewResponseAdded={reloadData}
          onCloseButtonClick={() => setShowResponseSideBar(false)}
          post={post}
        />
      )}
    </div>
  );
}

interface PostReactionRowProps {
  commentsNumber: number;
  onCommentButtonClick: () => void;
}

function PostReactionRow({
  commentsNumber,
  onCommentButtonClick,
}: PostReactionRowProps) {
  return (
    <div className="mt-8">
      <hr />
      <div className="flex my-2">
        <Button className="bg-transparent">
          <img
            className="w-6"
            src=".././icons/icon-like.png"
            alt="Icone Like"
          />
        </Button>
        <span className="flex items-center">
          <Button onClick={onCommentButtonClick} className="bg-transparent">
            <img
              className="w-6"
              src=".././icons/icon-comment.png"
              alt="Icone Like"
            />
          </Button>
          <span>{commentsNumber}</span>
        </span>
      </div>
      <hr />
    </div>
  );
}
