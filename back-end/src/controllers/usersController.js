import bcrypt from "bcryptjs";

import UserModel, { updateUser } from "../models/userModel.js";
import { generateToken } from "../utils/tokenUtils.js";

// POST /user

export const createUser = async (req, res) => {
  try {
    const { f_name, l_name, age, email, file_path, password } = req.body;
    console.log("pass", password);
    // const pic = req.file ? req.file.path : "";
    const numSaltRounds = 8;

    const hashedPass = await bcrypt.hash(password, numSaltRounds);
    console.log("hash pass con", hashedPass);
    const user = await UserModel.createUser(
      f_name,
      l_name,
      age,
      email,
      file_path,
      hashedPass,
    );
    if (user === undefined) {
      return res
        .status(400)

        .json({ message: "Email address is already registered" });
    } else res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// GET /user
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// GET /user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the method from the model to retrieve the user by ID
    const user = await UserModel.getUserById(id);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user by ID" });
  }
};

// DELETE /user
export const deleteAllUsers = async (req, res) => {
  try {
    await UserModel.deleteAllUsers();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Failed to delete users" });
  }
};

// DELETE /user by ID
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the method from the model to delete the user by ID
    await UserModel.deleteUserById(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// UPDATE /user
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { f_name, l_name, age, email, pic } = req.body;

    // Call the updateUser method from the model
    await updateUser(id, { f_name, l_name, age, email, pic });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Login / login;

export const loginEmailPass = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve the user by email
    const user = await UserModel.loginEmailPass(email, password);
    console.log("User from database:", user);

    if (!user) {
      console.log("User not found");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    console.log("Provided password:", password);
    console.log("Hashed password in the database:", user.password);

    // Log the lengths of the passwords before and after trimming
    console.log("Provided password length:", password.length);
    console.log("Hashed password length:", user.password.length);

    // Trim the password before comparison
    const trimmedPassword = password.trim();
    console.log("Trimmed password:", trimmedPassword);

    // Trim the hashed password before comparison
    const trimmedHashedPassword = user.password.trim();
    console.log("Trimmed hashed password:", trimmedHashedPassword);

    const isPasswordCorrect = await bcrypt.compare(
      trimmedPassword,
      trimmedHashedPassword,
    );
    console.log("Is password correct?", isPasswordCorrect);

    if (isPasswordCorrect) {
      const token = generateToken(user);
      console.log("Generated token:", token);
      console.log("Login successful");
      res.status(200).json({ message: "Login successful", user, token });
    } else {
      console.log("Invalid password");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to log in user" });
  }
};
