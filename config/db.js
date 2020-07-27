const mongoose = require('mongoose')


const db = mongoose
  //mongodb+srv://ramsai:14211@0591@cluster0.hjpoy.mongodb.net/blood-web?retryWrites=true&w=majority
  //mongodb://localhost:27017/bloodDonar
  .connect(`mongodb+srv://ramsai:14211@0591@cluster0.hjpoy.mongodb.net/blood-web?retryWrites=true&w=majority`, {
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