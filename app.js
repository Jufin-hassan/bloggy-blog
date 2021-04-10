

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");//its a modern js utility library [npm i --save lodash]
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});


const blogSchema = mongoose.Schema({
  name : String,
  post : String
});


//Model
const Blog = mongoose.model("Blog",blogSchema);



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// const startingContent = new Blog({
//   name : "homeIndexContent",
//   post : homeStartingContent
// })
//startingContent.save();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let posts = []; //Global container for posts
let title = "";

app.get("/", (req,res) => {
  // res.render('home',{content:homeStartingContent,postsContent:posts});

  Blog.find({},{name:1,post:1,_id : 1},(err,found) => {
    if(!err){
      //console.log(found);
      res.render('home',{content:homeStartingContent,postsContent:found});

    }
  })
  
});


app.get("/about",(req,res) => {
  res.render('about',{aboutContent:aboutContent});
});

app.get("/contact", (req,res) => {
  res.render('contact',{contactContent:contactContent});
});

app.get("/compose",(req,res) => {
  res.render('compose',{composeContent:""});
});

app.get("/post/:id",(req,res) => {
  const postId = req.params.id;
  //console.log(postId);

  //THIS IS ALSO WORKING JUS RENDER THE PAGE IN THE ELSE PART
  // Blog.findOne({_id : postId}, (err,found) => {
  //   if(err)
  //     console.log(err);
  //   else
  //     console.log(found);
  // })

  Blog.findById(postId,(err,found) => {
    // console.log(found);
    res.render('post',{post:found});
  })


  // let id = _.lowerCase(req.params.id);//it converts the kebab case,snake case  into lowercase 
  // posts.forEach(post => {
  //   title = _.lowerCase(post.postTitle)
  //   if (id == title) {
  //     res.render('post',{post:post});
  //   }
  // });
})

app.post("/",(req,res) =>{
  // var post = {
  //   postTitle : req.body.postTitle,
  //   postBody : req.body.postBody
  // }

  const composePost = new Blog({
    name : req.body.postTitle,
    post : req.body.postBody
  });
  composePost.save();
  res.redirect("/");
 

  // posts.push(post);
  // res.redirect("/");
  
});

app.post("/delete", (req,res) => {
  const deleteId =  req.body.postId;
  console.log(deleteId);
  Blog.findByIdAndRemove(deleteId,(err) => {
    if(err)
      console.log(err);
    else
      console.log("Deleted!");
  })
  res.redirect("/");
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
