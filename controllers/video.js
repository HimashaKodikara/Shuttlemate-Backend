import Video from "../models/Video.js";

export const createVideo = async (req, res, next) => {
  const { imgUrl, videoUrl,videoName,videoCreator } = req.body;
 
  

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

export const getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({}, "videoName videoCreator createdAt _id"); // Select specific fields

    // Format the createdAt date to include only the date part
    const formattedVideos = videos.map(video => ({
      ...video._doc, // Spread the existing video properties
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
