# BEL-Block-Countdown
Want to know any upcoming Bellscoin Milestones?
Go here:
https://bit.ly/bellblocks

Or create your own.
Will require that you run your own Bellscoin Node and configure your RPC.

To set up and run the Node.js server, you'll need the following requirements and steps:

### Requirements:

1. **Node.js**:
   - Ensure that Node.js is installed on your server or local machine. You can download and install Node.js from [here](https://nodejs.org/).

2. **npm (Node Package Manager)**:
   - npm usually comes bundled with Node.js. You can verify its installation by running `npm -v` in your terminal.

3. **Dependencies**:
   - **Express.js**: A minimal and flexible Node.js web application framework.
   - **node-fetch**: A module that allows you to make HTTP requests in Node.js.

### Steps to Install and Run:

1. **Create a Directory for Your Project**:
   ```bash
   mkdir bellscoin-countdown
   cd bellscoin-countdown
   ```

2. **Initialize a New Node.js Project**:
   - Run the following command and follow the prompts to create a `package.json` file:
     ```bash
     npm init -y
     ```

3. **Install Required Dependencies**:
   - Install `express` and `node-fetch` using npm:
     ```bash
     npm install express node-fetch
     ```

4. **Create `server.js`**:
   - Inside your project directory, create a file named `server.js` and paste the code I provided.

5. **Run the Server**:
   - Start the server by running:
     ```bash
     node server.js
     ```

6. **Access the Countdown**:
   - Open your web browser and go to `http://<your-server-ip>:3000/blockcountdown` to view the countdown page.

### Optional:
- **Running as a Background Process**:
   - If you want to keep the server running in the background, you can use a tool like `pm2`:
     ```bash
     npm install -g pm2
     pm2 start server.js
     ```

This setup should allow you to run the Node.js server and host your Bellscoin countdown page.