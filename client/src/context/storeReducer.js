import decode_token from "../utils";

const storeReducer = (state, action) => {
  const { type, payload } = action;
  /* It means: Take the type property and the payload property from the action object, and create variables called type and payload.*/
  if (type === "login_success") {
    return {
      // ...state means "Keep everything from the old state like theme, language, settings etc and then update only the things I specify below."
      ...state,
      token: payload.token,
      userInfo: decode_token(payload.token),
    };
  }

  if (type === "logout") {
    return {
      ...state,
      token: "",
      userInfo: "",
    };
  }

  return state;
};

export default storeReducer;

// import decode_token from "../utils/index";

// const storeReducer = (state, action) => {
//   const { type, payload } = action;

//   if (type === "login_success") {
//     state.token = payload.token;
//     state.userInfo = decode_token(payload.token);
//   }

//   if (type == "logout") {
//     state.token = "";
//     state.userInfo = "";
//   }
//   return this.state;
// };

// export default storeReducer;
