const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    text:{type:String,
        required:true
    }
},

{_id:false}
)

const imageSchema  = new mongoose.Schema({
    url:String

},{timestamps:true})

const chatSchema =  new mongoose.Schema({
    username:{ 
        type:String,
        required:true,
        trim:true
    },
    images:[imageSchema],
    profilePic:{
            
            type:String,
        required:true
    },
    content:{
                type:String,
                required:true
            },
    comments:{
              type: [commentSchema]}

}, {
    timestamps:true
})
const Chat = mongoose.model("Chat",chatSchema);

module.exports = Chat;