import { useEffect, useState, type ChangeEvent } from "react";
import { getPostCategories } from "../queries";
import { capitalize } from "../lib/capitalize";
import type { Category } from "../types";

interface Props {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  changeCategoryId: (newCategoryId: number) => void;
}

export function PostCategoriesSelect({ onChange, changeCategoryId }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  // First element in categories array
  const [firstCategory, setFirstCategory] = useState<Category>();

  useEffect(() => {
    (async () => {
      const result = await getPostCategories();

      if (!result) return;

      const [status, categories] = result;
      if (status === 200) {
        setCategories(categories);
        setFirstCategory(categories[0]);
        changeCategoryId(categories[0].id);
      }
    })();
  }, []);

  return (
    <label>
      <span className="text-lg font-medium mb-2">Catégorie:</span>
      <br />
      <select
        value={firstCategory?.id}
        className="mb-7"
        onChange={onChange}
        onLoad={onChange}
        name="categories"
        id="categories"
      >
        {categories.map((category) => {
          return (
            <option key={category.id} value={category.id}>
              {capitalize(category.name)}
            </option>
          );
        })}
      </select>
    </label>
  );
}
