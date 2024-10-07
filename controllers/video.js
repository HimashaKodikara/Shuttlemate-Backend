import Video from "../models/Video.js";

export const createVideo = async (req, res, next) => {
  const { imgUrl, videoUrl } = req.body;
 
  

  try {
    const video = await Video.create({
      imgUrl,
      videoUrl,
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