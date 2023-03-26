const jwt = require("jsonwebtoken");

module.exports = async function ValidateToken(token) {
  try {
    let decoded = await jwt.verify(token, process.env.SECRETKEY);
    user = decoded.user;
    email = decoded.email;
    id = decoded.id;
    isAdmin = decoded.isAdmin;

    return { id: id, user: user, email: email, isAdmin: isAdmin };
  } catch (error) {
    if (error === "jwt expired") {
      throw new Error("Token expired, please log out and login again");
    }
    throw new Error(error);
  }
};
