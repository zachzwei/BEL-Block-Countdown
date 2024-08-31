const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const rpcUrl = 'http://213.199.44.225:19918';
const rpcUser = 'z4ch';
const rpcPassword = '--------';

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
      <div style="text-align: center; padding-top: 20px;">
        <img src="bellscoin-logo.png" alt="Bellscoin Logo" style="width: 150px; height: auto; margin-bottom: 20px;"/>
        <h1>Bellscoin Upcoming Milestones</h1>
        <p style="font-size: 1.5em; font-weight: bold; color: #FF4500;">Current Block Height: ${currentBlockHeight}</p>
    `;

    targets.forEach(target => {
      const blocksRemaining = target.targetBlockHeight - currentBlockHeight;

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
          <p style="color: ${target.color};">Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds</p>
          <p style="color: ${target.color};">Estimated activation date: ${endDateString}</p>
        `;
      }
    });

    output += `
      <div style="margin-top: 20px;">
        <p style="font-size: 1.2em;">Created by: <a href="https://x.com/ZachZwei" target="_blank" style="color: #1E90FF;">z4ch</a></p>
      </div>
      </div>
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
