import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const CourtsSchema = new mongoose.Schema(
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
    Priceperhour:{
      type: Number,
      required: true,
    },
    Openinghours:{
      type : String,
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
      },
    ],
  },
  { timestamps: true, } // Disable default MongoDB _id
);



export default mongoose.model("Courts", CourtsSchema);
