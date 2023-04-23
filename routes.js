var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://GBradford01:MwLs0Tqbe3hJiU2u@cmps415.5s9ks7f.mongodb.net/?retryWrites=true&w=majority";

router.get("/list", function (req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            let allTickets = await tickets.find({}).toArray();

            res.send(allTickets);
        } finally {
            await client.close();
        }
    }

    run();
});

router.get("/ticket/:Id", function (req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            const query = { Id: parseInt(req.params.Id) };
            const ticket = await tickets.findOne(query);

            ticket ? res.send(JSON.stringify(ticket)) : res.json({ errorMessage: `ticket with id: ${parseInt(req.params.Id)} does not exist` });
        } finally {

            await client.close();
        }
    }

    run().catch(console.dir);
});

router.get("/create", function (req, res) {
    res.sendFile(__dirname + `/create-form.html`);
});

router.get("/update", function (req, res) {
    res.sendFile(__dirname + `/update-form.html`);
});

router.get("/delete", function (req, res) {
    res.sendFile(__dirname + `/delete-form.html`);
});

router.post("/ticket", function (req, res) {
    const client = new MongoClient(uri);

    let data = req.body;
    data.Id = parseInt(data.Id);
    data.AssigneeId = parseInt(data.AssigneeId);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            await tickets.insertOne(data);
        } finally {

            await client.close();
        }
    }

    run();
    res.send(data).statusCode(201);
});

router.put("/ticket/:Id", function (req, res) {
    const client = new MongoClient(uri);

    let data = req.body;
    data.Id = parseInt(data.Id);
    data.AssigneeId = parseInt(data.AssigneeId);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');
            var query = { Id: req.params.Id };
            var updatedValues = {
                $set: {
                    Type: req.params.Type,
                    Subject: req.params.Subject,
                    Priority: req.params.Priority,
                    Status: req.params.Status,
                    Recipient: req.params.Recipient,
                    Submitter: req.params.Submitter,
                    AssigneeId: req.params.AssigneeId,
                }
            };

            await tickets.updateOne(query, updatedValues);
        } finally {
            await client.close();
        }
    }

    run();
});

router.delete("/ticket/:Id", function (req, res) {
    const client = new MongoClient(uri);

    let data = req.body;
    data.Id = parseInt(data.Id);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            await tickets.deleteOne({ Id: req.params.Id });
        } finally {
            await client.close();
        }
    }

    run();
});

module.exports = router;