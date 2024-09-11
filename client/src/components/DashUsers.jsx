import { Button, Modal, Table } from "flowbite-react";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [modelShow, setModelShow] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/getusers`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          if (data.users.length > 9) {
            setShowMore(false);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  //   const startIndex = users.length;
  //   console.log();
  //   try {
  //     const res = await fetch(
  //       `http://localhost:3000/api/user/getusers?startIndex=${startIndex}`,
  //       {
  //         credentials: "include",
  //       }
  //     );
  //     console.log(res);
  //     const data = await res.json();
  //     if (res.ok) {
  //       const newUsers = data.users.filter(
  //         (newUser) =>
  //           !users.some(
  //             (existingUser) =>
  //               existingUser.name === newUser.name ||
  //               existingUser.email === newUser.email
  //           )
  //       );
  //       setUsers((prev) => [...prev, ...newUsers]);
  //       if (data.users.length < 5) {
  //         setShowMore(false);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/getusers?startIndex=${startIndex}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUsers = async () => {
    setModelShow(false);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/delete/${userIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="tableCss scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell> Date Created</Table.HeadCell>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="devide-y">
              {users.map((user) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={user.id || user._id}
                  >
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.image}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white ">
                      {user.username}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {user.email}
                    </Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className="text-red-500 font-medium hover:underline cursor-pointer"
                        onClick={() => {
                          setModelShow(true);
                          setUserIdToDelete(user._id);
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
                  Are you sure you want to delete this user ?
                </h3>
                <div className="flex   justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteUsers}>
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
        <p>You have not users yet!</p>
      )}
    </div>
  );
}

export default DashUsers;
