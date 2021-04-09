// This is the file that will handle all the connections from the app to MongoDB //
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/rateusApp', { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
    console.log("Connected to MongoDB successfully");
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB!");
    console.log(e);
})

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
};
