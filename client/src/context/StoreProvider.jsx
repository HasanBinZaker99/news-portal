import React, { useReducer } from "react";
import storeReducer from "./storeReducer";
import StoreContext from "./storeContext";
import decode_token from "../utils";

// React component names should start with a capital letter
const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, {
    userInfo: decode_token(localStorage.getItem("newsToken")),
    token: localStorage.getItem("newsToken") || "",
  });
  //console.log("StoreUserInfo", store.token);
  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
