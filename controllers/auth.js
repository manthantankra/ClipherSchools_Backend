const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const { createError } = require("../error.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashPassword });

        await newUser.save();
        res.status(200).json({
            msg: "User has been created!",
            newUser,
        });

    } catch (err) {
        next(err);
    }
};

exports.signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) return next(createError(404, "User not found!"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

        const { password, ...others } = user._doc;

        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(others);

    } catch (err) {
        next(err);
    }
};

exports.googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
            res
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .status(200)
                .json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_KEY);
            res
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .status(200)
                .json(savedUser._doc);
        }
    } catch (err) {
        next(err);
    }
};
