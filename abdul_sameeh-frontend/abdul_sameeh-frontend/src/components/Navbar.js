import React, {useEffect, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'


const Navbar = () => {

    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const renderList = () => {
        if (state) {
            return [
                <li>
                    <Link to="/profile">Profile</Link>
                </li>,
                <li>
                    <Link to="/createpost">Createpost</Link>
                </li>,
                <li>
                    <Link to="/myfollowingpost">My following</Link>
                </li>,

                <li>
                    <button className="btn #c62828 red darken-3"
                        onClick={
                            () => {
                                localStorage.clear();
                                dispatch({type: "CLEAR"});
                                navigate("/signin");
                            }
                    }>
                        Logout
                    </button>
                </li>,
            ];
        } else {
            return [
                <li>
                    <Link to="/signin">Login</Link>
                </li>,
                <li>
                    <Link to="/signup">Signup</Link>
                </li>
            ]
        }
    }
    return (
        <div>
            <nav>
                <div className="nav-wrapper white"
                    style={
                        {color: 'black'}
                }>
                    <Link to={
                            state ? "/" : "/signin"
                        }
                        className="brand-logo">Instagram</Link>
                    <ul id="nav-mobile" className="right ">
                        {
                        renderList()
                    } </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
