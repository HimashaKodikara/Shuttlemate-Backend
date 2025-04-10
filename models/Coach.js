import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection; // Get mongoose connection
const AutoIncrement = AutoIncrementFactory(connection);

const CoachSchema = new mongoose.Schema(
  {
    CoachPhoto: {
      type: String,
      required: true,
    },
    CoachName: {
      type: String,
      required: true,
    },
    Tel: {
      type: String,
    },
    TrainingType: {
      type: [String],
      required: true,
    },
    Certifications: {
      type: String,
    },
    Experiance:{
      type:Number,
    },
    Courts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courts", 
        required: true,
      }
    ],
  },
  { timestamps: true } 
);




export default mongoose.model("Coachers", CoachSchema);
