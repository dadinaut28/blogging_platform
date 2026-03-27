import type { Category } from "./types";

export const apiUrl = import.meta.env.VITE_API_URL;
const TOKEN = localStorage.getItem("dadinaut_blogging_platform_auth_token");

export async function getAllPosts() {
  try {
    const response = await fetch(`${apiUrl}/api/posts`);
    const data = await response.json();

    const { posts } = data;

    return posts;
  } catch (err) {
    console.log(err);
  }
}

export async function getOneUserPosts(userId: number) {
  try {
    const response = await fetch(`${apiUrl}/api/posts?author_id=${userId}`);
    const data = await response.json();

    return data.posts;
  } catch (err) {
    console.log(err);
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    const response = await fetch(
      `${apiUrl}/api/posts?category=${categorySlug}`,
    );
    const { category, posts } = await response.json();

    return [response.status, posts, category];
  } catch (err) {
    console.log(err);
  }
}

export async function createNewPost(
  title: string,
  subTitle: string,
  content: string,
  coverImage: File | undefined,
  readingTime: number,
  published: boolean,
  categoryId: number,
) {
  try {
    const body = new FormData();
    body.append("title", title);
    body.append("subTitle", subTitle);
    body.append("content", content);
    if (coverImage) body.append("coverImage", coverImage);
    body.append("readingTime", String(readingTime));
    body.append("published", published === true ? "true" : "false");
    body.append("categoryId", String(categoryId));

    const response = await fetch(`${apiUrl}/api/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("dadinaut_blogging_platform_auth_token")}`,
      },
      body,
    });
    // const data = await response.json();

    return response.status;
  } catch (err) {
    console.log(err);
  }
}

export async function getOneUser(userId: number) {
  try {
    const response = await fetch(`${apiUrl}/api/users/${userId}`);

    const data = await response.json();
    return data.user;
  } catch (err) {
    console.log(err);
  }
}

export async function getOnePost(postId: number) {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}`);

    if (response.status === 404 || response.status === 500) {
      return [response.status, null];
    } else if (response.status === 200) {
      const data = await response.json();

      return [response.status, data.post];
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getOnePostResponses(postId: number) {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}/responses`);
    const data = await response.json();

    return data.responses;
  } catch (err) {
    console.log(err);
  }
}

export async function createNewResponse(
  postId: number,
  content: string,
  responseParentId: number | null = null,
) {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}/responses`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        content,
        parentId: responseParentId,
      }),
    });

    return response.status;
  } catch (err) {
    console.log(err);
  }
}

export async function getConnectedUser(token: string | null) {
  try {
    const response = await fetch(`${apiUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return data.user;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function deleteOnePost(postId: number) {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.status;
  } catch (err) {
    console.log(err);
  }
}

export async function updatePost(
  postId: number,
  title: string,
  subTitle: string,
  content: string,
  readingTime: number,
  published: boolean,
  coverImage: File | undefined,
) {
  try {
    const body = new FormData();

    body.append("title", title);
    body.append("subTitle", subTitle);
    body.append("content", content);
    body.append("readingTime", String(readingTime));
    body.append("published", `${published ? "true" : "false"}`);
    if (coverImage) body.append("coverImage", coverImage);

    const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body,
    });

    return response.status;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteOneResponse(responseId: number, postId: number) {
  try {
    const response = await fetch(
      `${apiUrl}/api/posts/${postId}/responses/${responseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

    return response.status;
  } catch (err) {
    console.log(err);
  }
}

export async function updateResponse(
  responseId: number,
  postId: number,
  newContent: string,
) {
  try {
    const response = await fetch(
      `${apiUrl}/api/posts/${postId}/responses/${responseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          content: newContent,
        }),
      },
    );

    return response.status;
  } catch (err) {
    console.log(err);
  }
}

export async function getTeamChoicePosts() {
  try {
    const response = await fetch(`${apiUrl}/api/team-choice-posts`);
    const { posts } = await response.json();

    return [response.status, posts];
  } catch (err) {
    console.log(err);
  }
}

export async function getPostCategories() {
  try {
    const response = await fetch(`${apiUrl}/api/category`);
    const { categories } = await response.json();

    return [response.status, categories] as [number, Category[]];
  } catch (err) {
    console.log(err);
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { token } = await response.json();
    return [response.status, token];
  } catch (err) {
    console.log(err);
  }
}

export async function registerUser(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
) {
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstname,
      lastname,
      password,
    }),
  });

  return response.status;
}

export async function verifyToken(token: string) {
  const response = await fetch(`${apiUrl}/api/verify-token`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });

  return response.status;
}
