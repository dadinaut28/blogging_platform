import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOneUser } from "../queries";
import userIcon from "../assets/user-icon.svg";
import type { User } from "../types";
import type { contextType } from "../App";

export interface userContextType {
  user: User;
}

export function User() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const { onLargeScreen, onSmallScreen, connectedUser } =
    useOutletContext<contextType>();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const user = await getOneUser(Number(id));
      setUser(user);
    })();
  }, [id]);

  return (
    <div className={`flex ${onLargeScreen ? "ml-60" : "ml-0"} w-full`}>
      <div
        className={`${onSmallScreen ? "w-full" : "w-2/3"} px-8 pt-10 border-l border-gray-100 min-h-screen`}
      >
        <h2 className="text-4xl font-semibold">
          {user?.firstname} {user?.lastname}
        </h2>
        <div
          style={{ borderBottom: "1px solid lightgray" }}
          className="flex gap-8 mt-8 text-gray-600 pb-3.5"
        >
          <Link className="hover:text-black" to={`/users/${user?.id}`}>
            Accueil
          </Link>
          <Link className="hover:text-black" to={`/users/${user?.id}/about`}>
            A propos
          </Link>
        </div>
        <Outlet context={{ user, connectedUser }} />
      </div>
      {!onSmallScreen && (
        <div className="w-1/3 pt-10 px-8 border-l border-gray-100">
          <div>
            <div className="w-30 h-30 rounded-[100%] overflow-hidden">
              <img
                className="object-center object-cover w-full "
                src={user?.avatarUrl ? user?.avatarUrl : userIcon}
                alt="Avatar de l'utilisateur"
              />
            </div>
            <p className="my-2.5 text-lg font-medium">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-gray-500 text-[15px]">
              {user?.bio ? user?.bio : "Aucune bio pour l'instant"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
