import jwt from "jsonwebtoken";

export const isLoggin = async (req, res, next) => {
  // req is just and object
  try {
    // console.log(req.cookies);
    let token = req.cookies?.token; // if token is available then give else variable is blank
    console.log("Token Found:", token ? "yes" : "no");

    if (!token) {
      return res.status(400).json({
        success: false,
        msg: "Token not found Authentication failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
    console.log(decoded); // it is just and object

    if (!decoded) {
      return res.status(400).json({
        success: false,
        msg: "Due to verification Authentication failed",
      });
    }

    req.User = decoded; // request object ma ek key user name ki add kia hai or usme decoded value put kia hai

    next();
  } catch (error) {
    console.log("Authentication middleware");

    res.status(500).json({
      success: false,
      error,
      msg: "Internal failure",
    });
  }
};
