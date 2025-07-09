import user from "../model/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const registeruser = async (req, res) => {
  // get data
  //validate
  // check if user already exists
  // create a user in database
  //create a verification token
  // save token in database
  // send token as email to user
  // send success status to user
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({
      msg: "All field are required",
    });
  }
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
      phone,
    });
    if (!newUser) {
      return res.status(400).json({
        msg: "User not Registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = token;
    console.log(
      `localhost:3000/api/v1/user/verify/${newUser.verificationToken}`
    );

    await newUser.save();

    res.status(200).json({
      msg: "User register Sucessfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered ",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  //get token from url
  //validate
  // find user based on token
  //if not
  // set isVerified field to true
  // remove verification token
  // save
  //return response

  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      msg: "Invalid token 1",
    });
  }

  const userToken = await user.findOne({ verificationToken: token }); // Dout hai thora se
  console.log(
    `localhost:3000/api/v1/user/verify/${userToken.verificationToken}`
  );
  if (!userToken) {
    return res.status(400).json({
      msg: "Invalid token 2",
    });
  }

  userToken.isVerified = true;
  userToken.verificationToken = undefined;

  await userToken.save();

  res.status(200).json({
    msge: "All Done",
  });
};

const login = async (req, res) => {
  // get data
  //validate
  // check in database email exist or not
  // if not then return
  //then check password
  // give jwt token

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "All fields are required ",
    });
  }

  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email or password 1",
      });
    }

    // password compare is this true or not
    const isMatch = await bcrypt.compare(password, existingUser.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password 2",
      });
    }

    // check user verification
    if (!existingUser.isVerified) {
      return res.status(400).json({
        message: "User not verify the Email",
      });
    }

    // send user key with the help of jwt
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_PASSWORD,
      {
        expiresIn: "24hr",
      }
    );

    //we send this token to the user with the help of cookie
    const cookieOtption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOtption);

    // now response will send
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (error) {}
};

const getMe = async (req, res) => {
  try {
    console.log("Reach the profile");
    const profile = await user
      .findOne({ _id: req.User.id })
      .select("-password");

    if (!profile) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error,
      msg: "Internal problem",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      msg: "User logout",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error,
      msg: "Internal Problem So Logout not Possible",
    });
  }
};

const forgetPassword = async (req, res) => {
  //get email
  // find user based on email
  // reset token + reset expiry => Date.now() + 10 * 60 * 1000 => user.save()
  // send mail => design url
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Invalide email",
      });
    }

    const userExist = await user.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    userExist.resetPasswordToken = token;
    userExist.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log(
      `http://localhost:3000/api/v1/user/forgetPassword/${userExist.resetPasswordToken}`
    );

    userExist.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const resetPassword = async (req, res) => {
  // collect token from params
  // password from req.body
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword || !(password === confirmPassword)) {
      return res.status(400).json({
        success: false,
        msg: "Invalide details",
      });
    }

    try {
      const foundUser = await user.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      foundUser.password = hashedPassword;
      foundUser.resetPasswordToken = undefined;
      foundUser.resetPasswordExpires = undefined;

      foundUser.save();
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Error Plss check",
      });
    }
  } catch (error) {}
};

export {
  registeruser,
  verifyUser,
  login,
  getMe,
  logout,
  forgetPassword,
  resetPassword,
};
