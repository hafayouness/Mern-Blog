import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { Button, Label, TextInput } from "flowbite-react";

function Signin() {
  return (
    <div>signin</div>
    // <div className="content-sign">
    //   <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
    //     {/* left */}
    //     <div className="flex-1">
    //       <Link to="/" className="font-bold dark:text-white text">
    //         <span className=" title-header rounded-lg text-white px-2 py-1.5">
    //           Hafa's
    //         </span>
    //         Blog
    //       </Link>
    //       <p className="text-sm mt-5">
    //         this is a demo project.You can sign up with your email and password
    //         or with Google
    //       </p>
    //     </div>

    //     {/* right */}
    //     <div className="flex-1">
    //       <form className="flex flex-col gap-4">
    //         <div>
    //           <Label value="Your username" />
    //           <TextInput type="text" placeholder="Username" id="username" />
    //         </div>
    //         <div>
    //           <Label value="Your email" />
    //           <TextInput
    //             type="email"
    //             placeholder="name@Company.com"
    //             id="username"
    //           />
    //         </div>
    //         <div>
    //           <Label value="Your password" />
    //           <TextInput type="password" placeholder="Password" id="username" />
    //         </div>

    //         <Button gradientDuoTone="purpleToBlue" type="submit">
    //           Submit
    //         </Button>
    //       </form>
    //       <div className="flex gap-2 text-sm link-in">
    //         <span> Have an account ?</span>
    //         <Link to="/sign-in" className="text-blue-500 ">
    //           Sign In
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Signin;
