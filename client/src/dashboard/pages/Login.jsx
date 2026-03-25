import React, { useState } from "react";
import profile from "../../assets/profile.png";

const Login = () => {
  const [loader, setLoader] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-[400px]">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img
              className="w-[150px]"
              src="https://i.ibb.co/DfxqrMHr/mainlogo.png"
              alt="logo"
            />
          </div>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
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
