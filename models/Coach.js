import mongoose from "mongoose";

const Coachers = new mongoose.Schema(
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
      type: String,
      required: true,
    },
    Certifications: {
      type: String,
    },
    TrainingAreas: [
      {
        CourtName: {
          type: String,
          required: true,
        },
        Area: {
          type: String,
          required: true,
        },
      }
    ],
  }
);

export default mongoose.model("Coachers", Coachers);
