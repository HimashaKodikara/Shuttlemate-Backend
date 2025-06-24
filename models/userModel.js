import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type:String,
        required : true,
        enum:["admin","coach","courtowner","shopowner"]
    },
},
    {
        timestamps:true,
    }
);

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;
