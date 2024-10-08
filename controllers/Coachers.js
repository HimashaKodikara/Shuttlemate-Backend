
import Coachers from '../models/Coach.js'; 


export const createcoach = async (req, res, next) => {
    const {CoachPhoto,CoachName, Tel,TrainingType,Certifications,TrainingAreas  } = req.body;
   
    
  
    try {
      const coach = await Coachers.create({
        CoachPhoto,
        CoachName,
         Tel,
         TrainingType,
         Certifications,
         TrainingAreas
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
  

  export const getCoachers = async (req, res, next) => {
    try {
      const coachers = await Coachers.find({}, "CoachName TrainingType Tel ");
  
    
      const formattedCoache = coachers.map(coach => ({
        ...coach._doc, 
        
      }));
  
      res.status(200).json({
        success: true,
        coachers: formattedCoache,
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ success: false, message: "Failed to fetch videos" });
      next(error);
    }
  };