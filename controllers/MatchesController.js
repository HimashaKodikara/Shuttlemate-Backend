import express from "express";
import mongoose from "mongoose";
import Matches from "../models/matches.js";

const router = express.Router();

// CREATE a new match
export const createMatch = async (req, res, next) => {
  try {
    const newMatch = await Matches.create(req.body);
    res.status(201).json({ success: true, match: newMatch });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ success: false, message: "Failed to create match" });
    next(error);
  }
};

// GET all matches
export const getAllMatches = async (req, res, next) => {
  try {
    const matches = await Matches.find();
    res.status(200).json({ success: true, matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ success: false, message: "Failed to fetch matches" });
    next(error);
  }
};

// GET a single match by ID
export const getMatchById = async (req, res, next) => {
  try {
    const match = await Matches.findById(req.params.id);
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, match });
  } catch (error) {
    console.error("Error fetching match:", error);
    res.status(500).json({ success: false, message: "Failed to fetch match" });
    next(error);
  }
};

// UPDATE a match by ID
export const updateMatch = async (req, res, next) => {
  try {
    const match = await Matches.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, match });
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ success: false, message: "Failed to update match" });
    next(error);
  }
};

// DELETE a match by ID
export const deleteMatch = async (req, res, next) => {
  try {
    const match = await Matches.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ success: false, message: "Failed to delete match" });
    next(error);
  }
};

export default router;
