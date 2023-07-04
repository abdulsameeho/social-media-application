import React, {useState, useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import M from "materialize-css";
import {user} from "../../App";
const SignIn = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const postData = () => {
        if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            return M.toast({html: "invalid email", classes: "#c62828 red darken-3"});
        }
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {password, email}
            )
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            if (data.error) {
                M.toast({html: data.error, classes: "#c62828 red darken-3"});
            } else {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("users", JSON.stringify(data.user ?. _id));
                M.toast({html: "Signedin success", classes: "#2e7d32 green darken-3"});
                navigate("/");
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
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

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={
                        () => postData()
                }>
                    Login
                </button>
                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
            </div>
        </div>
    );
};


export default SignIn;
