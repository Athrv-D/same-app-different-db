  const express = require('express')
   
  const app = express()
  const port = 3000
  const methodOverride=require('method-override')
  const cookieParser = require('cookie-parser')
  
  const path = require("path");
  const {v4:uuidv4} = require('uuid')
  const multer = require("multer");
  app.use(cookieParser());

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

  app.set("view engine", "ejs")
  app.set("views",path.join(__dirname,"views"));
  app.use(express.static(path.join(__dirname,"public")));


  let defaultPic = makeAvatar();
 



  let posts = [
    
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




  app.get("/posts",(req,res)=>{ 
        
          res.render("index.ejs",{posts})
 });
  
  
  app.get("/posts/new",(req,res) =>{
    res.render("new.ejs")
  });
  
  app.post("/posts", upload.fields([{name:"profilePic",maxCount:1},{name:"images",maxCount:1}]), (req, res) => {
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
    
    
    res.redirect("/posts")
  });
  
  
  app.get("/posts/:id",(req,res)=>{
    let{id} = req.params;
    let post = posts.find((p)=> id === p.id);
    console.log(post)
    res.render("show.ejs",{post});
  })
  
  app.patch("/posts/:id",upload.array("images",10),(req,res)=>{
    let {id} = req.params; 
    let  newContent = req.body.content;
    let post = posts.find((p)=> id === p.id);
    post.content = newContent;
    if(req.files.length>0){
      let newImages=req.files.map(f=> "/uploads/" + f.filename);
      post.images= post.images.concat(newImages);
    }
    
    console.log(post)
    res.redirect("/posts")
  })
  app.patch("/posts/:id/profile",upload.single("profilePic"),(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=>id===p.id);
     post.profilePic = "/uploads/" + req.file.filename;
     res.redirect("/posts")


  })
  
  app.get("/posts/:id/edit",upload.array("images",10),(req,res) =>{
    let {id} = req.params;
    let post = posts.find((p) => id===p.id);
    
    
    
    
    res.render("edit.ejs",{post})
    
  });
  
  app.delete("/posts/:id",(req,res) =>{
    let {id} = req.params;
    posts = posts.filter((p) => id !==p.id);
    res.redirect("/posts")
  })
  
  app.get("/posts/:id/comment",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id===p.id);
    res.render("comment.ejs",{post})
    
    
  })
  
app.post("/posts/:id/comment",(req,res)=>{
  let {id} = req.params;
  let {username,comment} = req.body;
  let post = posts.find((p)=> id === p.id);
  post.comments.push({username,text:comment})
  res.redirect(`/posts/${id}/comment`)
  
});


app.get("/toggle-theme",(req,res)=>{
  const current = req.cookies.theme;
  const newTheme =  current=== "dark" ? "light":"dark"
  
  res.cookie("theme",newTheme,{httpOnly:false});
 const redirectTo=req.get("referer") || "/posts";
  res.redirect(redirectTo);


});







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
