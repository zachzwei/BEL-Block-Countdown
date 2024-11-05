const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const moment = require('moment-timezone'); // Import moment-timezone
const app = express();

const rpcUrl = 'http://213.199.44.225:19918';
const rpcUser = 'bells';
const rpcPassword = 'coin';

// Serve static files (like the logo) from the current directory
app.use('/bellcountdown', express.static(path.join('/var/www/')));

// Define an array of target block heights and their descriptions
const targets = [
  { name: 'Taproot Activation', targetBlockHeight: 188000, color: '#1E90FF' },  // DodgerBlue
  { name: 'Epoch 4 (90% Block Reward Reduction)', targetBlockHeight: 259200, color: '#32CD32' },             // LimeGreen
  { name: 'Runes Activation', targetBlockHeight: 350000, color: '#FFD700' }, // Gold
  { name: 'Epoch 5 (Final Block Reward Reduction)', targetBlockHeight: 518400, color: '#FF6347' }              // Tomato
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
        <link rel="icon" href="/bellcountdown/favicon.ico" type="image/x-icon">
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
            width: 30%;
            height: 10px;
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
          .refresh-message {
            margin-top: 10px;
            font-size: 1em;
            color: #FF4500;
          }
          .small {
            font-size: 0.8em; /* Smaller font size for date and time */
          }
          .medium {
            font-size: 1.2em; /* Bigger font size for time remaining */
          }
        </style>
      </head>
      <body>
        <button class="toggle-button" onclick="toggleDarkMode()">&#9790;</button> <!-- HTML entity for moon symbol -->
        <img src="/bellcountdown/bellscoin-logo.png" alt="Bellscoin Logo" style="width: 150px; height: auto; margin-bottom: 20px; cursor: pointer;" onclick="refreshPage()"/>
        <p class="refresh-message">Hit the Bell to Refresh</p>
        <h1>Bellscoin Upcoming Milestones</h1>
        <p style="font-size: 1.5em; font-weight: bold; color: #FF4500;">Current Block Height: ${currentBlockHeight}</p>
    `;

    const reachedMilestones = []; // Array to hold reached milestones
    const upcomingMilestones = []; // Array to hold upcoming milestones

    targets.forEach(target => {
      const blocksRemaining = target.targetBlockHeight - currentBlockHeight;
      const progressPercentage = Math.min((currentBlockHeight / target.targetBlockHeight) * 100, 100);

      let progressBar = `
        <div class="progress-bar-container">
          <div class="progress-bar" style="background-color: ${target.color}; width: ${progressPercentage}%;"></div>
        </div>
      `;

      if (blocksRemaining <= 0) {
        const blocksReachedAgo = currentBlockHeight - target.targetBlockHeight;
        const secondsAgo = blocksReachedAgo * 60; // Assuming average block time is 60 seconds
        const blockReachedDate = moment().subtract(secondsAgo, 'seconds');

        // Format the date in different timezones
        const reachedDateStringUTC = blockReachedDate.tz('UTC').format('YYYY-MM-DD HH:mm:ss');
        const reachedDateStringCET = blockReachedDate.tz('CET').format('YYYY-MM-DD HH:mm:ss');
        const reachedDateStringSGT = blockReachedDate.tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
        const reachedDateStringEST = blockReachedDate.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

        reachedMilestones.push(`
          <h2 style="color: ${target.color};">${target.name}</h2>
          <p class="small">The target block height was reached on:</p>
          <p class="small" style="color: ${target.color};"><strong>UTC: ${reachedDateStringUTC}</strong></p>
          <p class="small" style="color: ${target.color};"><strong>CET: ${reachedDateStringCET}</strong></p>
          <p class="small" style="color: ${target.color};"><strong>SGT: ${reachedDateStringSGT}</strong></p>
          <p class="small" style="color: ${target.color};"><strong>EST: ${reachedDateStringEST}</strong></p>
        `);
      } else {
        const estimatedTimeRemaining = blocksRemaining * 60; // Assuming average block time is 60 seconds

        const days = Math.floor(estimatedTimeRemaining / (60 * 60 * 24));
        const hours = Math.floor((estimatedTimeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((estimatedTimeRemaining % (60 * 60)) / 60);

        const estimatedEndDate = moment().add(estimatedTimeRemaining, 'seconds');

        // Format the estimated end date in different timezones
        const endDateStringUTC = estimatedEndDate.tz('UTC').format('YYYY-MM-DD HH:mm:ss');
        const endDateStringCET = estimatedEndDate.tz('CET').format('YYYY-MM-DD HH:mm:ss');
        const endDateStringSGT = estimatedEndDate.tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
        const endDateStringEST = estimatedEndDate.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

        upcomingMilestones.push(`
          <h2 style="color: ${target.color};">${target.name}</h2>
          <p><strong style="color: ${target.color};">Target Block Height:</strong> ${target.targetBlockHeight}</p>
          <p><strong style="color: ${target.color};">Blocks Remaining:</strong> ${blocksRemaining}</p>
          ${progressBar}
          <p style="color: ${target.color};" class="medium">Time remaining: ${days} days, ${hours} hours, ${minutes} minutes</p>
          <p style="color: ${target.color};" class="small">Estimated activation date and time:</p>
          <p class="small" style="color: ${target.color};"><strong>UTC: ${endDateStringUTC}</strong></p>
          <p class="small" style="color: ${target.color};"><strong>CET: ${endDateStringCET}</strong></p>
          <p class="small" style="color: ${target.color};"><strong>SGT: ${endDateStringSGT}</strong></p>
          <p class="small" style="color: ${target.color};"><strong>EST: ${endDateStringEST}</strong></p>
        `);
      }
    });

    // Append upcoming milestones first, then reached milestones
    output += upcomingMilestones.join('') + reachedMilestones.join('');

    output += `
        <div style="text-align: center; margin-top: 40px; padding: 10px; border-top: 1px solid #ccc;">
          <p>The Epoch 4 and Epoch 5 on Bellscoin represent the reduction of block rewards. There will be a 90% reduction at the start of Epoch 4 and a final reduction on Epoch 5 where the block rewards will go down to only 2 $BEL per minute.</p>
          <p>The op_cat activation on mainnet will be via softfork mechanism, will be enabled in the BellscoinV3 RC3. </p>
        </div>
        <div style="text-align: center; margin-top: 40px; padding: 10px; border-top: 1px solid #ccc;">
          <p>Support Nintondo Devs. Send your $BELLS to the addresses below:</p>
          <p>Send $BEL: <span id="bel-address"><a href="https://nintondo.io/explorer/address/bel1qs0k3zuv7achxquxhs3rqjjc93tc3hc6dfmnv2z" target="_blank" style="color: #1E90FF;">bel1qs0k3zuv7achxquxhs3rqjjc93tc3hc6dfmnv2z</a></span> <button class="copy-button" onclick="copyToClipboard('bel-address')">Copy</button></p>
          <p>Bellscoin received will go towards funding maintenance and development of ord, as well as hosting costs for <a href="https://ord.nintondo.io/" target="_blank" style="color: #1E90FF;">Bellscoin Ordinals</a>.</p>
          <p>Visit the <a href="https://github.com/nintondo/" target="_blank" style="color: #1E90FF;">Nintondo Github</a> page for updates.</p>
        </div>
        <div style="margin-top: 20px;">
          <p>Support the Bellscoin Army. Send your donations to the addresses below:</p>
          <p>Send $BEL: <span id="bel-address"><a href="https://nintondo.io/explorer/address/BEGJMVqLYRJkGwvwmsZDDjERpzxGqdyzXT" target="_blank" style="color: #1E90FF;">BEGJMVqLYRJkGwvwmsZDDjERpzxGqdyzXT</a></span> <button class="copy-button" onclick="copyToClipboard('bel-address')">Copy</button></p>
          <p>Send $USDT (ERC-20) or $ETH: <span id="usdt-address"><a href="https://etherscan.io/address/0xdb9Fa415A41559450d401D90974af883339553CF" target="_blank" style="color: #1E90FF;">0xdb9Fa415A41559450d401D90974af883339553CF</a></span> <button class="copy-button" onclick="copyToClipboard('usdt-address')">Copy</button></p>
          <p>The funds raised will be primarily used for listing and liquidity provisioning (LP).</p>
          <p>Any remaining funds will be utilized for the development of the Bellscoin ecosystem.</p>
          <p>Visit the <a href="https://donation.bellscoin.com/" target="_blank" style="color: #1E90FF;">Bellscoin Donation</a> page for updates.</p>
          <p>Thank you. Stay <a href="https://node.z4ch.xyz/bellish" target="_blank" style="color: #1E90FF;">Bellish</a>!</p>
        </div>
        <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #ccc;">
          <p>Created by: <a href="https://x.com/ZachZwei" target="_blank" style="color: #1E90FF;">z4ch</a></p>
          <p>Source: <a href="https://github.com/zachzwei/BEL-Block-Countdown" target="_blank" style="color: #1E90FF;">github</a></p>
        </div>
        <script>
          // Load the user's preferred theme from localStorage or default to system preference
          document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
              document.body.classList.toggle('dark-mode', savedTheme === 'dark');
            } else {
              const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
              document.body.classList.toggle('dark-mode', prefersDarkScheme);
            }
          });

          function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
          }

          function copyToClipboard(id) {
            const textElement = document.getElementById(id);
            const text = textElement.textContent || textElement.innerText;
            navigator.clipboard.writeText(text).then(() => {
              alert('Address copied to clipboard!');
            }).catch(err => {
              console.error('Failed to copy: ', err);
            });
          }

          function refreshPage() {
            location.reload();
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
