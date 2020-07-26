const mongoose = require('mongoose')

const mongoyrl = process.env.MOGO_DEV_URL;
const db = mongoose
  .connect(`mongodb://localhost:27017/bloodDonar`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db ");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;