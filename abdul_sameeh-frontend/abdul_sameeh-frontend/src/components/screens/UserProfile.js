import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState("");
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get(`/profile/${userid}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setProfile(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);


   const handleClick = () => {
     navigate(`/followeruser/${userid}`);
   };
   const followerClick = () => {
     navigate(`/followinguser/${userid}`);
   };
  
  
  const followUser = () => {
    const token = localStorage.getItem("jwt");
    axios
      .put(
        "/follow",
        { followId: userid },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, data._id],
          },
        }));
        setShowFollow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
         
  const unfollowUser = () => {
    const token = localStorage.getItem("jwt");
    axios
      .put(
        "/unfollow",
        { unfollowId: userid },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: prevState.user.followers.filter(
              (followerId) => followerId !== data._id
            ),
          },
        }));
        setShowFollow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {userProfile ? (
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
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
                alt="Profile"
              />
            </div>
            <div>
              <div>
                <h5>{userProfile.user.name}</h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "108%",
                  }}
                >
                  <h6>{userProfile.otherPost.length} posts</h6>

                  <h6 onClick={followerClick}>
                    {userProfile.followersCount} followers
                  </h6>
                  <h6 onClick={handleClick}>
                    {userProfile.followingCount} following
                  </h6>
                </div>
                {showFollow ? (
                  <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={followUser}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={unfollowUser}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {userProfile.otherPost.map((item) => (
              <img
                key={item._id}
                className="item"
                src={item.photo}
                alt={item.title}
              />
            ))}
          </div>
        </div>
      ) : (
        <h2>Loading...!</h2>
      )}
    </>
  );
};

export default Profile;
