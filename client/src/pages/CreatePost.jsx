import React from "react";
import ".././index.css";
import { Button, FileInput, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  return (
    <div className="post-container">
      <h1 className="title-post">Create Post</h1>
      <form>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <select>
            <option value="uncategorized">Select of category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs"> Next.js</option>
          </select>
        </div>
        <div className="post-file">
          <FileInput type="file" accept="image/*" />
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm">
            Upload image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something ..."
          className="custom-quill"
          required
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="buttonSubmit"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
