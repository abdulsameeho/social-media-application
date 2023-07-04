import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import Createpost from "./components/screens/Createpost";
import UserProfile from "./components/screens/UserProfile";
import { reducer, initialState } from "./reducers/userReducer";
import SubscribeUserPost from "./components/screens/SubscribesUserPostes";
import FollowingUsers from "./components/screens/FollowingUser";
import FollowerUsers from './components/screens/FollowerUser';


export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/signin");
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/signin" element={<Signin />} />
      </Routes>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Routes>
        <Route path="/createpost" element={<Createpost />} />
      </Routes>
      <Routes>
        <Route path="/profile/:userid" element={<UserProfile />} />
      </Routes>
      <Routes>
        <Route path="/myfollowingpost" element={<SubscribeUserPost />} />
      </Routes>
      <Routes>
        <Route path="/followeruser/:id" element={<FollowingUsers />} />
      </Routes>
      <Routes>
        <Route path="/followinguser/:id" element={<FollowerUsers />} />
      </Routes>
    
    </>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
