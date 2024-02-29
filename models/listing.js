const mongoose = require("mongoose");
const {Schema}=mongoose;
const link = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listSchema = new Schema({
    title:{
        type: "String",
        required: true
    },
    description:{
        type: "String"
    },
    image:{
        url: String,
        filename: String
    },
    country:{
        type: "String"
    },
    location:{
        type: "String"
    },
    price:{
        type: "Number"
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Listing = new mongoose.model("Listing",listSchema);
module.exports = Listing;