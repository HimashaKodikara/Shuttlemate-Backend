
import Courts from '../models/Courts.js'; 


export const createcourt = async (req, res, next) => {
    const { CourtPhoto,CourtName,Tel,place,Directions} = req.body;
   
    
  
    try {
      const court = await Courts.create({
        CourtPhoto,CourtName,Tel,place,Directions
      });
  
      res.status(201).json({
        success: true,
        court,
      });
    } catch (error) {
      console.log(error);
      res.status(500);
      next(error);
    }
  }
  

  export const getCourts = async (req, res, next) => {
    try {
      const courts = await Courts.find({}, "CourtName Tel place ");
  
    
      const formattedCoache = courts.map(court => ({
        ...court._doc, 
        
      }));
  
      res.status(200).json({
        success: true,
        courts: formattedCoache,
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ success: false, message: "Failed to fetch videos" });
      next(error);
    }
  };