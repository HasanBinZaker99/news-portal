mdhbz99e_db_user
LbuhXCM640DWKDWH

When the user enters their email and password, the controller checks the information. It finds the user by email and verifies the password using bcrypt. If the information is correct, the controller creates a JWT token using the user's information, a secret key, and an expiration time of 2 days. Then it sends the token back to the frontend.
