import { Alert, Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CommentSections = (postId) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
        credentials: "include",
      });
      const data = await res.json();

      console.log("data", data);
      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (err) {
      setCommentError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3 ">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm mb-4">
          <p>Signed in as :</p>
          <img
            src={currentUser.profilePicture}
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          <p>You must be signed in to comment</p>
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-4"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment "
            rows="3"
            maxLength="200"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
};

export default CommentSections;
