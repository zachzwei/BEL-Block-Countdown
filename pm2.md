## To use PM2 for managing your Node.js scripts, follow these steps:

1. Install PM2 Globally
You need to install PM2 globally on your system. Run the following command:

```
npm install -g pm2
```

This installs PM2 and makes it available as a global command.

2. Start Your Node.js Script with PM2
Once PM2 is installed, you can start your Node.js script using PM2 by running the following command:

```
pm2 start your_script.js
```
Replace your_script.js with the name of your JavaScript file (e.g., server.js).

3. Check the Status of Your Application
After starting your script, you can check the status of your running processes with:

```
pm2 list
```

This will show all processes being managed by PM2, including their status (online/offline), restarts, and CPU/memory usage.

4. Additional PM2 Commands
Stop a Process:

To stop a specific process, use its process ID (shown in pm2 list):

```
pm2 stop <process_id>
```

## Restart a Process:

To restart a specific process:

```
pm2 restart <process_id>
```
Monitor Logs in Real-Time:

To monitor logs for a specific process:

```
pm2 logs <process_id>
```

Or view logs for all processes:

```
pm2 logs
```

## Auto-Restart on System Reboot:

If you want PM2 to automatically restart your application when the server reboots, run the following command:

```
pm2 startup
```

This will generate a command specific to your operating system. Follow the instructions it provides to enable this feature.

5. Enable File Watching (Optional)
If you want PM2 to automatically restart your app when it detects file changes (like Nodemon), you can enable the --watch option:

```
pm2 start your_script.js --watch
```

This will make PM2 monitor your files for any changes and restart the app automatically when a change is detected.

6. Save the Current Process List
If you want to save the current list of processes so that PM2 can automatically restore them after a reboot, run:

```
pm2 save
```

7. Stop and Remove a Process
To stop and completely remove a process from PM2, you can use:

```
pm2 delete <process_id>
```

With these steps, your Node.js scripts will be running with PM2, and you can easily manage them, check logs, restart them, and even ensure they restart after system reboots.
