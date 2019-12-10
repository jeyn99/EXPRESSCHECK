var bodyParser = require("body-parser");
var app = require('express')();
var express = require('express');
var http = require("http").Server(app)
var port = process.env.PORT || 5000;
var cors = require('cors');
var expense = require("./model/expenses.js");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(cors())

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static("public"));

app.post('/item/create', function (req, res) {
    console.log("CREATE")
    var items = new expense(req.body)
    items.save()
        .then(doc => {
            res.send(doc)
            console.log("NASAVE")
        })
        .catch(err => {
            res.send(err.message)
        })
})

app.get('/item/retrieve/all', function (req, res) {
    console.log("All")
    expense.find()
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            res.send(err.message)
        })
})

app.get('/item/retrieve/:id', function (req, res) {
    console.log("Here is the ID: " + req.params.id)
    expense.findOne({ _id: req.params.id })
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            res.send(err.message)
        })
})

app.put('/item/update/', function (req, res) {
    console.log(req.body)
    expense.findByIdAndUpdate(req.body._id, { item: req.body.item, date: req.body.date, amount: req.body.amount }, {
        new: true,
        upsert: true
    })
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            res.send(err.message)
        })
})

app.delete('/item/delete/:id', function (req, res) {
    console.log(req.params.id)
    expense.findByIdAndRemove(req.params.id)
        .then(doc => {
            console.log("Nadelete na")
            res.send(doc)
        })
        .catch(err => {
            res.send(err.message)
        })
})

app.delete('/delete/all', function (req, res) {
    console.log("Delete Collection!")
    expense.remove({})
        .then(() => {
            res.json({ result: "Successfully Deleted All" })
        })
        .catch(err => {
            res.send({ err: err.message })

        })
})

http.listen(port, function () {
    console.log('listening on *:' + port);
});