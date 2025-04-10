import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import Coachers from '../models/Coach.js';

export const createcoach = async (req, res, next) => {
  const { CoachPhoto, CoachName, Tel, TrainingType, Certifications, Courts, Experiance } = req.body;

  try {
    const coach = await Coachers.create({
      CoachPhoto,
      CoachName,
      Tel,
      TrainingType,
      Certifications,
      Courts,
      Experiance
    });

    res.status(201).json({
      success: true,
      coach,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
}

//get method
export const getCoachers = async (req, res, next) => {
  try {
    const coachers = await Coachers.find().populate('Courts');;

    const formattedCoache = coachers.map(coach => ({
      ...coach._doc,
    }));

    res.status(200).json({
      success: true,
      coachers: formattedCoache,
    });
  } catch (error) {
    console.error("Error fetching coaches:", error);
    res.status(500).json({ success: false, message: "Failed to fetch coaches" });
    next(error);
  }
};

// Get single coach by ID with populated Courts
export const getSingleCoach = async (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Coach ID format" });
  }

  try {
    const coach = await Coachers.findById(id).populate('Courts');
    
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }

    res.status(200).json({
      success: true,
      coach,
    });
  } catch (error) {
    console.error("Error fetching coach:", error);
    res.status(500).json({ success: false, message: "Failed to fetch coach" });
    next(error);
  }
};

//Update Coach
export const updateCoach = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateCoach = await Coachers.findByIdAndUpdate(id, updateData, { new: true });
    if (!updateCoach) {
      return res.status(404).json({ success: false, message: "coach not found" });
    }
    res.status(200).json({ success: true, coach: updateCoach });
  } catch (error) {
    console.error("Error updating coach :", error);
    res.status(500).json({ success: false, message: "Failed to update coach" });
    next(error);
  }
}


//Delete coach
export const deleteCoach = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Coach ID format" });
  }

  try {
    const deletecoach = await Coachers.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    if (!deletecoach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }

    res.status(200).json({ success: true, message: "Coach deleted successfully" });
  } catch (error) {
    console.error("Error deleting coach:", error);
    res.status(500).json({ success: false, message: "Failed to delete coach" });
    next(error);
  }
};