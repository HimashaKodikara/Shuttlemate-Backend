import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection; 
const AutoIncrement = AutoIncrementFactory(connection);

const Courts = new mongoose.Schema(
  {
    _cid: {
      type: Number, 
    },
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

Courts.plugin(AutoIncrement, { inc_field: "_cid" });
export default mongoose.model("Courts", Courts);
