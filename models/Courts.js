import mongoose from "mongoose";

const Courts = new mongoose.Schema(
  {
    CourtPhoto: {
      type: String,
      required: true,
    },
    CourtName: {
      type: String,
      required: true,
    },
    Tel: {
      type: String,
    },
    place: {
      type: String,
      required: true,
    },
    
    Directions: [
      {
        latitude: {
          type: String,
          required: true,
        },
        longitude: {
          type: String,
          required: true,
        },
      }
    ],
  }
);

export default mongoose.model("Courts", Courts);
