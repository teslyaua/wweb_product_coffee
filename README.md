# **Product Coffee Reminder Bot**

This project is a WhatsApp bot built using `@wppconnect-team/wppconnect`. It sends reminders, creates polls, and matches participants for virtual coffee/tea chats.

---

## **Features**
- Sends a coffee reminder message.
- Automatically schedules polls and processes responses.
- Matches participants randomly for coffee/tea chats.

---

## **Getting Started**

### **Prerequisites**
1. Install [Node.js](https://nodejs.org/) (v16 or later recommended).
2. Install [PM2](https://pm2.keymetrics.io/) for process management:
   ```bash
   npm install -g pm2
3. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/your-repo/product-coffee-bot.git
   cd product-coffee-bot
   npm install

## **Usage**
1. Running the Bot
    ```bash
    npm run start
2. Running with PM2:  Use PM2 for process management and to keep the bot running continuously, even after machine restarts.
    ```bash
    # Start the Scheduler
    pm2 start src/scheduler.js --name coffee-bot
    # Monitor Logs
    pm2 logs
    # List Running Processes
    pm2 list
    # Stop a Process
    pm2 stop coffee-bot
    pm2 delete coffee-bot
