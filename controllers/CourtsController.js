import mongoose from "mongoose";
import Courts from '../models/Courts.js'; 
import { getRegisteredTokens } from "./notificationController.js";
import admin from '../firebase/firebaseAdmin.js';



export const createcourt = async (req, res, next) => {
    
    const { CourtPhoto, CourtName, Tel, place, Directions, Priceperhour, Openinghours } = req.body;
   
    try {
      // Validate required fields
      if (!CourtName) {
        return res.status(400).json({
          success: false,
          message: "Court name is required"
        });
      }

      const court = await Courts.create({
        CourtPhoto,
        CourtName,
        Tel,
        place,
        Directions,
        Priceperhour,
        Openinghours
      });


      // Send notifications
      try {
        const tokens = getRegisteredTokens();

        if (tokens && tokens.length > 0) {
          const message = {
            notification: {
              title: 'New Court Added!',
              body: `A new court has been added: ${court.CourtName || 'Check it out!'}`,
            },
            data: {
              screen: 'court',
              courtId: court._id.toString(),
              type: 'new_court'
            },
          };

          // Send notifications to all tokens
          const notifications = tokens.map(async (token) => {
            try {
              const result = await admin.messaging().send({
                ...message,
                token,
              });
              return result;
            } catch (error) {
              console.error(`Failed to send notification to token ${token.substring(0, 10)}...:`, error.message);
              return null;
            }
          });
          const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
          const failed = results.length - successful;
          
        } else {
          console.log('No registered tokens found for notifications');
        }
      } catch (notificationError) {
       
        console.error('Error sending notifications:', notificationError);
      }
      
      res.status(201).json({
        success: true,
        court,
        message: "Court created successfully"
      });
      
    } catch (error) {
      console.error("Error creating court:", error);
      
      // Check for specific MongoDB errors
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "A court with this information already exists"
        });
      }
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to create court",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      next(error);
    }
};
  

  export const getCourts = async (req, res, next) => {
    try {
      const courts = await Courts.find();

  
    
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



  export const deleteCourt = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Court ID" });
    }

    try {
        const deletedCourt = await Courts.findByIdAndDelete(id);
        if (!deletedCourt) {
            return res.status(404).json({ success: false, message: "Court not found" });
        }

        res.status(200).json({ success: true, message: "Court deleted successfully" });

    } catch (error) {
        console.error("Error deleting court:", error);
        res.status(500).json({ success: false, message: "Failed to delete court" });
        next(error);
    }
};

// export const UpdateCourt = async (req, res, next) =>{
//   const{id} = req.params;

//   const{CourtPhoto,CourtName,Tel,place,Directions} = req.body;

//   try{
//     const updateCourt = await Courts.findByIdAndUpdate(
//       id,
//       {CourtPhoto,CourtName,Tel,place, Directions},
//       {new:true, runValidators:true}
//     );
//     if(!updateCourt){
//       return res.status(404).json({success:false,message:'Court not found'});
//     }
//     res.status(200).json({success:true,court:updateCourt});
//   }
//   catch(error){
//     console.error("Error updating court",error);
//     res.status(500).json({success:false,message:"Failed to update court!"});
//     next(error);
//   }
// }

//Update Coach
export const UpdateCourt = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateCourt = await Courts.findByIdAndUpdate(id, updateData, { new: true });
    if (!updateCourt) {
      return res.status(404).json({ success: false, message: "court not found" });
    }
    res.status(200).json({ success: true, court: updateCourt });
  } catch (error) {
    console.error("Error updating court :", error);
    res.status(500).json({ success: false, message: "Failed to update court" });
    next(error);
  }
}
