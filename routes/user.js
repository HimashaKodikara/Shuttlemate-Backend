import express from "express";

import {createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser} from "../controllers/userController.js";

const router = express.Router();

// http://localhost:5000/api/user/
router.post('/', createUser);         // Create user
router.get('/', getAllUsers);            // Get all users
router.get('/:firebaseUid', getUserById);      // Get user by ID
router.put('/:firebaseUid', updateUser);       // Update user
router.delete('/:id', deleteUser);    // Delete user



export default router;