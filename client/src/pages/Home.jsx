import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:3000/api/post/getposts");
      const data = await res.json();
      console.log(data.posts);
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="container-home">
        <h1 className="text-element">Welcome to my Blog</h1>
        <p className="text-paragraph">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-md  text-teal-500 font-bold hover:underline link-text"
        >
          View all posts
        </Link>
      </div>
      <div className="mr-3 ml-3 element">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="box-card">
            <h2 className="title-Card">Recent Posts</h2>
            <div className="cards">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to="/search" className="card-link">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
