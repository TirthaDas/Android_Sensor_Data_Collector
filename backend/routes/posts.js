const express= require("express");
const routes = express.Router();
const postController= require('../controllers/postController')
// routes
routes.post("/api/posts",postController.createPost); 
routes.put('/api/posts/:id',postController.updatePost);
routes.get('/api/posts',postController.getAllPosts);
routes.get('/api/posts/:id',postController.getPostById)
routes.delete('/api/posts/:id',postController.deletePost);


  module.exports=routes;

