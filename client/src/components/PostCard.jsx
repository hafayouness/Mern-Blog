import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="group-card">
      <Link to={`/post/${post.slug}`}>
        <img src={post.image} alt="post cover" className="image" />
      </Link>
      <div className="contenu">
        <p className="text-lg font-semibold line-clamp-2 text-center mt-2">
          {post.title}
        </p>
        <span className="italic text-sm text-center">{post.category}</span>
        <Link to={`/post/${post.slug}`} className="button-read">
          Read article
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
