const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const upload = multer({ dest: 'uploads/' });
var cors = require('cors');
app.use(cors())


app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = xlsx.readFile(path.join(__dirname, req.file.path));
    const sheetName = file.SheetNames[0];
    const sheet = file.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

   

    res.json(data);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
