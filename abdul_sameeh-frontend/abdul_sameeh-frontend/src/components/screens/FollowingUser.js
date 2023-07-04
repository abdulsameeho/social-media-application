import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FollowingUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("id", id);

  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/followingusers/${id}`)
      .then((response) => {
        const data = response.data;
        setFollowingUsers(data.followingUsers);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching following users");
        setLoading(false);
        console.log(error);
      });
  }, [id]);

  const followHandle = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Following Users:</h3>
      <h6>{`Number of following: ${followingUsers.length}`}</h6>
      {followingUsers.length > 0 ? (
        <ul>
          {followingUsers.map((user) => (
            <li key={user._id} onClick={() => followHandle(user._id)}>
              <h3>{user.name}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>No following users</p>
      )}
    </div>
  );
};

export default FollowingUsers;
