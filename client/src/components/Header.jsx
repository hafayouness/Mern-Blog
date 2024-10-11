import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import "../index.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa6";
import "tailwindcss/tailwind.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const handleSignout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/signout", {
        method: "POST",
        credentials: "include",
      });

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
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
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
        onSubmit={handleSubmit}
      >
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          className="w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <form className="relative md:hidden" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder=""
          value={searchTerm}
          className="w-16 "
          onChange={(e) => setSearchTerm(e.target.value)}
          // onFocus={() => setSearchTerm(searchTerm)}
        />
        {!searchTerm && (
          <button onClick={() => setSearchTerm("")} className="icone-serach">
            <AiOutlineSearch />
          </button>
        )}
      </form>
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
        className="w-12 h-10 btn-famoon "
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
            className="object-cover"
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
