import {
  findUserByEmail,
  findUserById,
  findUserByName,
  findUserPassword,
  createUser,
  findEmailForUpdate,
  findNameForUpdate,
  updateUserById,
  deleteUserById
} from "../models/user.model.js";

import { token } from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { isValidEmail, isValidUsername, isValidPassword } from "../utils/regexVerification.js";

// GET /me
export async function getMe(req, res, next) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// REGISTER
export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email format" });

    if (!isValidUsername(name))
      return res.status(400).json({ error: "Invalid username format" });

    if (!isValidPassword(password))
      return res.status(400).json({ error: "Invalid password format" });

    const emailExists = await findUserByEmail(email);
    if (emailExists)
      return res.status(409).json({ error: "Email already registered" });

    const nameExists = await findUserByName(name);
    if (nameExists)
      return res.status(409).json({ error: "Name already registered" });

    const hashedPassword = await hashPassword(password);

    const user = await createUser(name, email, hashedPassword);

    const jwtToken = token({ id: user.id, role: user.role });

    res.status(201).json({
      message: "Registered successfully",
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
}

// LOGIN
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email format" });

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwtToken = token({ id: user.id, role: user.role });

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE
export async function updateUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    if (!name && !email && !password) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    if (name) {
      if (!isValidUsername(name))
        return res.status(400).json({ error: "Invalid username format" });

      const nameExists = await findNameForUpdate(name, userId);
      if (nameExists)
        return res.status(409).json({ error: "Name already registered" });
    }

    if (email) {
      if (!isValidEmail(email))
        return res.status(400).json({ error: "Invalid email format" });

      const emailExists = await findEmailForUpdate(email, userId);
      if (emailExists)
        return res.status(409).json({ error: "Unable to update email" });
    }

    let hashedPassword;

    if (password) {
      if (!isValidPassword(password))
        return res.status(400).json({ error: "Invalid password format" });

      const currentPassword = await findUserPassword(userId);

      if (!currentPassword)
        return res.status(404).json({ error: "User not found" });

      const samePassword = await comparePassword(password, currentPassword.password);

      if (samePassword)
        return res.status(400).json({ error: "Password must be different" });

      hashedPassword = await hashPassword(password);
    }

    const updated = await updateUserById(name, email, hashedPassword, userId);

    if (!updated)
      return res.status(404).json({ error: "User not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function deleteUser(req, res, next) {
  try {
    const deleted = await deleteUserById(req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
}