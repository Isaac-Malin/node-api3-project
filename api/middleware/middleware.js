const User = require('../users/users-model')
const Post = require('../posts/posts-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`You made a ${req.method} to ${req.url}`);
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await User.getById(req.params.id)
    if(!user) {
      res.status(404).json({
        message: `user with id ${req.params.id} not found`
      })
    } else {
      req.user = user
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: 'trouble finding user'
    })
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  try {
    const { name } = req.body
    if (!name) {
      res.status(400).json({
        message: 'missing required name field'
      })
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: 'server is having trouble right now'
    })
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  try {
    const { text } = req.body
    if(!text) {
      res.status(400).json({
        message: 'missing required text field'
      })
    } else {
      req.text = text
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: 'something went wrong'
    })
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}
