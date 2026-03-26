import { useOutletContext } from "react-router-dom";
import type { userContextType } from "./User";

export function UserAbout() {
  const { user } = useOutletContext<userContextType>();

  return (
    <div>
      <p className="mt-5 text-lg leading-7 text-gray-800 font-medium">
        {user?.description}
      </p>
    </div>
  );
}
