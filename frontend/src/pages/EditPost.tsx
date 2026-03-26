import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
} from "react-router-dom";
import { updatePost } from "../queries";
import { Button } from "../components/ui/button";
import { InputLabel } from "../components/InputLabel";
import { Textarea } from "../components/ui/textarea";
import { isUserConnected } from "../lib/IsUserConnected";

export function EditPost() {
  const hasAlreadyBeenRendered = useRef(false);
  const { id } = useParams();
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  useEffect(() => {
    isUserConnected(navigate);
  }, [navigate]);

  // Revalidate data if the page has already beeb rendered to get updated data (connectedUser and post)
  useEffect(() => {
    if (hasAlreadyBeenRendered.current === true) revalidate();
  }, [revalidate]);

  const { post, connectedUser } = useLoaderData();

  const [newTitle, setNewTitle] = useState("");
  const [newSubTitle, setNewSubTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newReadingTime, setNewReadingTime] = useState("");
  const [newPublished, setNewPublished] = useState(false);
  const [newCoverImage, setNewCoverImage] = useState<File | undefined>();

  useEffect(() => {
    if (!post) return;
    (() => {
      setNewTitle(post?.title);
      setNewSubTitle(post?.subTitle);
      setNewContent(post?.content);
      setNewReadingTime(post?.readingTime);
      setNewPublished(post?.published);
    })();
    hasAlreadyBeenRendered.current = true;
  }, [post]);

  useEffect(() => {
    if (!id || !connectedUser || !post) return;

    if (connectedUser?.id !== post?.authorId) {
      console.log("User is different from post author", `/posts/${post.id}`);
      navigate(`/posts/${id}`);
    }
  }, [connectedUser, post, id, navigate]);

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (
        newTitle &&
        newSubTitle &&
        newContent &&
        newReadingTime &&
        newPublished !== undefined
      ) {
        const status = await updatePost(
          post?.id,
          newTitle,
          newSubTitle,
          newContent,
          Number(newReadingTime),
          newPublished,
          newCoverImage,
        );

        if (status === 404) {
          throw new Response("Not Found", { status: 404 });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <nav className="fixed px-5 flex items-center top-0 left-0 right-0 h-14 border border-gray-300 bg-white">
        <Button
          className="bg-transparent text-black"
          onClick={() => navigate("/")}
        >
          <h2 className="title text-2xl font-medium">
            <span className="text-blue-700">We</span>Blog
          </h2>
        </Button>
      </nav>
      <div className="mt-20 px-[10%]">
        <h2 className="text-3xl font-medium my-7">Modifier un article</h2>
        <form onSubmit={handleFormSubmit} className="">
          <InputLabel
            className="mb-5"
            id="new-title"
            label="Titre"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <InputLabel
            id="new-subtitle"
            className="mb-5"
            label="Sous-titre"
            value={newSubTitle}
            onChange={(e) => setNewSubTitle(e.target.value)}
          />
          <label>
            <span className="font-medium text-lg">Contenu</span>
            <Textarea
              className="mb-5"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </label>
          <InputLabel
            id="reading-time"
            className="mb-5"
            label="Temps de lecture"
            value={newReadingTime}
            onChange={(e) => setNewReadingTime(e.target.value)}
          />
          <label>
            <span className="text-lg font-medium">Image d'illustration</span>{" "}
            <br />
            <input
              className="mb-5"
              type="file"
              onChange={(e) => {
                if (e.target.files) setNewCoverImage(e.target.files[0]);
              }}
            />
          </label>{" "}
          <br />
          <label>
            Publié
            <input
              className="ml-1.5"
              type="checkbox"
              checked={newPublished}
              onChange={(e) => setNewPublished(e.target.checked)}
            />
          </label>
          <br />
          <Button className="mt-5">Mettre à jour</Button>
        </form>
      </div>
    </div>
  );
}
