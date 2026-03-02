import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-[250px] h-screen fixed left-0 bg-[#DADAFF]">
      <div className="h-[70px] flex justify-center items-center">
        <Link to="/">
          <img
            className="w-[190px] h-[35px]"
            src="https://i.ibb.co/DfxqrMHr/mainlogo.png"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
