import React from "react";
import "../index.css";

function About() {
  return (
    <div className="containerabout">
      <div className="about-box">
        <h1 className="title-about"> About Hafa's Blog</h1>
        <div className="text-md text-gray-500">
          <p>
            Welcome to Hafa's Blog! This blog was created by Hafa Ghavidel as a
            personal project to share his thoughts and ideas with the world.
            Hafa is a passionate developer who loves to write about technology,
            coding, and everything in between.
          </p>

          <p>
            On this blog, you'll find weekly articles and tutorials on topics
            such as web development, software engineering, and programming
            languages. Hafa is always learning and exploring new technologies,
            so be sure to check back often for new content!
          </p>

          <p>
            We encourage you to leave comments on our posts and engage with
            other readers. You can like other people's comments and reply to
            them as well. We believe that a community of learners can help each
            other grow and improve.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
