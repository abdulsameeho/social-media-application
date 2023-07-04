import React, {useState, useContext, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
import axios from 'axios'

const SignIn = () => {
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined);

    useEffect(() => {

        if (url) {
            uploadFields()
        }

    }, [url])

    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "social-app");
        data.append("cloud_name", "dbllbys8i");
        fetch("https://api.cloudinary.com/v1_1/dbllbys8i/image/upload", {
            method: "post",
            body: data
        }).then((res) => res.json()).then((data) => {
            setUrl(data.url);
        }).catch((err) => {
            console.log(err);
        });
    }
    const uploadFields = () => {
        if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            return M.toast({html: "invalid email", classes: "#c62828 red darken-3"});
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {name, password, email, pic: url}
            )
        }).then((res) => res.json()).then((data) => {
            if (data.error) {
                M.toast({html: data.error, classes: "#c62828 red darken-3"});
            } else {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type: "USER", payload: data.user});
                M.toast({html: data.message, classes: "#2e7d32 green darken-3"});
                navigate("/signin");
            }
        }).catch((err) => {
            console.log(err);
        });

    };

    const postData = () => {

        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }

    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="Name"
                    value={name}
                    onChange={
                        (e) => {
                            setName(e.target.value);
                        }
                    }/>
                <input type="text" placeholder="email"
                    value={email}
                    onChange={
                        (e) => {
                            setEmail(e.target.value);
                        }
                    }/>
                <input type="password" placeholder="password"
                    value={password}
                    onChange={
                        (e) => {
                            setPassword(e.target.value);
                        }
                    }/>
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload pic</span>
                        <input type="file"
                            onChange={
                                (e) => setImage(e.target.files[0])
                            }/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={
                        () => postData()
                }>
                    Signup
                </button>

                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default SignIn
