  const express = require('express')
  const mongoose = require('mongoose')
  const app = express()
  const port = 8080
  const Chat = require("./models/chat.js")
  
  const cookieParser = require('cookie-parser')
  app.use(cookieParser());

  main().then(()=>{
    console.log("Connection Successful");
  })
  .catch((err)=>{
    console.log(err)
  })
  main().catch(err=>console.log(err));
  async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
    
  }
 
  const methodOverride=require('method-override')
  
  const path = require("path");
  const {v4:uuidv4} = require('uuid')
  const multer = require("multer");

  app.use((req,res,next)=>{
    res.locals.theme=req.cookies.theme || "light"
    next();
  });

   function makeAvatar() {
    return `https://api.dicebear.com/8.x/thumbs/svg?seed=${uuidv4()}`;
  }


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads"); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });

  const upload = multer({ storage });

  
  
  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride('_method'))

  app.set("view engine", "ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use(express.static(path.join(__dirname,"public")));


  let defaultPic = makeAvatar();
 


  let Defaultposts = [
    
    {
    id:uuidv4(),
    username:"atharv",
    content:"it is nothing is God",
    profilePic:  makeAvatar(),
    images:[],
    comments:[]

    

  },
    {
    id:uuidv4(),
    username:"saksham",
    content:"God is nothing",
      profilePic:  makeAvatar(),
    images:[],
    comments:[]



  },
    {
    id:uuidv4(),
    username:"clown",
    content:"it is so amazing",
    profilePic:  makeAvatar(),
    images:[],
    comments:[]


  

  },
    {
    id:uuidv4(),
    username:"sakshu",
    content:"influencer",
    profilePic:  makeAvatar(),
    images:[],
    comments:[]




  }

  ]


// Show route 
  app.get("/posts", async (req,res)=>{
    let posts =  await Chat.find()
        
          res.render("index.ejs",{posts})
          
 });

// Create Route
  
  
  app.get("/posts/new",(req,res) =>{

    res.render("new.ejs")
  });
  
  app.post("/posts", upload.fields([{name:"profilePic",maxCount:1},{name:"images",maxCount:1}]),    (req, res) => {
    let posts =[]
    let { username, content } = req.body;
    
    let id = uuidv4();
    const profilePic = req.files.profilePic ? "/uploads/" + req.files.profilePic[0].filename:makeAvatar();
    const images = req.files.images ? req.files.images.map(f => "/uploads/" + f.filename) : [];

    
     posts.push({
       id,
       username,
       content,
       profilePic,
       images,
       comments:[]
      
     })
     Chat.insertMany(posts.pop())
    
    res.redirect("/posts")
  });
  

  // SHOW IN DETAIL
  
  app.get("/posts/:id", async(req,res)=>{
    let{id} = req.params;
    console.log(id)
    let post = await Chat.findById(id);
    console.log(post)
     res.render("show.ejs",{post});
  })

  // Update route
  
  app.patch("/posts/:id",upload.fields([{name:"profilePic", maxCount:1},{name:"images",maxCount:10}]), async (req,res)=>{
    let {id} = req.params; 
    let  newContent = req.body.content;
    let post = await Chat.findById(id);
      if(req.files && req.files.profilePic){

      post.profilePic =   "/uploads/"  + req.files.profilePic[0].filename;
 
    }


    
    post.content = newContent;
      let newImages = req.files.images ? req.files.images.map(f=> ({url:"/uploads/" + f.filename })):[];


       post.images= post.images.concat(newImages);

       let user = await Chat.findById(id)

      
    await Chat.findByIdAndUpdate(id,{$set:{profilePic:post.profilePic?post.profilePic:"",content:newContent,user}},{new:true})
    user.images.push({url:post.images})
    await post.save()
    console.log(post)
     res.redirect("/posts")
  })

  
  app.get("/posts/:id/edit",upload.array("images",10), async (req,res) =>{
    let {id} = req.params;  
    let post = await Chat.findById(id);
    console.log(post)
    
    res.render("edit.ejs",{post})
    
  });
  
  app.delete("/posts/:id", async (req,res) =>{
    let {id} = req.params;
    await Chat.findByIdAndDelete(id)
    res.redirect("/posts")
    console.log(res)

  })
  app.get("/posts/:id/comment", async (req,res)=>{
    let {id} = req.params;
    
    let post = await Chat.findById(id)
    res.render("comment.ejs",{post})
    
    
  })
  
  app.post("/posts/:id/comment",async (req,res)=>{
    let {id} = req.params;
    let {username,comment} = req.body;
    console.log(req.body)
    let post = await Chat.findById(id)
    post.comments.push({username:username,text:comment});
    await post.save()
    
    res.redirect(`/posts/${id}/comment`)
    
  });

  app.post("/posts/:postId/images/:imageId/delete",async (req,res)=>{
    let {postId,imageId}= req.params;
    console.log('WWW',postId,imageId)
    console.log("lalal",imageId)
    await Chat.findByIdAndUpdate({_id:postId} ,{$pull:{
      images:{_id:imageId}
    }
  })
  res.redirect(`/posts/${postId}`)
  

   })
  

app.get("/toggle-theme", (req,res)=>{
  const current = req.cookies.theme;
  const newTheme =  current=== "dark" ? "light":"dark"
  
  res.cookie("theme",newTheme,{httpOnly:false});
 const redirectTo=req.get("referer") || "/posts";
  res.redirect(redirectTo);


});







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
