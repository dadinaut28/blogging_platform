import type { ChangeEvent } from "react";
import { Textarea } from "./ui/textarea";
import { InputLabel } from "./InputLabel";
import { PostCategoriesSelect } from "./PostCategoriesSelect";

interface Props {
  title: string;
  subTitle: string;
  content: string;
  coverImage: File | undefined;
  readingTime: number;
  published: boolean;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onCoverImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReadingTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPublishedChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  changeCategoryId: (newCategoryId: number) => void;
}

export function NewPostForm({
  title,
  subTitle,
  content,
  readingTime,
  published,
  onTitleChange,
  onSubTitleChange,
  onContentChange,
  onCoverImageChange,
  onReadingTimeChange,
  onPublishedChange,
  onSelectChange,
  changeCategoryId,
}: Props) {
  return (
    <form className="">
      <InputLabel
        className="mb-6"
        id="title"
        value={title}
        label="Titre"
        onChange={onTitleChange}
      />
      <InputLabel
        id="sub-title"
        className="mb-6"
        value={subTitle}
        label="Sous-titre"
        onChange={onSubTitleChange}
      />
      <label htmlFor="post-content">
        <span className="text-lg font-medium">Contenu</span>
        <Textarea
          className="mb-6"
          id="post-content"
          value={content}
          onChange={onContentChange}
        />
      </label>
      <label className="mt-4 flex flex-col" htmlFor="cover-image">
        <span className="text-lg font-medium">Image d'illustration</span>
        <input
          className=""
          id="cover-image"
          type="file"
          onChange={onCoverImageChange}
        />
      </label>
      <br />
      <InputLabel
        id="reading-time"
        className="mb-6"
        type="number"
        value={readingTime}
        label="Temps de lecture"
        onChange={onReadingTimeChange}
      />
      <PostCategoriesSelect
        changeCategoryId={changeCategoryId}
        onChange={onSelectChange}
      />
      <label
        className="flex gap-2 items-center text-lg font-medium"
        htmlFor="published-checkbox"
      >
        Publier
        <input
          type="checkbox"
          checked={published}
          id="published-checkbox"
          onChange={onPublishedChange}
        />
      </label>
    </form>
  );
}
