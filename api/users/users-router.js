const express = require('express');
const {validateUserId, validateUser, validatePost} = require('../middleware/middleware')
const posts = require("../posts/posts-model")
const users = require("./users-model")

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(404).json({ 
        message: "users cannot be found!",
        error: err.message
      })
    }) 
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  users.getById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      next(err)
    })
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  users.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      next(err)
    })
});

router.put('/:id', [validateUserId, validateUser], (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  users.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      next(err)
    })
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await users.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const post = await users.getUserPosts(req.params.id)
    res.status(200).json(post)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', [validateUserId, validatePost], async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const newPost = await posts.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.status(201).json(newPost)
  } catch (err) {
    next(err)
  }
});

// do not forget to export the router
module.exports = router
