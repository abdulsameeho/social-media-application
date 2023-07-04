import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  let user_id = JSON.parse(localStorage.getItem("users"));
  console.log("user_id", user_id);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(state);
        console.log(result);

        setPics(result.mypost);
      });
  }, []);

  const handleClick = () => {
    navigate(`/followeruser/${user_id}`);
  };

  const follwerClick = () => {
    navigate(`/followinguser/${user_id}`)
  }

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "social-app");
      data.append("cloud_name", "dbllbys8i");
      fetch("https://api.cloudinary.com/v1_1/dbllbys8i/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic, name: result.name })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              window.location.reload();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  // Check if state is null
  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state ? state.pic : "loading"}
          />

          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span>Update pic</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4>{state.name}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics.length} posts</h6>
            <h6 onClick={follwerClick}>
                {state.followers ? state.followers.length : 0} followers
            </h6>
            <h6 onClick={handleClick}>
              {state.following ? state.following.length : 0} following
            </h6>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
