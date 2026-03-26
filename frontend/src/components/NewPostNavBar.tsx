import { useState } from "react";
import { createNewPost } from "../queries";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subTitle: string;
  content: string;
  coverImage: File | undefined;
  readingTime: number;
  published: boolean;
  onPostCreationSuccess: () => void;
  categoryId: number;
}

export function NewPostNavBar({
  title,
  subTitle,
  content,
  coverImage,
  readingTime,
  published,
  categoryId,
  onPostCreationSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPostCreationSuccessMessage, setShowPostCreationSuccessMessage] =
    useState(false);
  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);
  const [showInputErrorMessage, setShowInputErrorMessage] = useState(false);

  const publishButtonDisabled =
    !title ||
    !subTitle ||
    !content ||
    !coverImage ||
    !readingTime ||
    !categoryId ||
    loading
      ? true
      : false;

  const handlePublishButtonClick = async () => {
    try {
      setLoading(true);
      const status = await createNewPost(
        title,
        subTitle,
        content,
        coverImage,
        readingTime,
        published,
        categoryId,
      );

      if (status) {
        if (status === 201) {
          setShowPostCreationSuccessMessage(true);
          setTimeout(() => setShowPostCreationSuccessMessage(false), 2500);
          onPostCreationSuccess();
        } else if (status === 400) {
          setShowInputErrorMessage(true);
          setTimeout(() => setShowInputErrorMessage(false), 2500);
        } else if (status === 500) {
          setShowServerErrorMessage(true);
          setTimeout(() => setShowServerErrorMessage(false), 2500);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav
      style={{ borderBottom: "1px solid lightgray" }}
      className="h-14 fixed flex justify-between items-center left-0 top-0 right-0 px-5 bg-white"
    >
      {showPostCreationSuccessMessage && (
        <div className="fixed right-10 top-22 flex items-center px-2.5 h-8 rounded-md text-sm text-gray-500 font-medium bg-gray-100 border border-gray-200">
          <p>Nouvel article créé avec succès</p>
        </div>
      )}
      {showInputErrorMessage && (
        <div className="fixed right-10 top-22 flex items-center px-2.5 h-8 rounded-md text-sm text-red-500 font-medium bg-red-100 border border-red-200">
          <p>Mauvaise entrée: vérifiez et réessayez</p>
        </div>
      )}
      {showServerErrorMessage && (
        <div className="fixed right-10 top-22 flex items-center px-2.5 h-8 rounded-md text-sm text-red-500 font-medium bg-red-100 border border-red-200">
          <p>Erreur interne: réessayez plus tard</p>
        </div>
      )}

      <Button
        onClick={() => navigate("/")}
        className="bg-white text-2xl text-black font-medium"
      >
        <span>
          We<span className="text-blue-700">Blog</span>
        </span>
      </Button>
      <div>
        <Button
          onClick={handlePublishButtonClick}
          disabled={publishButtonDisabled}
        >
          Publier
        </Button>
      </div>
    </nav>
  );
}
