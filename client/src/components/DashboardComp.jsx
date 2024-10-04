import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";

import "../index.css";
import { Link } from "react-router-dom";
import { Button, Table } from "flowbite-react";

const DashboardComp = () => {
  const [users, setUsers] = useState([]);
  console.log(users);
  const [comments, setComments] = useState([]);

  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMounthUsers, setLastMounthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        "http://localhost:3000/api/post/getposts?limit=4",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
        setLastMonthPosts(posts.length);
        console.log(lastMonthPosts);
      }
    };
    const fetchUsers = async () => {
      const res = await fetch(
        "http://localhost:3000/api/user/getusers?limit=4",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setUsers(data.users);
        setLastMounthUsers(data.lastMonthUsers);
        setTotalUsers(data.totalUsers);
        console.log(data.lastMonthUsers);
      }
    };
    const fetchComments = async () => {
      const res = await fetch(
        "http://localhost:3000/api/comment/getcomments?limit=4",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setComments(data.comments);
        setTotalComments(data.totalComments);
        setLastMonthComments(data.lastMonthComments);
        console.log(data.lastMonthComments);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
      fetchComments();
      fetchUsers();
    }
  }, [currentUser]);
  return (
    <div className="box">
      <div className="container-box">
        <div className="custom-container">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-md uppercase">total users</h3>
              <p className="number-total">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="icon-dash bg-teal-600" />
          </div>
          <div className=" flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMounthUsers}
            </span>
            <div className="text-gray-500 space-x-2"> Last Month</div>
          </div>
        </div>
        <div className="custom-container ">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-md uppercase">
                total comments
              </h3>
              <p className="number-total">{totalComments}</p>
            </div>

            <HiAnnotation className="icon-dash bg-indigo-600 " />
          </div>

          <div className=" flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>

            <div className="text-gray-500 space-x-2"> Last Month</div>
          </div>
        </div>

        <div className="custom-container">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-md uppercase">total posts</h3>
              <p className="number-total">{totalPosts}</p>
            </div>

            <HiDocumentText className="icon-dash bg-lime-600 " />
          </div>

          <div className=" flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>

            <div className="text-gray-500 space-x-2"> Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex-wrap flex gap-4 justify-center mt-4">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold mb-5">
            <h1 className="text-center p-2"> Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}> See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell> User image</Table.HeadCell>
              <Table.HeadCell> username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => {
                return (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2"> Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}> See all</Link>
            </Button>
          </div>
          <Table hoverable className="mt-4 userTable">
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => {
                return (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="w-96">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold mb-5">
            <h1 className="text-center p-2"> Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"} className="">
                {" "}
                See all
              </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell className="text-center">
                Post Title
              </Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => {
                return (
                  <Table.Body key={post._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt="user"
                          className="w-14 h-10 rounded-md bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell className="post-title">
                        {post.title}
                      </Table.Cell>
                      <Table.Cell className="w-5">{post.category}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
