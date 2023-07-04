import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          // Handle error, such as redirecting to login page
          console.log(result.error);
        } else {
          setData(result.posts);
        }
      })
      .catch((error) => {
        // Handle error, such as showing an error message
        console.log(error);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
        // Reset the comment input value to empty
        const commentInput = document.querySelector('input[type="text"]');
        if (commentInput) {
          commentInput.value = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!state) {
    // Handle the case when user state is not available (e.g., still loading)
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      {data.map((item) => (
        <div className="card home-card" key={item._id}>
          <h5>
            <Link
              to={item.postedBy._id !== state._id? "/profile/" + item.postedBy._id: "/profile/"
              }
            >
              {item.postedBy.name}
            </Link>
          </h5>
          <div className="card-image">
            <img src={item.photo} alt="Post" />
          </div>
          <div className="card-content">
            <i className="material-icons">favorite</i>
            {item.like.includes(state._id) ? (
              <i
                className="material-icons"
                onClick={() => unlikePost(item._id)}
              >
                thumb_down
              </i>
            ) : (
              <i className="material-icons" onClick={() => likePost(item._id)}>
                thumb_up
              </i>
            )}
            <h6>{item.like.length} Likes</h6>
            <h6>{item.title}</h6>
            <p>{item.body}</p>
            {item.comments.map((record) => (
              <h6 key={record._id}>
                <span style={{ fontWeight: "500" }}>
                  {record.postedBy.name}
                </span>{" "}
                {record.text}
              </h6>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                makeComment(e.target[0].value, item._id);
                
              }}
            >
              <input type="text" placeholder="add a comment" />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

