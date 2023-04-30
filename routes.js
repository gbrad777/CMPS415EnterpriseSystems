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

            res.send(allTickets).status(200);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

router.get("/ticket/:TicketId", function (req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            const query = { TicketId: parseInt(req.params.TicketId) };
            const ticket = await tickets.findOne(query);

            ticket ? res.send(JSON.stringify(ticket)) : res.json({ errorMessage: `ticket with id: ${parseInt(req.params.TicketId)} does not exist` });
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
    data.TicketId = parseInt(data.TicketId);
    data.AssigneeId = parseInt(data.AssigneeId);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            await tickets.insertOne(data);
            res.send(data).status(201);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

router.post("/ticket/updateTicket", function (req, res) {
    const client = new MongoClient(uri);

    let data = req.body;
    data.TicketId = parseInt(data.TicketId);
    data.AssigneeId = parseInt(data.AssigneeId);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            const updatedTicket = {
                TicketId: req.body.TicketId,
                Type: req.body.Type,
                Subject: req.body.Subject,
                Description: req.body.Description,
                Priority: req.body.Priority,
                Status: req.body.Status,
                Recipient: req.body.Recipient,
                Submitter: req.body.Submitter,
                AssigneeId: req.body.AssigneeId,
            };

            const updateTicket = await tickets.findOneAndUpdate({ TicketId: req.body.TicketId }, { $set: updatedTicket });

            if (!updateTicket) {
                res.status(404).send("Ticket not found.");
            } else {
                res.send(updatedTicket).status(200);
            }
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

router.post("/ticket/deleteTicket", function (req, res) {
    const client = new MongoClient(uri);

    let data = req.body;
    data.TicketId = parseInt(data.TicketId);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            console.log(req.params.TicketId);

            const deleteTicket = await tickets.findOneAndDelete({ TicketId: req.body.TicketId });

            if (!deleteTicket) {
                res.status(404).send("Ticket does not exist");
            } else {
                console.log(deleteTicket);
                res.status(200).send("Ticket deleted!");
            }
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

module.exports = router;