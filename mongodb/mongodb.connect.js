const mongoose = require('mongoose');

const DB_NAME = 'nestjs-course';

async function connect() {
  try {

    await mongoose.connect(
      `mongodb+srv://nestj-admin:nestj-admin..@cluster0.dglhv.mongodb.net/${ DB_NAME }?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    );

  } catch (error) {
    console.error('Error connecting to mongodb', err);
  }
}

module.exports = {
  connect,
};