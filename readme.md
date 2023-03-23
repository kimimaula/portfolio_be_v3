REV-SERVER

Changelog v0.1.1 20/3/2023

1. Add base index with connection to mongo
2. Installed dependencies
3. Add start script with nodemon
4. Add routes for user to login and register
5. Add user models/schema
6. Add and installed bcrypt and jwt for user token
7. Add validation for user routes
8. Installed cors

Changelog v0.1.2 21/3/2023

1. Add dummy data and route for main page news
2. Add dummy data and route for events
3. Add validation for checking auth token with jwt
4. Add route for adding reviews while checking token with secret key

Changelog v0.1.3 22/3/2023

1. Fix and add review ID's to events schema array for easy indexing and fixed events name
2. Added get event route
3. Standardize several error handling
4. Added route for admins and added isAdmin to jwt token
5. Moved schema to different folders to avoild conflict
6. Added isadmin and retrieve from token
7. Add status publish to news and events and only return published content
8. Fix file names as previously changed Models folder
9. Updated events and news with ref to user
10. Added routes for admins to add news and events

changelog v01..4 23/3/2023

1. Added 3 api for users to generate otp, verify otp and change password
2. Send isAdmin when user login
3. Fix aggregate when combining reviews data
4. Added routes to edit reviews
5. Added published and draft status for reviews
6. added 3 api for users to generate otp, verify otp and change password
7. Integrate email server in sendinblue for OTP in email
