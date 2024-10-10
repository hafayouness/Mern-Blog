import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import "../index.css";
import { Link } from "react-router-dom";

function Projects() {
  const [recentPosts, setRecentPosts] = useState(null);
  useEffect(() => {
    try {
      const fetchRecentsPosts = async () => {
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?limit=6`
        );

        const data = await res.json();

        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentsPosts();
    } catch (err) {
      console.log(err.message);
    }
  });

  return (
    <div>
      <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
        <h1 className="text-2xl font-semibold mt-4"> Projets</h1>
        <div className="box-card">
          <div className="project-box">
            {recentPosts &&
              recentPosts.map((post) => {
                return <PostCard key={post.id} post={post} />;
              })}
          </div>
          <Link to="/search" className="card-link">
            View all posts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Projects;
