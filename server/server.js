const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { PythonShell } = require('python-shell');

const app = express();
const port = 5000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    console.log('File received:', req.file);

    // Save the uploaded CSV file
    const fileName = 'F:/sulaim project/enhancewebsite/sulaims/server/check.csv';
    fs.writeFileSync(fileName, req.file.buffer);

    console.log('File saved:', fileName);

    // Execute Python script to perform predictions
    const options = {
      scriptPath: __dirname,
      args: [fileName],
    };

    PythonShell.run('predict.py', options, (err, results) => {
      if (err) {
        console.error('Error executing Python script:', err);
        throw err;
      }

      console.log('Python script executed successfully.');

      const predictions = results.map(parseFloat);

      // Save the predictions to a new CSV file
      const predictionsFileName = 'predictions_check.csv';
      const predictionsData = req.file.buffer.toString() + '\n' + predictions.join('\n');
      fs.writeFileSync(predictionsFileName, predictionsData);

      console.log('Predictions saved:', predictionsFileName);

      res.json({
        success: true,
        predictions: predictions,
        downloadLink: `${req.protocol}://${req.get('host')}/download/${predictionsFileName}`,
      });
    });
  } catch (error) {
    console.error('Error handling file upload:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/download/:fileName', (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = `${__dirname}/${fileName}`;

    res.download(filePath, fileName);
  } catch (error) {
    console.error('Error handling file download:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
