const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const { secret } = require("../config/keys");

// @Route   GET api/content/education/
// @desc    Get all educations
// @access  Public
router.get("/", async (req, res) => {
  try {
    return res.json({ message: "Done!" });
  } catch (err) {
    return res.status(401).json({ msg: "Could not fetch data" });
  }
});

// @Route   POSt api/user/register
// @desc    Register new user
// @access  Public
router.post(
  "/register",
  [
    body("email").exists().isEmail(),
    body("displayName").exists().isDate(),
    body("subscriptionStatus").optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const currentTime = dayjs().toDate();
      const { email, displayName, subscriptionStatus = "FREE" } = req.body;

      const lastPostDate = currentTime;
      const lastLoginDate = currentTime;
      const createdDate = currentTime;
      const updatedDate = currentTime;

      const newUser = await User.create({
        email,
        displayName,
        subscriptionStatus,
        lastPostDate,
        lastLoginDate,
        createdDate,
        updatedDate,
      });

      if (!newUser) {
        throw new Error("Could not register new user.");
      }

      const tokenObject = {
        email: newUser.email,
        subscriptionStatus: newUser.subscriptionStatus,
      };

      const token = jwt.sign(tokenObject, secret, {
        expiresIn: "30d",
      });

      return res.status(200).send({
        ok: true,
        data: { user: newUser.toJSON(), token },
        msg: "Registered user successfully.",
      });
    } catch (err) {
      return res.status(400).json({
        ok: false,
        msg: err.message || "Could not register new user.",
      });
    }
  }
);

// @Route   POSt api/user/login
// @desc    Login user
// @access  Public
router.post("/login", [body("email").exists().isEmail()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, errors: errors.array() });
    }

    const currentTime = dayjs().toDate();

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Could not find user.");
    }

    await User.findOneAndUpdate(
      { email },
      {
        lastLoginDate: currentTime,
        updatedDate: currentTime,
      },
      { new: true }
    );

    const tokenObject = {
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
    };

    const token = jwt.sign(tokenObject, secret, {
      expiresIn: "30d",
    });

    return res.status(200).send({
      ok: true,
      data: { user: user.toJSON(), token },
      msg: "Registered user successfully.",
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      msg: err.message || "Could not register new user.",
    });
  }
});

// Export the routes of person
module.exports = router;
