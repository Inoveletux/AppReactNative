//models/ProgramInside


const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProgramInsideSchema = new Schema(
  {
    title: {
      type: String, 
      required: true
    },
    program: {
      type: Schema.ObjectId, 
      required: true
    },
    video_url: {
      type: String, 
      required: true
    },
    post_image: {
      type: String,
      required: true
    },
    duration_indicator:{
      type: Number,
      required: true
    },
    duration_indicator:{
      type: Number,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }
)


module.exports = ProgramsInside = mongoose.model("ProgramsInsisde", ProgramInsideSchema, "programsContent");
