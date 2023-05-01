var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
var js2xmlparser = require('js2xmlparser');
const xmlparser = require('express-xml-bodyparser');


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
            return ticket;
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

router.get("/xml/ticket/:TicketId", function (req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            const query = { TicketId: parseInt(req.params.TicketId) };
            const ticket = await tickets.findOne(query);

            var obj = adaptJsonToXml(ticket);

            var xml = js2xmlparser.parse("Ticket", obj);
            console.log(xml);

            ticket ? res.contentType('application/xml').send(xml).status(200) : res.send({ errorMessage: `ticket with id: ${parseInt(req.params.TicketId)} does not exist` });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
})

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

router.put("/xml/ticket/:TicketId", xmlparser({ trim: false, explicitArray: false, normalizeTags: false, explicitRoot: true }), function (req, res) {
    const client = new MongoClient(uri);

    let xmlData = req.body;
    console.log(xmlData);

    var updatedTicket = adaptXmlToJson(xmlData);
    console.log(updatedTicket);

    async function run() {
        try {
            const database = client.db('CMPS415-TicketingSystem');
            const tickets = database.collection('HelpDeskTickets');

            const updateTicket = await tickets.findOneAndUpdate({ TicketId: updatedTicket.TicketId }, { $set: updatedTicket });

            if (!updateTicket) {
                res.status(404).send("Ticket not found.");
            } else {
                res.send(updateTicket).status(200);
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

function adaptXmlToJson(body) {
    return ticket = {
        TicketId: parseInt(body.Ticket.TicketId),
        Type: body.Ticket.Type,
        Subject: body.Ticket.Subject,
        Description: body.Ticket.Description,
        Priority: body.Ticket.Priority,
        Status: body.Ticket.Status,
        Recipient: body.Ticket.Recipient,
        Submitter: body.Ticket.Submitter,
        AssigneeId: parseInt(body.Ticket.AssigneeId),
    }
};

function adaptJsonToXml(json) {
    return xmlTicket = {
        TicketId: json.TicketId,
        Type: json.Type,
        Subject: json.Subject,
        Description: json.Description,
        Priority: json.Priority,
        Status: json.Status,
        Recipient: json.Recipient,
        Submitter: json.Submitter,
        AssigneeId: json.AssigneeId,
    }
};

module.exports = router;