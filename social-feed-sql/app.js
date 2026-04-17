  const express = require('express')
  const mysql =require('mysql2')
  const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"Sakshamroot@2007",
    database:'QUORA_APP'
  });
  const app = express()
  const port = 3001
  const methodOverride=require('method-override')
  const cookieParser = require('cookie-parser')
  
  const path = require("path");
  const {v4:uuidv4} = require('uuid')
  const multer = require("multer");
const { profile } = require('console');
const { json } = require('stream/consumers');
const { release } = require('os');
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

  app.set("view engine", "ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use(express.static(path.join(__dirname,"public")));


  let defaultPic = makeAvatar();
 

  const defaultPosts = [
  {
    id: "default-post-1",
    username: "atharv",
    content: "it is nothing is God",
    profilePic: "https://api.dicebear.com/8.x/thumbs/svg?seed=atharv",
    images: [],
    comments: []
  },
  {
    id: "default-post-2",
    username: "saksham",
    content: "God is nothing",
    profilePic: "https://api.dicebear.com/8.x/thumbs/svg?seed=saksham",
    images: [],
    comments: []
  },
  {
    id: "default-post-3",
    username: "clown",
    content: "it is so amazing",
    profilePic: "https://api.dicebear.com/8.x/thumbs/svg?seed=clown",
    images: [],
    comments: []
  }
];




function insertDefaultPosts(){
  defaultPosts.forEach(p=>{
    const q = "INSERT  IGNORE INTO posts (id,username,content,profilePic,comments) VALUES(?,?,?,?,?)";
    const imageID = uuidv4()
    const data =[
      p.id,
      p.username,
      p.content,
      p.profilePic,
      JSON.stringify(p.comments),
     ]
     const imageData  =  [
       imageID,
       p.id,
      p.image

     ]
     const imageQuery = "INSERT INTO image (id,post_id,url) VALUES (?,?,?)"
    pool.query(q,data,(err,result)=>{
      if(err){
        console.log(err)
      }
      console.log(result)
    })
      pool.query(imageQuery,imageData,(err,result)=>{
        if(err){
          console.log(err)
        }
      })

  })
}

  app.get("/posts",(req,res)=>{

     let q = "select count(*) from posts";
  
    pool.query(q,(err,countResult)=>{
      if(err){
      console.log(err)
      return res.status(500).send("DB error");
      }
      const total =  countResult[0]["count(*)"]
    
      
      pool.query('SELECT * FROM posts',(err,posts)=>{
        if(err){
          console.log(err);
          return;
        }
        posts.forEach(p=>{
          if (Array.isArray(p.comments)){
            p.comments = p.comments;
          }else if( typeof p.comments==="string" && p.comments.trim()!== ""){
            try{
              p.comments = JSON.parse(p.comments)
            }
            catch{
              p.comments = []
            }
          }
          else{p.comments = []}
        })
      
          pool.query('SELECT * FROM image',(err,image)=>{
            console.log("imagein show",image)
            if(err){
              console.log(err);
              return;
            }
     
          
          res.render("index.ejs",{posts,total,image})
        })
        })
})
  
});
  
  
  
  

// CREATE ROUTE

  app.post("/posts", upload.fields([{name:"profilePic",maxCount:1},{name:"images",maxCount:1}]), (req, res) => {
    let { username, content } = req.body;
    
    let id = uuidv4();
   
    const profilePic = req.files?.profilePic?.length> 0 ? "/uploads/" + req.files.profilePic[0].filename:makeAvatar();
    console.log(profilePic)

    const images = req.files.images ? req.files.images.map(f => "/uploads/" + f.filename) : [];
     let q = "INSERT INTO posts (content,comments,username,profilePic,id) VALUES ( ?,?,?,?,?)";
     const comments = [];
     const postID = uuidv4()
     const ImageId = uuidv4()
     const data = [
       content,
       JSON.stringify(comments),
       username,
       profilePic,
       postID
      ];
      data.forEach(p=>{
        if (Array.isArray(p.comments)){
              p.comments = p.comments;
            }else if( typeof p.comments==="string" && p.comments.trim()!== ""){
              try{
                p.comments = JSON.parse(p.comments)
              }
              catch{
                p.comments = []
              }
            }
            else{p.comments = []}
       })
     pool.query(q,data,(err)=>{

       if(err){
         console.log(err);
         if(err.errno===1062){
           
           return res.redirect("/posts/new?error=username_exists")
             }
             return res.redirect("/posts/new?error=db_error")
            }
             
            const imageQuery = 'INSERT INTO image (id,post_id,url) VALUES (?,?,?)';
             if(req.files?.images){
               req.files.images.forEach(file=>{
              
       
               const imageData = [
                 ImageId,
                 postID,
                req.files.images.map(f => "/uploads/" + f.filename)
        
               ];
               console.log("ewe",ImageId)
               console.log("io",postID)
               console.log("logo",imageData)
                pool.query(imageQuery,imageData);
              })
        
      }
    
             
    
            return res.redirect("/posts")
    })
   
    
    
  });

 


  app.get("/posts/new",(req,res)=>{
    res.render("new.ejs",{error:req.query.error})

  })
  
  //  See In Detail
  
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM posts WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

    
      if (!rows || rows.length === 0) {
        return res.status(404).send("Post not found");
      }

      const post = rows[0];

      pool.query("SELECT * FROM image WHERE post_id =?",[id],(err,rows)=>{
    
        let image = rows;


        try {
          post.images = Array.isArray(post.images)
            ? post.images
            : JSON.parse(post.images || "[]");
        } catch {
          post.images = [];
        }
        
        
        
        
        try {
          post.comments = Array.isArray(post.comments)
          ? post.comments
          : JSON.parse(post.comments || "[]");
        } catch {
          post.comments = [];
        }
        
        res.render("show.ejs", { post,image });
      })
    }
  );
});




  // EDIT route
  app.patch("/posts/:id",upload.fields([{name:"profilePic",maxCount:1},{name:"images",maxCount:10}]),(req,res)=>{
    let {id} = req.params; 
     
      let  newContent = req.body.content;
      pool.query("SELECT  * FROM posts WHERE id=?",[id],(err,posts)=>{
        if(err){
          console.log(err)
          return res.redirect("/posts")
        }
        let post = posts[0]
        post.content = newContent;
        let profilePic = post.profilePic
            profilePic = req.files?.profilePic?.length> 0 ? "/uploads/" + req.files.profilePic[0].filename:profilePic;

           

    
        let images = [];
        try{
          images = Array.isArray(post.images) ? post.images:JSON.parse(post.images || "[]")
        } catch{
          images = [];
        }
      
       
    

      pool.query('UPDATE posts SET profilePic=?, content =? WHERE id=?',[profilePic,newContent,id],err=>{
        if (err){
          console.log(err)
        }

         if(req.files.images){
    
      const imageQuery = ' INSERT INTO  image (id,post_id,url) VALUES (?,?,?)'
         const images = req.files.images
        
      console.log("imageeee",images)

         for(let i = 0;i<images.length;i++){
            let imageID = uuidv4()

           const filepath = "/uploads/" + images[i].filename;
           console.log(filepath,"filepath")
              const imageData = [
        imageID,
        id,
        filepath

      ]
           
           pool.query(imageQuery,imageData);
          }

      }


        console.log(post)

        res.redirect("/posts")
        
      })
    })
  })
  
  app.get("/posts/:id/edit",upload.fields([{name:"profilePic",maxCount:1},{name:"images",maxCount:10}]),(req,res) =>{
    let {id} = req.params;
    pool.query("select * from posts where id =?",[id],(err,posts)=>{
      if(err){
        console.log(err)
        return
      }
      let post =posts[0]
      pool.query('SELECT * FROM image where post_id = ?',[id],(err,images)=>{
        if(err){
          console.log(err)
        }
        
        res.render("edit.ejs",{post,images})
      })
    })
    
    
    
    
    
  });

  // Delete Route
  
  app.delete("/posts/:id",(req,res) =>{
    let {id} = req.params;
    pool.query("delete from posts where id = ?",[id],(err,posts)=>{
      if(err){
        console.log(err)
      }

       res.redirect("/posts")
    })
  })
  
  // Comment Route
 app.get("/posts/:id/comment",(req,res)=>{
    let {id} = req.params;

    pool.query("select * from posts where id=?",[id],(err,posts)=>{
      if(err){
        console.log(err)
      }
      let post = posts[0]
      pool.query("select * from image where post_id=?",[id],(err,image)=>{

       console.log("comments value:", post.comments);
 console.log("comments type:", typeof post.comments);
 
  

      res.render("comment.ejs",{post,image})
      })

    })
    
    
  })

 

