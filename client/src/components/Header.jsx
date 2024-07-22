import React, { useEffect, useRef, useState } from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import "../index.css";

import { Link } from "react-router-dom";

import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa6";
import "tailwindcss/tailwind.css";

function Header() {
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

      <Link to="/sign-up" className="btn-sign-1">
        <Button
          gradientDuoTone="purpleToBlue"
          outlineclassName="rounded-lg text-white "
          className=""
        >
          Sign In
        </Button>
      </Link>

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
      >
        <FaMoon className="w-full" />
      </Button>
      <Link to="/sign-up" className="btn-sign">
        <Button
          gradientDuoTone="purpleToBlue"
          outlineclassName="rounded-lg text-white "
          outline
        >
          Sign In
        </Button>
      </Link>
    </Navbar>
  );
}

export default Header;
