const mongoose = require('mongoose')
const Schema = mongoose.Schema;

    mongoose.connect('mongodb://localhost:27017/expenses', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected Yehey")
});

var expenseSchema = new Schema({
    item:{
        type: String,
        required: true,
        uppercase: true,
        unique: false
    },
    date:{
        type: Date, 
        default: Date.now
    },
    amount:{
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('expenseSchema', expenseSchema);