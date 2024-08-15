import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);
  const [predictedData, setPredictedData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:5000/upload', formData)
      .then((response) => {
        console.log(response.data);
        setPredictions(response.data.predictions);
        setDownloadLink(response.data.downloadLink);
        setPredictedData(response.data.predictedData);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const handleDownload = () => {
    if (downloadLink) {
      window.open(`http://localhost:5000${downloadLink}`, '_blank');
    }
  };
  

  return (
    <div className="App">
      <div className="app-container">
        <h1>Improves Security Operations </h1>
        <input type="file" onChange={handleFileChange} />
        <br />
        <button onClick={handleUpload}>Predict</button>
        <br />

        {predictions.length > 0 && (
          <div>
            <h2>Some Predictions:</h2>
            <ul>
              {predictions.slice(0, 5).map((prediction, index) => (
                <li key={index}>{prediction}</li>
              ))}
            </ul>
          </div>
        )}

        {predictedData.length > 0 && (
          <div>
            <h2>First 5 Columns of Predicted Data:</h2>
            <table>
              <thead>
                <tr>
                  {Object.keys(predictedData[0]).slice(0, 5).map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictedData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).slice(0, 5).map((value, columnIndex) => (
                      <td key={columnIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {downloadLink && (
          <div>
            <button onClick={handleDownload}>Download Predictions</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
