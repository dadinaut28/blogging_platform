import { useEffect, useState, type ChangeEvent } from "react";
import { getPostCategories } from "../queries";
import { capitalize } from "../lib/capitalize";
import type { Category } from "../types";

interface Props {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function PostCategoriesSelect({ onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getPostCategories();

      if (!result) return;

      const [status, categories] = result;
      if (status === 200) setCategories(categories);
    })();
  }, []);

  return (
    <label>
      <span className="text-lg font-medium mb-2">Catégorie:</span>
      <br />
      <select
        className="mb-7"
        onChange={onChange}
        name="categories"
        id="categories"
      >
        {categories.map((category) => {
          return (
            <option value={category.id}>{capitalize(category.name)}</option>
          );
        })}
      </select>
    </label>
  );
}
