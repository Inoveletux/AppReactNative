const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: {
        createdAt: "created_at", 
        updatedAt: "edited_at"
    }
};

const UserSchema = new Schema({
    username:{
        type: String, 
        required:true
    }, 
    password:{
        type: String, 
        required:true
    }, 
    avatar:{
        type:String, 
        required: false
    }, 
    programsList:{
        type: Array, 
        required: false
    },
    uuid:{
        type: String, 
        required: true
    }
}, schemaOptions)

module.exports = User = mongoose.model("User", UserSchema, "users");