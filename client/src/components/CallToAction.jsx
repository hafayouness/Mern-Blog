import { Button } from "flowbite-react";
import "../index.css";
import React from "react";

const CallToAction = () => {
  return (
    <div className="container-colltoaction">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl font-bold ">
          Want to learn HTML,CSS JavaScript by building fun engaging projetcts.
        </h2>
        <p className="text-teal-500 p-calltoaction">
          Check our 100 JS projects website and start building your own
          projects.
        </p>
        <Button
          className="button-calltoaction"
          gradientDuoTone="purpleToPink"
          type="submit"
        >
          <a
            href="https://www.100jsprojects.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      <div className=" flex-1 img-calltoaction">
        <img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png" />
      </div>
    </div>
  );
};

export default CallToAction;
