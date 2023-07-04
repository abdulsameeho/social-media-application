import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FollowerUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [followerUsers, setFollowerUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/followerusers/${id}`)
      .then((response) => {
        const data = response.data;
        setFollowerUsers(data.followerUsers);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching follower users");
        setLoading(false);
        console.log(error);
      });
  }, [id]);

  const followHandle = (followerId) => {
    navigate(`/profile/${followerId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Follower Users:</h3>
      <h6>{`Number of followers: ${followerUsers.length}`}</h6>
      {followerUsers.length > 0 ? (
        <ul>
          {followerUsers.map((user) => (
            <li key={user._id} onClick={() => followHandle(user._id)}>
              <h3>{user.name}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>No follower users</p>
      )}
    </div>
  );
};

export default FollowerUsers;
