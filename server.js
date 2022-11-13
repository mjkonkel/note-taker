const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3001;
const notes = require('./db/db.json')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} received`)

// const { text, title } = req.body
// console.log(req.body)

const newNote = {
    note_id: uuid(),
    title: req.body.title,
    text: req.body.text,
};

fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        const parsedNotes = JSON.parse(data);
        console.log(parsedNotes)

        parsedNotes.push(newNote);
        console.log(parsedNotes)


        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes),
            (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Success')
        )
    }
});

});

app.get('/api/notes', (req, res) => {
    console.log(`${req.method} request received`);
    return fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.send(data)
            console.log('Success')
        }
    });
});



app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);