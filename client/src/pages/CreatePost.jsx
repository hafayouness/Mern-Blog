import React, { useState } from "react";
import ".././index.css";
import { Button, FileInput, TextInput } from "flowbite-react";
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

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

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
  return (
    <div className="post-container">
      <h1 className="title-post">Create Post</h1>
      <form>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <select>
            <option value="uncategorized">Select of category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs"> Next.js</option>
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
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="buttonSubmit"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
