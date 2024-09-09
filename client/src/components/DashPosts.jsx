import { Table } from "flowbite-react";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState({});
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?userId=${currentUser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length > 9) {
            setShowMore(false);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  const handleShow = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `http://localhost:3000/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="tableCss scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell> Date Update</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell className="text-center">
                Post title
              </Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="devide-y">
              {userPosts.map((post) => {
                return (
                  <Table.Row
                    key={post.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-17 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium text-gray-900 dark:text-white "
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span className="text-red-500 font-medium hover:underline cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`update-post/${post._id}`}
                        className="text-teal-500 font-medium hover:underline cursor-pointer"
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center text-sm py-4"
              onClick={handleShow}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have not posts yet!</p>
      )}
    </div>
  );
}

export default DashPosts;
