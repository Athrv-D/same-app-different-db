const mongoose = require('mongoose')
const Chat = require("./models/chat.js")
  const {v4:uuidv4} = require('uuid')


   function makeAvatar() {
    return `https://api.dicebear.com/8.x/thumbs/svg?seed=${uuidv4()}`;
  }

main().then(()=>{
    console.log("Connection Successfully Established")

})
.catch((err)=>{
    console.log(err)
})
main().catch(err=>console.log(err));
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let chat1 =   [{
    username:'hero',
    content:"Ma durga uske sath hai!",
    images:[],
    profilePic:makeAvatar(),
    comments:[]

},
{
    username:'shurpnaka',
    content:"Ma durga!",
    images:[],
    profilePic:makeAvatar(),
    comments:[]

},
{
    username:'villan',
    content:"Ma durga unke sath =thi!",
    images:[],
    profilePic:makeAvatar(),
    comments:[]

},
{
    username:'Zero',
    content:"Ma  uske bhi sath hai!",
    images:[],
    profilePic:makeAvatar(),
    comments:[]

}]
Chat.insertMany(chat1)