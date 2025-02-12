
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

  export const deleteCourt = async (req,res,next) =>{
    const {id}  = req.params;

    try{
      const deleteCourt = await Courts.findByIdAndDelete(id);
      if(!deleteCourt){
        return res.status(404).json({success:false,message:'Court not found'});
      }
    res.status(200).json({success:false,message:"court deleted succesfully"});

  }catch(error){
     console.error("Error deleting court",error);
     res.status(500).json({success:false,message:"Failed to delete court"});
     next(error);
  }
}; 

export const UpdateCourt = async (req, res, next) =>{
  const{id} = req.params;

  const{CourtPhoto,CourtName,Tel,place,Directions} = req.body;

  try{
    const updateCourt = await Courts.findByIdAndUpdate(
      id,
      {CourtPhoto,CourtName,Tel,place, Directions},
      {new:true, runValidators:true}
    );
    if(!updateCourt){
      return res.status(404).json({success:false,message:'Court not found'});
    }
    res.status(200).json({success:true,court:updateCourt});
  }
  catch(error){
    console.error("Error updating court",error);
    res.status(500).json({success:false,message:"Failed to update court!"});
    next(error);
  }
}