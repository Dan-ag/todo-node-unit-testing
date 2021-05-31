const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();


let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

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
