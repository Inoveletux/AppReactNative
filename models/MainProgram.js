const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MainProgramSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        poster_image: {
            type: String,
            required: true
        }
    },
);

module.exports = MainProgram = mongoose.model("MainProgram", MainProgramSchema, "programs");