import Video from "../models/Video.js";
import AutoIncrementFactory from "mongoose-sequence";


export const createVideo = async (req, res, next) => {
  const { imgUrl, videoUrl,videoName,videoCreator } = req.body;
 
  
//create video
  try {
    const video = await Video.create({
      imgUrl,
      videoUrl,
      videoName,
      videoCreator
    });

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
}

//get videos
export const getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({}, "imgUrl videoName videoCreator createdAt _id");

  
    const formattedVideos = videos.map(video => ({
      ...video._doc, 
      createdAt: video.createdAt.toISOString().split('T')[0], // Format to YYYY-MM-DD
    }));

    res.status(200).json({
      success: true,
      videos: formattedVideos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, message: "Failed to fetch videos" });
    next(error);
  }
};

//delete video
export const deleteVideo = async(req,res,next) =>{
  try
  {
    const{id} = req.params;
    const video = await Video.findByIdAndDelete(id);

    if(!video){
      return res.status(404).json({success:false, message:'Video not found'});
    }
    res.status(200).json({success:true , message:"Video deleted successfulty"});
  }catch(error){
    console.log("Error deleting video", error);
    res.status(500).json({success:false, message:"Failed to delete video"});
    next(error);
  }
};


//Update video
export const updateVideo = async (req, res, next) =>{
  try{
    const {id} = req.params;
    const{imgUrl, videoUrl, videoName,videoCreator} = req.body;

    const updateVideo = await Video.findByIdAndUpdate(
      id,
      {imgUrl, videoUrl, videoName, videoCreator },
      {new:true , runValidators:true}
    );

    if(!updateVideo){
      return resstatus(404).json({success:false, message:'vidoe not found'})
    }
    res.status(200).json({success:false, message,updateVideo});
  }catch(error){
    console.error("Error updating video:",error);
    res.status(500).json({success:false,message:"Failed to update video"});
    next(error);
  }
}
