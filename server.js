const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const rpcUrl = 'http://213.199.44.225:19918';
const rpcUser = 'z4ch';
const rpcPassword = 'bell3000';

// Serve static files (like the logo) from the current directory
app.use(express.static(path.join(__dirname)));

// Define an array of target block heights and their descriptions
const targets = [
  { name: 'Taproot Activation', targetBlockHeight: 188000, color: '#1E90FF' },  // DodgerBlue
  { name: 'Epoch 4', targetBlockHeight: 259201, color: '#32CD32' },             // LimeGreen
  { name: 'Epoch 5', targetBlockHeight: 518401, color: '#FF6347' }              // Tomato
];

app.get('/blockcountdown', async (req, res) => {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${rpcUser}:${rpcPassword}`).toString('base64'),
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'curltest',
        method: 'getblockcount',
        params: []
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.result) {
      throw new Error('Block height not found in response');
    }

    const currentBlockHeight = data.result;

    let output = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding-top: 20px;
            transition: background-color 0.5s, color 0.5s;
          }
          .dark-mode {
            background-color: #121212;
            color: #ffffff;
          }
          .toggle-button {
            cursor: pointer;
            background-color: #1E90FF;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            font-size: 1em;
            position: fixed;
            top: 20px;
            right: 20px;
            transition: background-color 0.5s, color 0.5s;
          }
          .toggle-button:hover {
            background-color: #555;
          }
          .progress-bar-container {
            background-color: #f3f3f3;
            border-radius: 10px;
            margin: 10px auto;
            width: 30%; /* Smaller width for the progress bar */
            height: 10px; /* Smaller height for the progress bar */
            display: inline-block;
          }
          .progress-bar {
            height: 100%;
            border-radius: 10px;
            transition: width 0.5s;
          }
          .dark-mode .progress-bar-container {
            background-color: #333;
          }
        </style>
      </head>
      <body>
        <button class="toggle-button" onclick="toggleDarkMode()">🌙</button>
        <img src="bellscoin-logo.png" alt="Bellscoin Logo" style="width: 150px; height: auto; margin-bottom: 20px;"/>
        <h1>Bellscoin Upcoming Milestones</h1>
        <p style="font-size: 1.5em; font-weight: bold; color: #FF4500;">Current Block Height: ${currentBlockHeight}</p>
    `;

    targets.forEach(target => {
      const blocksRemaining = target.targetBlockHeight - currentBlockHeight;
      const progressPercentage = Math.min((currentBlockHeight / target.targetBlockHeight) * 100, 100);

      let progressBar = `
        <div class="progress-bar-container">
          <div class="progress-bar" style="background-color: ${target.color}; width: ${progressPercentage}%;"></div>
        </div>
      `;

      if (blocksRemaining <= 0) {
        output += `<h2 style="color: ${target.color};">${target.name}</h2><p>The target block height has been reached!</p>`;
      } else {
        const estimatedTimeRemaining = blocksRemaining * 60; // Assuming average block time is 60 seconds

        const days = Math.floor(estimatedTimeRemaining / (60 * 60 * 24));
        const hours = Math.floor((estimatedTimeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((estimatedTimeRemaining % (60 * 60)) / 60);
        const seconds = estimatedTimeRemaining % 60;

        const estimatedEndDate = new Date();
        estimatedEndDate.setSeconds(estimatedEndDate.getSeconds() + estimatedTimeRemaining);
        const endDateString = estimatedEndDate.toLocaleString(); // Localized date and time format

        output += `
          <h2 style="color: ${target.color};">${target.name}</h2>
          <p><strong style="color: ${target.color};">Target Block Height:</strong> ${target.targetBlockHeight}</p>
          <p><strong style="color: ${target.color};">Blocks Remaining:</strong> ${blocksRemaining}</p>
          ${progressBar}
          <p style="color: ${target.color};">Time remaining: ${days} days, ${hours} hours, ${minutes} seconds</p>
          <p style="color: ${target.color};">Estimated activation date: ${endDateString}</p>
        `;
      }
    });

    output += `
        <div style="margin-top: 20px;">
          <p style="font-size: 1.2em;">Created by: <a href="https://x.com/ZachZwei" target="_blank" style="color: #1E90FF;">z4ch</a></p>
        </div>
        <script>
          function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
          }
        </script>
      </body>
      </html>
    `;

    res.send(output); // This sends the countdown as HTML
  } catch (error) {
    console.error('Error fetching block height:', error);
    res.status(500).send('Error loading block height.');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
