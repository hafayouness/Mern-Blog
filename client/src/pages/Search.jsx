import { Button, Label, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "../index.css";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFormUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    console.log({ searchTermFromUrl, sortFormUrl, categoryFromUrl });

    if (searchTermFromUrl || sortFormUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFormUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?${searchQuery}`
        );
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des posts");
        }
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prevState) => ({
      ...prevState,
      [id]: value || (id === "sort" ? "desc" : ""),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(sidebarData);
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    console.log(`/search?${searchQuery}`);
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="search-box">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap font-semibold">
              Search Term :
            </Label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Sort:</Label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc"> Lastest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex  items-center gap-2">
            <Label className="font-semibold">Category:</Label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
              <option value="figma">Figma</option>
              <option value="tailwind">Tailwind</option>
              <option value="html">Html</option>
              <option value="bootstrap">bootstrap</option>
              <option value="typeScript">TypeScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="title-search">Posts results</h1>
        <div className="posts-search">
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500 ">No posts found.</p>
          )}
          {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
}

export default Search;

// useEffect(() => {
//   const urlParams = new URLSearchParams(location.search);

//   const searchTermFromUrl = urlParams.get("searchTerm");
//   const sortFormUrl = urlParams.get("sort");
//   const categoryFromUrl = urlParams.get("category");
//   console.log({ searchTerm, sort, category });

//   if (searchTermFromUrl || sortFormUrl || categoryFromUrl) {
//     setSidebarData((prevState) => ({
//       ...prevState,
//       searchTerm: searchTermFromUrl || prevState.searchTerm,
//       sort: sortFormUrl || prevState.sort,
//       category: categoryFromUrl || prevState.category,
//     }));
//   }

//   const fetchPosts = async () => {
//     setLoading(true);
//     const searchQuery = urlParams.toString();

//     const res = await fetch(
//       `http://localhost:3000/api/post/getposts?${searchQuery}`
//     );

//     if (!res.ok) {
//       return;
//     }

//     const data = await res.json();

//     setPosts(data.posts);

//     setLoading(false);
//     setShowMore(data.posts.length === 9);
//   };

//   fetchPosts();
// }, [location.search]);

// const handleChange = (e) => {
//   if (e.target.id === "searchTerm") {
//     setSidebarData({ ...sidebarData, searchTerm: e.target.value });
//   }
//   if (e.target.id === "sort") {
//     const order = e.target.value || "desc";
//     setSidebarData({ ...sidebarData, sort: order });
//   }
//   if (e.target.id === "category") {
//     const category = e.target.value || "uncategorized";
//     setSidebarData({ ...sidebarData, category });
//   }
// };

// const handleSubmit = (e) => {
//   e.preventDefault();
//   console.log(sidebarData);
//   const urlParams = new URLSearchParams(location.search);
//   urlParams.set("searchTerm", sidebarData.searchTerm);
//   urlParams.set("sort", sidebarData.sort);
//   urlParams.set("category", sidebarData.category);
//   const searchQuery = urlParams.toString();
//   console.log(`/search?${searchQuery}`);
//   navigate(`/search?${searchQuery}`);
