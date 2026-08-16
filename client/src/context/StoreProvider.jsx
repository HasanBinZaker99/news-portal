import React, { useReducer } from "react";
import storeReducer from "./storeReducer";
import storeContext from "./storeContext";

const storeProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, {
    userInfo: "",
    token: "",
  });
  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default storeProvider;
