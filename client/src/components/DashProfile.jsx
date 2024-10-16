import React, { useEffect, useRef, useState } from "react";
import ".././index.css";
import { useSelector } from "react-redux";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);

  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadProgressError, setImageFileUploadProgressError] =
    useState(null);
  const [imageFileUpload, setImageFileUpload] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [modelShow, setModelShow] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    if (!imageFile || !imageFile.name) {
      console.error("Image file is not defined or has no name");
      return;
    }

    setImageFileUpload(true);
    setImageFileUploadProgressError(null);

    try {
      console.log("Uploading image:", imageFile.name);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error("Upload failed:", error.message);
          setImageFileUploadProgressError(
            "Could not upload image (File must be less than 2MB)"
          );
          setImageFileUploadProgress(null);
          setImageFileUrl(null);
          setImageFile(null);
          setImageFileUpload(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("Upload successful, download URL:", downloadURL);
            setImageFile(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
            setImageFileUpload(false);
            setImageFileUploadProgress(null);
          });
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      setImageFileUploadProgressError("Unexpected error occurred");
      setImageFileUpload(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: [e.target.value] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No change made");
      return;
    }
    if (imageFileUpload) {
      setUpdateUserError("please wait for image to update");
      return;
    }
    console.log("formData", formData);
    try {
      dispatch(updateStart());
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(",") : value,
        ])
      );
      const res = await fetch(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(cleanedFormData),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("user's profile update Succesfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setModelShow(false);

    try {
      dispatch(deleteStart());
      const res = await fetch(
        `http://localhost:3000/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      console.log("res", res);
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (err) {
      alert("Failed to delete comment");
      dispatch(deleteFailure(err.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/signout", {
        method: "POST",
        credentials: "include",
      });

      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="profile-text">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className=" image-profile-1"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rbg(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`img-profile ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          className={loading || imageFileUpload ? "button-disabled" : ""}
          disabled={loading || imageFileUpload}
        >
          {loading ? "Loading .... " : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="w-full"
            >
              Create post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex  justify-between mt-3 mb-6">
        <span className="cursor-pointer" onClick={() => setModelShow(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={modelShow}
        onClose={() => setModelShow(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="icondelete mb-4 mx-auto" />
            <h3 className="mb-5 text-xl text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your Account ?
            </h3>
            <div className="flex   justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setModelShow(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
