"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generatetoken_1 = __importDefault(require("../utils/generatetoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match." });
        }
        const user = yield userModel_1.default.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "This username already exists." });
        }
        //hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new userModel_1.default({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyprofilePic : girlProfilePic,
        });
        if (newUser) {
            //generate Jwt token
            (0, generatetoken_1.default)(newUser._id, res);
            yield newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.log('Error in signup controller', error.message);
        res.status(500).json({ error: 'internal server error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield userModel_1.default.findOne({ username });
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || '');
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalidusername or password' });
        }
        (0, generatetoken_1.default)(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullName,
            username: user.username,
            profilepic: user.profilePic
        });
    }
    catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ error: 'internal server error' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('jwt', "", { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'internal server error' });
    }
});
exports.logout = logout;
