import { useEffect, useState, type ChangeEvent } from "react";
import { NewPostForm } from "../components/NewPostForm";
import { NewPostNavBar } from "../components/NewPostNavBar";
import { useNavigate } from "react-router-dom";
import { isUserConnected } from "../lib/IsUserConnected";

export function NewPost() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [readingTime, setReadingTime] = useState(0);
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [categoryId, setCategoryId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    isUserConnected(navigate);
  }, [navigate]);

  const resetFormFields = () => {
    setTitle("");
    setSubTitle("");
    setContent("");
    setReadingTime(0);
    setCoverImage(undefined);
  };

  return (
    <div>
      <NewPostNavBar
        onPostCreationSuccess={resetFormFields}
        title={title}
        subTitle={subTitle}
        content={content}
        readingTime={readingTime}
        coverImage={coverImage}
        published={published}
        categoryId={categoryId}
      />
      <div className="mt-25 px-[10%] pb-10">
        <h2 className="title text-3xl font-medium mb-6">
          Ecrire un nouvel article
        </h2>
        <NewPostForm
          title={title}
          subTitle={subTitle}
          content={content}
          readingTime={readingTime}
          published={published}
          coverImage={coverImage}
          onTitleChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target?.value);
          }}
          onSubTitleChange={(e) => {
            setSubTitle(e.target?.value);
          }}
          onCoverImageChange={(e) => {
            if (e.target?.files) setCoverImage(e.target.files[0]);
          }}
          onContentChange={(e) => setContent(e.target.value)}
          onPublishedChange={(e) => {
            setPublished(e.target.checked);
          }}
          onReadingTimeChange={(e) => setReadingTime(Number(e.target.value))}
          onSelectChange={(e) => {
            setCategoryId(Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
}
