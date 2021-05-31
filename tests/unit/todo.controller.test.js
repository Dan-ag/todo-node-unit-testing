const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

jest.mock('../../model/todo.model');

let todoId = '60b4566359f0c624b586481a';

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TodoController.deleteTodo', () => {
  it('Should have a deleteTodo function', () => {
    expect(typeof TodoController.deleteTodo).toBe('function');
  });
  it('Should call TodoModel.findByIdAndDelete with parameters', async () => {
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    TodoModel.findByIdAndDelete(todoId);
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
  });
  it('Should return json body and response code 200', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('Shoulds handle errors in deleteTodo', async () => {
    const errorMessage = { message: 'Error deleting todo' };
    const rejetedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejetedPromise);

    await TodoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('Shoulds handle 404 deleteTodo', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
})


describe('TodoController.updateTodo', () => {
  it('Should have a updatedTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function');
  });
  it('Should call TodoModel.updateTodo with parameters', async () => {
    req.params.todoId = todoId;
    await TodoController.updateTodo(req, res, next);
    TodoModel.findByIdAndUpdate(todoId, newTodo, {
      new: true,
      useFindAndModify: false
    });
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false
    });
  });
  it('Should return json body and response code 200', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;

    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('Shoulds handle errors in updateTodo', async () => {
    const errorMessage = { message: 'Error updated by id' };
    const rejetedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejetedPromise);

    await TodoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('Shoulds handle 404', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
})

describe('TodoController.getTodoById', () => {
  it('Should have a getTodoById', () => {
    expect(typeof TodoController.getTodoById).toBe('function');
  });
  it('Should call TodoModel.findById with parameters', async () => {
    req.params.todoId = '60b4566359f0c624b586481a';
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith('60b4566359f0c624b586481a');
  });
  it('Should return json body and response code 200', async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('Shoulds handle errors in getTodoByIs', async () => {
    const errorMessage = { message: 'Error finding by id' };
    const rejetedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejetedPromise);

    await TodoController.getTodoById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('Shoulds return 404 when item doesnt exist', async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();

  });
})

describe('TodoController.getTodos', () => {
  //getTodos
  it('Should have a getTodos funtion', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });
  it('Should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toBeCalledWith({});
  });
  it('Should return 200 response code and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });
  it('Shoulds handle errors in getTodos', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejetedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejetedPromise);

    await TodoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TodoController.createTodo', () => {

  beforeEach(() => {
    req.body = newTodo;
  });

  it('Should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('Should call TodoModel.create', () => {
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
  it('Should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('Should return json body in response', async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('Shoulds handle errors in createTodo', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejetedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejetedPromise);

    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
