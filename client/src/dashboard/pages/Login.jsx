import React, { useContext, useState } from "react";
import profile from "../../assets/profile.png";
import logo from "../../assets/logo.png";
import { base_url } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import storeContext from "../../context/storeContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { dispatch } = useContext(storeContext);
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    // e.preventDefault() prevents the browser from refreshing the entire page.
    try {
      const { data } = await axios.post(`${base_url}/api/login`, state);
      setLoader(false);
      //console.log(data);
      localStorage.setItem("newsToken", data);
      toast.success(data.message);
      /* dispatch() is a function used to send an action to the reducer. The reducer then decides how the state should change.
      You can think of dispatch like a messenger.
      Suppose:
      Login.jsx = receptionist
      dispatch = messenger
      storeReducer.js = manager
      global state = company record book
      After login is successful, Login.jsx does not directly change the global state.
      Instead, it tells dispatch:
      "Go tell the reducer that login succeeded."
      */
      dispatch({
        type: "login_success",
        payload: {
          token: data.token,
        },
      });

      //navigate("/dashboard");
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-[400px]">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img className="w-[150px]" src={logo} alt="logo" />
          </div>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={state.email}
                onChange={inputHandle}
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={state.password}
                onChange={inputHandle}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loader}
                className={`w-full py-3 text-white rounded-md transition font-semibold ${loader ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-400"}`}
              >
                {loader ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
