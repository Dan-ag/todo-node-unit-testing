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

const updateTodo = async (req, res, next) => {
  try {

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      {
        new: true,
        useFindAndModify: false
      }
    );
    if (!updatedTodo) {
      return res.status(404).send();
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
}

const deleteTodo = async (req, res, next) => {
  try {
    const deleteTodo = await TodoModel.findByIdAndDelete(req.params.todoId);

    if (!deleteTodo) {
      return res.status(404).send();
    }

    res.status(200).json(deleteTodo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTodoById,
  updateTodo,
  deleteTodo,
  createTodo,
  getTodos,
};