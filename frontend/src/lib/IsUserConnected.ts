import type { NavigateFunction } from "react-router-dom";
import { apiUrl } from "../queries";

export async function isUserConnected(navigate: NavigateFunction) {
  try {
    const token = localStorage.getItem("dadinaut_blogging_platform_auth_token");

    if (!token) return navigate("/login");

    const response = await fetch(`${apiUrl}/api/verify-token`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });
    if (response.status !== 200) {
      navigate("/login");
    }
  } catch (err) {
    console.log(err);
  }
}
