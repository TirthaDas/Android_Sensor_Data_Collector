const express= require("express");
const routes = express.Router();
const postController= require('../controllers/postController')
const checkAuth=require('../middleware/check-auth')

// routes
routes.post("/api/posts",checkAuth,postController.createPost); 
routes.put('/api/posts/:id',checkAuth,postController.updatePost);
routes.get('/api/posts',postController.getAllPosts);
routes.get('/api/posts/:id',postController.getPostById)
routes.delete('/api/posts/:id',checkAuth,postController.deletePost);


  module.exports=routes;

