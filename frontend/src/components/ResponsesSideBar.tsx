import { useEffect, useState, type SyntheticEvent } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createNewResponse } from "../queries";
import closeIcon from "../assets/close_icon.svg";
import type { BlogPost } from "../types";
import { useNavigate } from "react-router-dom";
import { isUserConnected } from "../lib/IsUserConnected";

interface Props {
  post: BlogPost;
  onCloseButtonClick: () => void;
  onNewResponseAdded: () => void;
}

export function ResponsesSideBar({
  post,
  onCloseButtonClick,
  onNewResponseAdded,
}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    isUserConnected(navigate);
  }, [navigate]);

  const [showFormButtons, setShowFormButtons] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);

  const handleRespondButtonClick = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const status = await createNewResponse(post.id, response);

      if (status) {
        if (status === 201) {
          setResponse("");
          await onNewResponseAdded();
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
    <div className="fixed top-0 right-0 bottom-0 w-2/3 sm:w-1/3 p-5 z-50 bg-gray-50">
      {showServerErrorMessage && (
        <div className="fixed right-10 top-22 flex items-center px-2.5 h-8 rounded-md text-sm text-gray-500 font-medium bg-gray-100 border border-gray-200">
          <p>Erreur interne: réessayez plus tard !</p>
        </div>
      )}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-lg font-medium">
          Réponses {`(${post.responses?.length})`}
        </h2>
        <Button className="bg-transparent" onClick={onCloseButtonClick}>
          <img className="w-8" src={closeIcon} alt="Icone fermeture" />
        </Button>
      </div>
      <form onSubmit={handleRespondButtonClick}>
        <Textarea
          onFocus={() => setShowFormButtons(true)}
          onChange={(e) => setResponse(e.target.value)}
          value={response}
          placeholder="Que pensez vous ?"
        />
        {showFormButtons && (
          <div className="mt-2.5 relative">
            <div className="absolute flex text-sm gap-1 md:gap-3 right-3">
              <Button onClick={() => setShowFormButtons(false)}>Annuler</Button>
              <Button
                className="ml-2"
                disabled={response.length === 0 || loading}
              >
                Répondre
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
