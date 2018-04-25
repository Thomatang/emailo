const mongoose = require('mongoose');
const {Schema} = mongoose; // ===  const Schema = mongoose.Schema;

const userSchema = new Schema({ // here , we can freely add or subtract properties as we please
    googleId: String
});

mongoose.model('users', userSchema);// create new collection called users