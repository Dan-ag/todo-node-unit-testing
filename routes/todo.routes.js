const express = require('express');
const todoController = require('../controllers/todo.controller');
const router = express.Router();


router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.get('/:todoId', todoController.getTodoById);
router.put('/:todoId', todoController.updateTodo);

module.exports = router;