import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSections = (postId) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModel, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

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
        setComments([data, ...comments]);
      }
    } catch (err) {
      setCommentError(err.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      const validPostId = postId?.postId || postId;
      if (!validPostId || typeof validPostId !== "string") {
        console.error("Invalid postId:", validPostId);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:3000/api/comment/getpostcomment/${validPostId}`,
          {
            method: "GET",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.error(
            "Error fetching comments: ",
            res.status,
            res.statusText
          );
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    console.log(commentId);
    try {
      if (!currentUser) {
        navigate("/sign-up");
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/comment//likecomment/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handlEdit = async (comment, editComment) => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c._id === comment._id ? { ...c, content: editComment } : c
      )
    );
  };
  const handleDelete = async () => {
    setShowModal(false);
    // if (!commentId) {
    //   console.error("Comment ID is undefined or null");
    //   return;
    // }
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/api/comment//deletecomment/${commentToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      console.log(
        `http://localhost:3000/api/comment/deletecomment/${commentToDelete}`
      );
      console.log("res", res);
      if (res.ok) {
        const data = await res.json();
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentToDelete)
        );
      }
    } catch (err) {
      console.log(err.message);
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
      {comments.length === 0 ? (
        <p className="text-sm my-4 text-center text-teal-500">
          No, Comment yet!
        </p>
      ) : (
        <>
          <div className="text-sm my-4 flex items-center gap-1">
            <p>Comments :</p>
            <div className="border border-gray-400 py-1 px-2 rounded-md w-8 text-center">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handlEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSections;
