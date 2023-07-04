import React, { useEffect, useState } from "react";
import axios from "axios";


const UserPosts = () => {
   const [posts, setPosts] = useState([]);

   useEffect(() => {
     axios
       .get("/user/posts", {
         headers: {
               "Authorization": "Bearer " + localStorage.getItem('jwt'), 
               "Content-Type":"application.json"
            
         },
       })
       .then((response) => {
         const data = response.data;
         if (Array.isArray(data)) {
           setPosts(data);
           console.log(data);
         } else {
           throw new Error("Invalid response from server");
         }
       })
       .catch((error) => console.log(error));
   }, []);

  return (
    <div>
      <h1>User Posts</h1>
      <div className="post-container">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div className="post" key={post._id}>
              <img src={post.imageUrl} alt="Post" className="post-image" />
              <h2>{post.title}</h2>
              <p>Likes: {post.like.length}</p>
              <p>Comments: {post.comments.length}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPosts;