import React, { useState, useEffect } from "react";
import moment from "moment";
import "../index.css";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Comment({ comment, onLike }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user/${comment.userId}`
        );
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-x-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-2 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fil gap-2">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`likeIcon ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "likeIcons"
            }`}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p classsName="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