//  DELETE PHOTO ONE BY ONE

app.get("/posts/:PostId/:ImageId",(req,res)=>{
  let {PostId,ImageId} = req.params;
  console.log(PostId)
  

  pool.query(`DELETE FROM image WHERE id = ?`,[ImageId],(err)=>{
    if(err){
      console.log(err)
    }
    res.redirect(`/posts/${PostId}`)


  })
})

  // Comment Route
app.post("/posts/:id/comment",(req,res)=>{
  let {id} = req.params;
  let {username,comment} = req.body;
  pool.query("select * from posts where id=?",[id],(err,posts)=>{
    let post = posts[0]
     let comments = JSON.stringify({username,text:comment})
    pool.query("UPDATE  posts  SET comments = JSON_ARRAY_APPEND(IFNULL(comments,'[]'),'$',CAST(? AS JSON)) WHERE id=?",[(comments),id],(err)=>{
      if(err){
        console.log(err)
      }
      res.redirect(`/posts/${id}/comment`)
    })

  })
  
});


app.get("/toggle-theme",(req,res)=>{
  const current = req.cookies.theme;
  const newTheme =  current=== "dark" ? "light":"dark"
  
  res.cookie("theme",newTheme,{httpOnly:false});
 const redirectTo=req.get("referer") || "/posts";
  res.redirect(redirectTo);


});
pool.query("select * from posts",(err,result)=>{
  if(result[0] === " "){

    insertDefaultPosts();
  }
})

pool.getConnection(err=>{
  if(err) {
    console.error("MYSQL pool failed:",err);
    return
  }
  console.log("MYSQL Connected")
   
   
 })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
