REV-SERVER

An Application created for Regov Technologies Interview

## Requirements

- Node.js
- npm
- MongoDB

## Setup

1. Clone the repository:
   https://github.com/kimimaula/regov-be.git
2. Navigate to the project directory:
   `cd regov-be`
3. Install the dependencies:
   `npm install`
4. Create a `.env` file in the root directory of the project to store the environment variables:
   touch .env
5. Open the `.env` file and add the following environment variables:
   MONGOURI="your_mongo_uri_here"
   PORT="4200"
   SECRETKEY="your_secret_key_here"
   EMAILAPIKEY="your_email_api_key_here"
   Replace `your_mongo_uri_here`, `your_secret_key_here`, and `your_email_api_key_here` with actual values.
6. Save the `.env` file and close it.

## Running the Application

`npm run start`

To start the application, run the following command in the project directory:

The application will start and listen on the specified port. You can now access the application in your web browser at `http://localhost:4200`.

## Additional Information

## Changelog

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

changelog v0.1.4 23/3/2023

1. Added 3 api for users to generate otp, verify otp and change password
2. Send isAdmin when user login
3. Fix aggregate when combining reviews data
4. Added routes to edit reviews
5. Added published and draft status for reviews
6. added 3 api for users to generate otp, verify otp and change password
7. Integrate email server in sendinblue for OTP in email

changelog v0.1.5 24/3/2024

1. Standardize admin route names to camelCase
2. Fix path names
3. Removed unused nodemailer
4. change app entry point
5. Specify node version for heroku

changelog v0.1.6 25/3/2023

1. Merged verifyOtp and changePassword into one so we check otp before changing passowrd
2. Fix events route where events that have no reviews are not being returned
