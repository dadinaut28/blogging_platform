import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import userIcon from "../assets/user-icon.svg";
import {
  createNewResponse,
  deleteOneResponse,
  updateResponse,
} from "../queries";
import ellipsisIcon from "../assets/three_dots_icon.svg";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import type { contextType } from "../App";
import type { Response } from "../types";

interface Props {
  response: Response;
  showResponses: boolean;
  onResponseButtonClick: () => void;
  onNewResponseChange: () => void;
}

export function ResponseRow({
  response,
  showResponses,
  onResponseButtonClick,
  onNewResponseChange,
}: Props) {
  const { connectedUser } = useOutletContext<contextType>();
  const date = new Date(response.createdAt);

  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [updatedResponse, setUpdatedResponse] = useState(response?.content);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showOptionsBox, setShowOptionsBox] = useState(false);
  const [showResponseUpdateForm, setShowResponseUpdateForm] = useState(false);
  const [
    showDeleteResponseConfirmationBox,
    setShowDeleteResponseConfirmationBox,
  ] = useState(false);
  const [reply, setReply] = useState("");
  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateResponseLoading, setUpdateResponseLoading] = useState(false);

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const status = await createNewResponse(
        response.postId,
        reply,
        response.id,
      );
      if (status === 201) {
        setReply("");
        onNewResponseChange();
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

  const deleteResponse = async () => {
    const status = await deleteOneResponse(response.id, response.postId);

    if (status === 200) {
      onNewResponseChange();
    } else if (status === 500) {
      setShowServerErrorMessage(true);
      setTimeout(() => setShowServerErrorMessage(false), 2500);
    }
  };

  const updateFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    console.log("Soleil");
    const mouseDownListener = (e: MouseEvent) => {
      console.log(updateFormRef.current);
      console.log(showResponseUpdateForm);
      if (!updateFormRef.current?.contains(e.target as Node)) {
        setShowResponseUpdateForm(false);
      }
    };
    document.addEventListener("mousedown", mouseDownListener);
    return () => document.removeEventListener("mousedown", mouseDownListener);
  }, [showResponseUpdateForm]);

  const handleResponseUpdateFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setUpdateResponseLoading(true);
      const status = await updateResponse(
        response.id,
        response.postId,
        updatedResponse,
      );
      if (status === 200) {
        await onNewResponseChange();
        setShowResponseForm(false);
      } else if (status === 500) {
        setShowServerErrorMessage(true);
        setTimeout(() => setShowServerErrorMessage(false), 2500);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setUpdateResponseLoading(false);
    }
  };

  return (
    <div className="my-6 relative">
      {showDeleteResponseConfirmationBox &&
        createPortal(
          <div className="fixed bg-gray-50 py-2 px-2.5 rounded-md top-1/2 left-1/2 -translate-1/2 shadow">
            <p className="text-sm text-red-600 font-medium mt-2">
              Voulez-vous vraiment supprimer votre réponse ?
            </p>
            <div className="flex justify-center gap-3 mt-2.5">
              <Button onClick={deleteResponse}>Oui</Button>
              <Button
                onClick={() => setShowDeleteResponseConfirmationBox(false)}
              >
                Non
              </Button>
            </div>
          </div>,
          document.body,
        )}
      {showResponseUpdateForm &&
        createPortal(
          <form
            onSubmit={handleResponseUpdateFormSubmit}
            ref={updateFormRef}
            className="fixed w-75 px-4 py-8 top-1/2 left-1/2 -translate-x-1/2 shadox rounded-md bg-gray-50 shadow"
          >
            <label>
              <Textarea
                className="mb-3"
                value={updatedResponse}
                onChange={(e) => setUpdatedResponse(e.target.value)}
              />
            </label>
            <Button disabled={!updatedResponse || updateResponseLoading}>
              Envoyer
            </Button>
          </form>,
          document.body,
        )}

      {showServerErrorMessage && (
        <div className="fixed right-10 top-22 flex items-center px-2.5 h-8 rounded-md text-sm text-gray-500 font-medium bg-gray-100 border border-gray-200">
          <p>Erreur interne: réessayez plus tard !</p>
        </div>
      )}
      <hr className="mb-10" />
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <span className="w-8 h-8 rounded-[100%] overflow-hidden">
            <img
              src={response.user.avatarUrl ? response.user.avatarUrl : userIcon}
              alt="Avatar de l'utilisateur"
            />
          </span>
          <div className="flex flex-col">
            <span className="font-medium">
              {response.user.firstname} {response.user.lastname}
            </span>
            <span className="text-gray-600 text-sm font-medium">
              {formattedDate}
            </span>
          </div>
        </div>
        <Button
          onClick={() => setShowOptionsBox((v) => !v)}
          className="bg-transparent"
        >
          <img src={ellipsisIcon} alt="Icone ellipsis" />
        </Button>
        {showOptionsBox && connectedUser.id === response.userId && (
          <div className="absolute flex gap-2 right-2 rounded-md -top-5 px-2 py-1 bg-gray-50">
            <Button
              onClick={() => {
                if (showDeleteResponseConfirmationBox)
                  setShowDeleteResponseConfirmationBox(false);
                setShowOptionsBox(false);
                setShowResponseUpdateForm(true);
              }}
              className="text-blue-700 bg-transparent"
            >
              Modifier
            </Button>
            <Button
              onClick={() => {
                if (showResponseUpdateForm) setShowResponseUpdateForm(false);
                setShowDeleteResponseConfirmationBox(true);
                setShowOptionsBox(false);
              }}
              className="text-red-600 bg-transparent"
            >
              Supprimer
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm my-3">{response.content}</p>
      <div className="flex gap-7 mt-5">
        <span className="flex items-center">
          <Button className="bg-transparent">
            <img
              className="w-6"
              src=".././icons/icon-like.png"
              alt="Icone like"
            />
          </Button>
          <span>12</span>
        </span>
        <span className="flex items-center">
          <Button onClick={onResponseButtonClick} className="bg-transparent">
            <span className="flex gap-2 items-center">
              <img
                className="w-6"
                src=".././icons/icon-comment.png"
                alt="Icone commentaire"
              />
              <span className="text-black">
                {showResponses && response.replies.length > 0
                  ? "Cacher les réponses"
                  : `${response.replies.length} réponses`}
              </span>
            </span>
          </Button>
        </span>
        <Button
          onClick={() => setShowResponseForm(true)}
          className="bg-transparent text-black"
        >
          Répondre
        </Button>
      </div>

      <div className=" mt-5 pl-5">
        {showResponseForm && (
          <form onSubmit={handleFormSubmit}>
            <Textarea
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
              }}
            />
            <div className="flex gap-2.5 mt-4">
              <Button onClick={() => setShowResponseForm(false)}>Fermer</Button>
              <Button disabled={!reply || loading}>Envoyer</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
