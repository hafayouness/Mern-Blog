import React, { useState } from "react";
import ".././index.css";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const [formData, setFormData] = useState({});
  console.log(formData);
  const handleUpdateImage = () => {
    if (!file) {
      setImageFileUploadError("Please select an image");
      return;
    }
    setImageFileUploadError(null);
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error("Upload failed:", error.message);
          setImageFileUploadError("image upload failed");
          setImageFileUploadError(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageFileUploadError(null);

            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (err) {
      console.error("Unexpected error:", err);
      setImageUploadProgress(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      console.log("data", data);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (err) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="post-container">
      <h1 className="title-post">Create Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className=" flex-container">
          <TextInput
            type="text"
            placeholder="Title"
            name="title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            name="category"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select of category</option>

            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs"> Next.js</option>
            <option value="figma"> Figma</option>
            <option value="html">Html</option>
            <option value="bootstrap">Bootstrap</option>
            <option value="typeScript">TypeScript</option>
            <option value="tailwind">Tailwind</option>
          </select>
        </div>
        <div className="post-file">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUpdateImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              " Upload image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="uplaod"
            className="w-full h-60 onject-cover mb-5"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something ..."
          className="custom-quill"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="buttonSubmit"
        >
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreatePost;
