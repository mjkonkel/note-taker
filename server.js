const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// POST request for reading and updating json file with new notes
app.post('/api/notes', (req, res) => {
    console.log(`${req.method} received`)

    const newNote = {
        note_id: uuid(),
        title: req.body.title,
        text: req.body.text,
    };

    // reading json file and writing new notes to the file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);
            // console.log(parsedNotes)

            parsedNotes.push(newNote);
            // console.log(parsedNotes)


            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Success, note added')
            )
        }
    });

});

// GET request for posting the notes in the json file to the page
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


// additional URLs will route to the homepage
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);