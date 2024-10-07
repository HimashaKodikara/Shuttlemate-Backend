import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoName: {
      type: String,
      required :true,
    },
    videoCreator :{
      type: String,
      required:true,
    }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);