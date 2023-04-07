var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

let tickets = require('./data');

router.get("/list", function (req, res) {
    res.send(JSON.stringify(tickets));
});

router.get("/ticket/:id", function (req, res) {
    const ticketId = parseInt(req.params.id);
    const item = tickets.find(_item => _item.id === ticketId);

    item ? res.json(item) : res.json({ errorMessage: `ticket with id: ${ticketId} does not exist` });
});

router.get("/", function (req, res) {
    res.sendFile(__dirname + `/form.html`);
});

router.post("/ticket", function (req, res) {
    let data = req.body;
    data.id = parseInt(data.id);
    data.assigneeId = parseInt(data.assigneeId);

    tickets.push(data);
    res.send(data);
});

module.exports = router;