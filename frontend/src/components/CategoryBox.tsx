import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { capitalize } from "../lib/capitalize";
import type { Category } from "../types";

interface Props {
  category: Category;
}

export function CategoryBox({ category }: Props) {
  const navigate = useNavigate();
  return (
    <span className="mr-2 mt-3">
      <Button
        onClick={() => navigate(`/posts/category/${category.slug}`)}
        className="bg-gray-100 rounded-4xl p-4 text-black font-normal"
      >
        {capitalize(category.name)}
      </Button>
    </span>
  );
}
