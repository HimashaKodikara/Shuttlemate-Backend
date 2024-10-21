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
        latitute: {
          type: String,
          required: true,
        },
        lognitude: {
          type: String,
          required: true,
        },
      }
    ],
  }
);

export default mongoose.model("Courts", Courts);
