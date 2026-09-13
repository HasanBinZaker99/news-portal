const jwt = require("jsonwebtoken");

class middleware {
  // auth checks whether the user has a valid JWT token.
  auth = async (req, res, next) => {
    /* This is an Express middleware function. Express gives middleware three important
things: req, res, next. req means request. It contains information sent by the client. For example: 
req.headers
req.body
req.params
req.query.

res means response. you use it to send a response back to the client.

next means: continue to the next middleware or controller. For example: next() means This user passed
my check. Continue

*/
    const { authorization } = req.headers;
    /*
A request can contain headers. For example, your front end may send: Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Then: req.header.authorization contains: Bearer eyJhbGciOiJIUzI1Ni...
    */
    if (authorization) {
      // This asks did the client send an Authorization header?
      const token = authorization.split("Bearer ")[1];
      /* authorization = "Bearer abc123xyz"
authorization.split("Bearer ") produces roughly: ["", "abc123xyz"]
Then: [1] takes the second item: abc123xyz
*/
      if (token) {
        // This means: Did we successfully extract a token? If yes, continue.
        try {
          /* Now you have to verify JWT. JWT verification can fail. For example:
    Expired token
    Invalid token
    Fake token
    Wrong secret
    Modified token
*/
          const userInfo = jwt.verify(token, process.env.secret);
          // Was this token really created using my secret?
          req.userInfo = userInfo;
          /*
Attaching user information to req. req.userInfo = userInfo. This is extremely important. You are taking the decoded user information: userInfo and 
attaching it to req. Now another middleware or controller can access it.
*/
          next();
          /* next() tells Express: Authentication passed. Continue.
          Suppose your route is:

        router.get(
        "/dashboard",
        middleware.auth,
        dashboardController
        );

        The execution is:

        GET /dashboard
            ↓
        middleware.auth
            ↓
        token valid?
            ↓
        yes
            ↓
        next()
            ↓
        dashboardController

        Without:

        next();

        the request would stop inside the middleware.
*/
        } catch (error) {
          return res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
  /* 
  role checks whether the logged-in user is an admin
  Your second middleware is:

role = async (req, res, next) => {
This middleware does not verify the token again.
It expects auth to have already run.
Remember that auth did:
req.userInfo = userInfo;
Now role gets it.

const userInfo = req.userInfo;
Suppose auth decoded:
{
  id: "123",
  role: "admin"
}
Then:
userInfo
is:
{
  id: "123",
  role: "admin"
}
*/
  role = async (req, res, next) => {
    const { userInfo } = req;
    if (userInfo.role == "admin") {
      next();
    } else {
      return res.status(401).json({ message: "Unable to access this api" });
    }
  };
}

module.exports = new middleware();

/*
Authentication vs Authorization

This distinction is very important.

Your two methods perform two different security jobs.

auth = Authentication
role = Authorization
Authentication
auth

asks:

Who are you? Are you logged in?

It verifies the JWT.

Example:

User: I am Hasan.
Server: Show me your valid token.
Authorization
role

asks:

Now that I know who you are, are you allowed to do this?

Example:

Server: You are Hasan.
        Your role is "writer".
        But this route requires "admin".
        Access denied.

So:

Authentication
= Are you logged in?

while:

Authorization
= Are you allowed to access this resource?
*/
