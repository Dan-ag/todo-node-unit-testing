const request = require('supertest');
const { resource } = require('../../app');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

const endpointUrl = '/todos/';

let firstTodo, newTodoId;

describe(endpointUrl, () => {

  it(`GET${ endpointUrl }`, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[ 0 ].title).toBeDefined();
    expect(response.body[ 0 ].done).toBeDefined();
    firstTodo = response.body[ 0 ];
  });
  it(`GET by id ${ endpointUrl }:todoId`, async () => {
    const response = await request(app).get(`${ endpointUrl }${ firstTodo._id }`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  it(`GET by id dont exist`, async () => {
    const response = await request(app).get(`${ endpointUrl }${ '60b4566359f0c624b5864811' }`);

    expect(response.statusCode).toBe(404);
  });
  it(`POST${ endpointUrl }`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });
  it(
    `Should return error 500 on malformed data with POST ${ endpointUrl }`
    , async () => {
      const res = await request(app)
        .post(endpointUrl)
        .send({ title: 'Missing done property' });
      expect(res.statusCode).toBe(500);
      expect(res.body).toStrictEqual({
        message: 'Todo validation failed: done: Path `done` is required.'
      });
    });
  it(`PUT ${ endpointUrl }`, async () => {
    const testTodo = { title: "Make integration test for PUT", done: true };
    const res = await request(app).put(endpointUrl + newTodoId).send(testTodo);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testTodo.title);
    expect(res.body.done).toBe(testTodo.done);
  })
});
