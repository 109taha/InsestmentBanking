const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../model/adminSchema");
const User = require("../model/userSchema");
const cloudinary = require("../helper/cloudinary");
const upload = require("../helper/multer");
const fs = require("fs");
const { AdminJoiSchema, UserJoiSchema } = require("../helper/joi/joiSchema");
const sendResetEmail = require("../helper/nodemailer");
const { verifyUser } = require("../helper/middleware/verify");

router.post("/registeradmin", AdminJoiSchema, async (req, res) => {
  try {
    const { email, name, password, phoneNumber, devicetoken } = req.body;
    console.log(req.body);
    if (!email || !name || !password || !phoneNumber) {
      return res.status(400).send("you have to provide all of the felid");
    }
    const exisitUser = await Admin.findOne({ email });
    if (exisitUser) {
      return res.status(400).send("User already register, goto login page");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const newAdmin = new Admin({
      email,
      name,
      password: hashedPassword,
      phoneNumber,
      devicetoken,
    });
    console.log(newAdmin);
    await newAdmin.save();
    res
      .status(200)
      .send({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

router.put(
  "/profile/pic",
  upload.array("attachArtwork", 1),
  verifyUser,
  async (req, res) => {
    const files = req.files;
    const attachArtwork = [];

    try {
      if (files && files.length > 0) {
        for (const file of files) {
          const { path } = file;
          try {
            const uploader = await cloudinary.uploader.upload(path, {
              folder: "blogging",
            });
            attachArtwork.push({ url: uploader.secure_url });
            fs.unlinkSync(path);
          } catch (err) {
            if (attachArtwork.length > 0) {
              const imgs = attachArtwork.map((obj) => obj.public_id);
              cloudinary.api.delete_resources(imgs);
            }
            console.log(err);
          }
        }
      }
      console.log(attachArtwork);
      const users = req.user;

      const user = await User.findById(users);
      if (!user) {
        return res.status(404).send("User not found");
      }
      user.profile_pic =
        attachArtwork.length > 0 ? attachArtwork[0].url : user.profile_pic;

      await user.save();

      res.status(200).send("Profile pic added successfully ");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
);

router.post("/forgotadmin", async (req, res) => {
  try {
    const email = req.body.email;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).send("No Admin found on that email");
    }
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    console.log(token);
    sendResetEmail(email, token);
    res.json({
      success: true,
      message: "Check your email for the verification code.",
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error: " + error.message });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const email = req.body.email;

    const staff = await User.findOne({ email });
    if (!staff) {
      return res.status(400).send("no User found on that email");
    }
    const userId = staff._id;
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    sendResetEmail(email, token);

    res.send({
      success: true,
      message: "Check your email for the verification code.",
      data: token,
      Id: userId,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error: " + error.message });
  }
});

router.post("/register", UserJoiSchema, async (req, res) => {
  try {
    const { email, name, password, phoneNumber, devicetoken } = req.body;
    if (!email || !name || !password || !phoneNumber) {
      return res.status(400).send("you have to provide all of the field");
    }
    const exisitUser = await User.findOne({ email });
    if (exisitUser) {
      return res.status(400).send("User already register, goto login page");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phoneNumber,
      devicetoken,
    });

    await newUser.save();
    res
      .status(200)
      .send({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, name, password, phoneNumber, devicetoken } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    user.email = email || user.email;
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.devicetoken = devicetoken || user.devicetoken;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

router.get("/alluser", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let sortBY = { createdAt: -1 };
    if (req.query.sort) {
      sortBY = JSON.parse(req.query.sort);
    }

    const total = await User.countDocuments();
    const AllUser = await User.find().skip(skip).limit(limit).sort(sortBY);

    if (!AllUser.length > 0) {
      return res.status(400).send("No user found!");
    }
    const totalPages = Math.ceil(total / limit);
    res
      .status(200)
      .send({ success: true, AllUser, page, totalPages, limit, total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

router.get("/oneuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).send("No user found!");
    }
    res.status(200).send({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password.",
      });
    }

    const admin = await Admin.findOne({ email });

    if (admin) {
      const validUserPassword = await bcrypt.compare(password, admin.password);
      if (validUserPassword == false) {
        return res.status(400).send("Password is Incorrect");
      }
      const token = JWT.sign({ userId: admin._id }, process.env.JWT_SEC_ADMIN);

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        user: admin,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("Invalid Email!");
    }

    const validUserPassword = await bcrypt.compare(password, user.password);

    if (validUserPassword == false) {
      return res.status(400).send("Password Is incorrect");
    }
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SEC);

    return res.status(200).json({
      success: true,
      message: "User login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUser = await User.findByIdAndDelete(userId);
    if (deleteUser === null) {
      return res.status(400).send("no User found!");
    }
    res
      .status(200)
      .send({ success: false, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/search/:name", async (req, res, next) => {
  try {
    const searchfield = req.params.name;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const total = await User.countDocuments({
      name: { $regex: searchfield, $options: "i" },
    });

    const user = await User.find({
      name: { $regex: searchfield, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);
    const item = { user };
    res.status(200).send({ data: item, page, totalPages, limit, total });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
