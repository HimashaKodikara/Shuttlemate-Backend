
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
  
//get method
  export const getCoachers = async (req, res, next) => {
    try {
      const coachers = await Coachers.find({}, "CoachPhoto CoachName Tel TrainingType Certifications TrainingAreas ");
  
    
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

  //Update Coach
  export const updateCoach = async(req, res, next) =>{
    const {id} = req.params;
    const updateData = req.body;

    try{
      const updateCoach = await Coachers.findByIdAndUpdate(id, updateData,{new:true});
      if(!updateCoach){
        return res.status(404).json({success:false, message:"coach not found"});
      }
      res.status(200).json({success : true,coach:updateCoach});
    }catch(error){
      console.error("Error updating coach :",error);
      res.status(500).json({success : false,message:"Failed to update coach"});
      next(error);
    }
  }

  //Delete coach
  export const deleteCoach = async (req,es, next ) =>{
  const{id} = req.params;
  try{
    const deletecoach = await Coachers.findByIdAndDelete(id);
    if(!deletecoach){
      return res.status(404).json({success:false,message:"Coach not found"});
    }
    res.status(200).json({success:true,message:"oach deleted successfultyc"});
  }catch(error){
    console.error("Error deleting coach:" ,error);
    res.status(500).json({success:false,message:"Failed to delete coach"});
    next(error);
  }
  };