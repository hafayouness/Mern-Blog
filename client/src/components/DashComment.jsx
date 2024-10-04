import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashComment() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [modelShow, setModelShow] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/comment/getcomments`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length > 9) {
            setShowMore(false);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `http://localhost:3000/api/comment/getcomments?startIndex=${startIndex}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComments = async () => {
    setModelShow(false);
    if (!commentIdToDelete) {
      console.error("Comment ID is missing or invalid");
      return;
    }
    try {
      console.log("Attempting to delete comment with ID:", commentIdToDelete);
      const res = await fetch(
        `http://localhost:3000/api/comment/deletecomment/${commentIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="tableCss scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell className="text-start ">
                {" "}
                Date update
              </Table.HeadCell>
              <Table.HeadCell className="text-center">
                Comment content
              </Table.HeadCell>
              <Table.HeadCell className="text-start">
                Number of likes
              </Table.HeadCell>
              <Table.HeadCell className="text-center">PostId</Table.HeadCell>
              <Table.HeadCell className="text-center">UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="devide-y">
              {comments.map((comment) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={comment.id || comment._id}
                  >
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-500 dark:text-white text-center ">
                      {comment.numberOfLikes}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-500 dark:text-white text-center">
                      {comment.postId}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {comment.userId}
                    </Table.Cell>

                    <Table.Cell>
                      <span
                        className="text-red-500 font-medium hover:underline cursor-pointer"
                        onClick={() => {
                          setModelShow(true);
                          setCommentIdToDelete(comment._id);
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center text-sm py-4"
              onClick={handleShowMore}
            >
              Show More
            </button>
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
                  Are you sure you want to delete this comment ?
                </h3>
                <div className="flex   justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteComments}>
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setModelShow(false)}>
                    No, Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>You have not comments yet!</p>
      )}
    </div>
  );
}

export default DashComment;
