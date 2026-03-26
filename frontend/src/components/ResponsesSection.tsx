import { useState } from "react";
import { ResponseRow } from "./ResponseRow";
import type { Response } from "../types";

interface Props {
  postId: number;
  responses: Response[];
  reloadData: () => void;
}

export function ResponsesSection({ responses, reloadData }: Props) {
  return (
    <div>
      {responses.map((response) => {
        return (
          <ResponsesGroup
            reloadData={reloadData}
            key={response.id}
            parentResponse={response}
          />
        );
      })}
    </div>
  );
}

interface ResponsesGroupProps {
  parentResponse: Response;
  reloadData: () => void;
}

function ResponsesGroup({ parentResponse, reloadData }: ResponsesGroupProps) {
  const [showResponses, setShowResponses] = useState(false);
  const showReplies = () => {
    setShowResponses((v) => !v);
  };

  return (
    <div>
      <ResponseRow
        onNewResponseChange={reloadData}
        showResponses={showResponses}
        onResponseButtonClick={showReplies}
        response={parentResponse}
      />
      {showResponses && parentResponse.replies.length > 0 && (
        <div className="ml-6 border-gray-300 border-l-2 pl-4">
          {parentResponse.replies.map((response) => {
            return (
              <ResponsesGroup
                reloadData={reloadData}
                key={response.id}
                parentResponse={response}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
