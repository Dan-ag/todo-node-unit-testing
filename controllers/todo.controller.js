const TodoModel = require('../model/todo.model');



const createTodo = async (req, res, next) => {

  try {
    const createModel = await TodoModel.create(req.body);
    res.status(201).json(createModel);
  } catch (error) {
    next(error);
  }
};


const getTodos = async (req, res, next) => {

  try {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {

  try {
    const todo = await TodoModel.findById(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ message: 'todo dont found' });
    }

    res.status(200).json(todo);

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getTodoById,
  createTodo,
  getTodos,
};