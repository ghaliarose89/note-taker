const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const data = JSON.stringify(newNote);
    fs.writeFile ('Develop/db/db.json',data,err =>{
        if (err) throw err;
    });
    
    
});




    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './Develop/public/index.html'));
    });


    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`);
    })