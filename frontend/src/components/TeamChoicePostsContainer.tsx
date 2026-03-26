import { useEffect, useState } from "react";
import { getTeamChoicePosts } from "../queries";
import { TeamChoicePostRow } from "./TeamChoicePostRow";
import type { TeamChoicePost } from "../types";

export function TeamChoicePostsContainer() {
  const [teamChoicePosts, setTeamChoicePosts] = useState<TeamChoicePost[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getTeamChoicePosts();

      if (!result) return;
      const [status, posts] = result;
      if (status === 200) setTeamChoicePosts(posts);
    })();
  }, []);

  return (
    <div>
      {teamChoicePosts.map((post) => {
        return <TeamChoicePostRow key={post.postId} teamChoicePost={post} />;
      })}
    </div>
  );
}
