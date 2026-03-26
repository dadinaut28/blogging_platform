import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { profileContextType } from "./Profile";

export function ProfileAbout() {
  const { user } = useOutletContext<profileContextType>();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      {user?.description ? (
        <p className="mt-5 text-lg font-medium text-gray-600 leading-7">
          {user?.description}
        </p>
      ) : (
        <h2 className="text-center mt-5 text-lg font-medium text-gray-600">
          Aucune description
        </h2>
      )}
    </div>
  );
}
