import { Button, Spinner } from "flowbite-react";
import "../index.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSections from "../components/CommentSections";
import PostCard from "../components/PostCard";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoanding] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoanding(true);
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?slug=${postSlug}`
        );

        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoanding(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoanding(false);
          setError(false);
        }
      } catch (err) {
        setLoanding(false);
        setError(true);
      }
    };
    fetchPost();
  }, [postSlug]);
  useEffect(() => {
    try {
      const fetchRecentsPosts = async () => {
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?limit=3`
        );

        const data = await res.json();
        console.log(data.posts);
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentsPosts();
    } catch (err) {
      console.log(err.message);
    }
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="container-post">
      <h1 className="container-header">{post && post.title}</h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      <img
        src={post && post.image}
        alt={post && post.image}
        className="container-image"
      />
      <div className="container-date">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-4 max-w-2xl mx-auto w-full container-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="calltoaction">
        <CallToAction />
      </div>
      <CommentSections postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="title-recntPosts"> Recent articles </h1>
        <div className="contenu-postrecent">
          {recentPosts &&
            recentPosts.map((post) => {
              return <PostCard key={post.id} post={post} />;
            })}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
