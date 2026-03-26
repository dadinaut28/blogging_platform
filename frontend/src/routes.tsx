import { redirect, type RouteObject } from "react-router-dom";
import App from "./App";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Post } from "./pages/Post";
import { ErrorPage } from "./pages/ErrorPage";
import { UserHome } from "./pages/UserHome";
import { UserAbout } from "./pages/UserAbout";
import { NewPost } from "./pages/NewPost";
import { ProfileHome } from "./pages/ProfileHome";
import { ProfileAbout } from "./pages/ProfileAbout";
import { EditPost } from "./pages/EditPost";
import { getConnectedUser, getOnePost, getPostsByCategory } from "./queries";
import { PostNotFound } from "./pages/PostNotFound";
import { Login } from "./pages/Login";
import { Category } from "./pages/Category";
import { Register } from "./pages/Register";
import { PostFallback } from "./components/PostFallback";
import type { BlogPost, User as UserType } from "./types";
import { User } from "./pages/User";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            index: true,
            element: <ProfileHome />,
          },
          {
            path: "about",
            element: <ProfileAbout />,
          },
        ],
      },
      {
        path: "posts/:id",
        element: <Post />,
        loader: async ({ params }) => {
          const result = await getOnePost(Number(params.id));
          if (!result) return;
          const [status, post] = result;

          if (status === 404 || status === 500) {
            throw new Response(
              `${status === 404 ? "Not found" : "Server error"}`,
              {
                status,
              },
            );
          } else if (status === 200) {
            return post;
          }
        },
        hydrateFallbackElement: <PostFallback />,
        errorElement: <PostNotFound />,
      },
      {
        path: "users/:id",
        element: <User />,
        children: [
          {
            index: true,
            element: <UserHome />,
          },
          {
            path: "about",
            element: <UserAbout />,
          },
        ],
      },
      {
        path: "posts/category/:slug",
        element: <Category />,
        loader: async ({ params }) => {
          const { slug } = params;
          if (slug) {
            const result = await getPostsByCategory(slug);
            if (!result) return;
            const [status, categoryPosts, category] = result;

            if (status !== 200) throw new Response("Error", { status });
            return {
              categoryPosts,
              category,
            };
          }
        },
      },
    ],
  },
  {
    path: "/new-post",
    element: <NewPost />,
  },
  {
    path: "/edit-post/:id",
    element: <EditPost />,
    loader: async ({ params }) => {
      const token = localStorage.getItem(
        "dadinaut_blogging_platform_auth_token",
      );

      if (!token) {
        return redirect("/login");
      }

      const data: { connectedUser?: UserType; post?: BlogPost } = {};
      const result = await getOnePost(Number(params.id));
      if (!result) return;
      const [status, post] = result;

      if (status === 404 || status === 500) {
        throw new Response(`${status === 404 ? "Not found" : "Server error"}`, {
          status,
        });
      } else if (status === 200) {
        data.post = post;
      }

      const connectedUser = await getConnectedUser();
      data.connectedUser = connectedUser;

      return data;
    },
    hydrateFallbackElement: (
      <div className="px-[10%] pt-14">
        <p className="text-center">Chargement...</p>
      </div>
    ),
    errorElement: <PostNotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];
