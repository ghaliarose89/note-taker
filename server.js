const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});

app.post('/api/notes', (req, res) => {
    
    fs.readFile('db/db.json', 'utf8', (err, data) => {

            const notes = JSON.parse(data);
            const newNote = {
                id: notes.length+1,
                title: req.body.title,
                text: req.body.text
            };
            console.log(`id=${newNote.id}`)
             notes.push(newNote);
        const newdata = JSON.stringify(notes,null,4);
        fs.writeFile ('db/db.json',newdata, err =>{
            if (err) throw err;
            res.json(newNote)
        });
       
    });

});
    app.delete ('/api/notes/:id' ,(req, res) => {
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            const notes = JSON.parse(data);
           const deletedNotes= notes.splice (req.params.id,1);
           console.log (req.params.id);
           console.log(`deletedNotes=${deletedNotes}`);
           const newdata = JSON.stringify(notes,null,4);
           console.log(`newdata${newdata}`);
           fs.writeFile ('db/db.json',newdata, err =>{
               if (err) throw err;
               res.json(deletedNotes);
           });

    } );
});


    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });


    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`);
    });