import React from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import "../index.css";

import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa6";
import "tailwindcss/tailwind.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const handleSignout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/signout", {
        method: "POST",
        credentials: "include",
      });
      console.log("click");

      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Navbar className="border-2">
      <Navbar.Brand as={Link}>
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className=" title-header rounded-lg text-white px-2 py-1.5">
            Hafa's
          </span>
          Blog
        </Link>
      </Navbar.Brand>
      <form
        className="max-w-sm mx-auto lg:flex items-center border rounded-lg serach-icon
      "
      >
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="w-full"
        />
      </form>
      <div className="icon-search">
        <Button className="w-12 h-10  rounded-lg" color="gray" pill>
          <AiOutlineSearch className="icon" />
        </Button>
      </div>
      <div className="btn-sign-1">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profilePicture} />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item> Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />

            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in" className="btn-sign-1">
            <Button
              gradientDuoTone="purpleToBlue"
              className="rounded-lg text-white "
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>

      <Navbar.Toggle />
      <Navbar.Collapse className="nav-coll">
        <Navbar.Link active as={"div"}>
          <Link to="/"> Home</Link>
        </Navbar.Link>
        <Navbar.Link href="/about" as={"div"}>
          <Link to="/about"> About </Link>
        </Navbar.Link>
        <Navbar.Link href="/projets" as={"div"}>
          <Link to="/projets"> Projets </Link>
        </Navbar.Link>
      </Navbar.Collapse>

      <Button
        className="w-12 h-10 hidden sm:flex btn-famoon "
        color="gray"
        pill
        onClick={() => {
          dispatch(toggleTheme());
        }}
      >
        {theme === "light" ? (
          <FaSun className="w-full h-full" />
        ) : (
          <FaMoon className="w-full h-full" />
        )}
      </Button>
      <div className="btn-sign">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profilePicture} />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item> Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button
              gradientDuoTone="purpleToBlue"
              className="rounded-lg text-white "
              outline
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}

export default Header;
