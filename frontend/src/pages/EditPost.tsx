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
  // Get if the page has already been rendered to refresh data
  const hasAlreadyBeenRendered = useRef(false);
  const { id } = useParams();
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  // Redirect to login page if user is not connected
  useEffect(() => {
    isUserConnected(navigate);
  }, [navigate]);

  // Revalidate data if the page has already been rendered to get updated data (connectedUser and post)
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
  const [loading, setLoading] = useState(false);
  const [showPostUpdateSuccessMessage, setShowPostUpdateSuccessMessage] =
    useState(false);
  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);

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
      navigate(`/posts/${id}`);
    }
  }, [connectedUser, post, id, navigate]);

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const status = await updatePost(
        post?.id,
        newTitle,
        newSubTitle,
        newContent,
        Number(newReadingTime),
        newPublished,
        newCoverImage,
      );

      if (status === 200) {
        setShowPostUpdateSuccessMessage(true);
        setTimeout(() => setShowPostUpdateSuccessMessage(false), 2500);
      } else if (status === 500) {
        setShowServerErrorMessage(true);
        setTimeout(() => setShowServerErrorMessage(false), 2500);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateButtonDisabled =
    !newTitle ||
    !newSubTitle ||
    !newContent ||
    !newReadingTime ||
    newPublished === undefined ||
    loading;

  return (
    <div>
      {showServerErrorMessage && (
        <div className="fixed top-18 right-10 px-2.5 py-1 rounded-sm border border-red-200 bg-red-50 text-red-500 font-medium text-sm">
          <p>Erreur interne: réessayez plus tard.</p>
        </div>
      )}
      {showPostUpdateSuccessMessage && (
        <div className="fixed top-18 right-10 px-2.5 py-1 rounded-sm border border-blue-200 bg-blue-50 text-blue-500 font-medium text-sm">
          <p>Le poste a bien été mis à jour.</p>
        </div>
      )}
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
          <Button disabled={updateButtonDisabled} className="mt-5">
            Mettre à jour
          </Button>
        </form>
      </div>
    </div>
  );
}
