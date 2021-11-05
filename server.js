const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
//dependientes
const PORT = process.env.PORT || 3001;
//npm uniq id
const { v1: uuidv1 } = require('uuid');
//middleware>>>
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());


//index route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// notes route
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});
// adding notes api
app.post('/api/notes', (req, res) => {

    fs.readFile('db/db.json', 'utf8', (err, data) => {

        const notes = JSON.parse(data);
        const newNote = {
            id: uuidv1(notes.length + 1),
            title: req.body.title,
            text: req.body.text
        };

        notes.push(newNote);
        const newdata = JSON.stringify(notes, null, 4);
        fs.writeFile('db/db.json', newdata, err => {
            if (err) throw err;
            res.json(newNote)
        });

    });

});

//deleting api
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        const notes = JSON.parse(data);
        const deletedNotes = notes.filter(notes => notes.id !== req.params.id);
        const newdata = JSON.stringify(deletedNotes, null, 4);
        fs.writeFile('db/db.json', newdata, err => {
            if (err) throw err;
            res.json(notes);
        });

    });
});

// index route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//listning port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});