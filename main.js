const { Client, Poll, LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});
const chatId = '120363367329563787@g.us';
const responses = {}; // To store user responses

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// client initialize does not finish at ready now.
client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('READY');
    const debugWWebVersion = await client.getWWebVersion();
    console.log(`WWebVersion = ${debugWWebVersion}`);

    client.pupPage.on('pageerror', function(err) {
        console.log('Page error: ' + err.toString());
    });
    client.pupPage.on('error', function(err) {
        console.log('Page error: ' + err.toString());
    });

     // Define the interval for every 5 minutes
    setInterval(() => {       
        const message = 'This is a scheduled message sent every 15 secs!';

        // // Send the message
        // client.sendMessage(chatId, message)
        //     .then(() => console.log('Message sent successfully!'))
        //     .catch(err => console.error('Error sending message:', err));

        // Send the poll
        client.sendMessage(chatId, new Poll('New Product Coffee 🎉?', ['Yes', 'Not this time']))
            .then(() => console.log('Poll sent successfully!'))
            .catch(err => console.error('Error sending message:', err));

    }, 300*1000); // 300,000 milliseconds = 5 minutes
});


// -----------------------------------------
// Start messeging 
client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body.startsWith('!ping reply')) {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');
    } else if (msg.body.startsWith('!test_group')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            client.sendMessage(msg.from, 'this is group');
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!sendpoll') {
        await msg.reply(new Poll('New Product Coffee 🎉?', ['Yes', 'Not this time']));
    } else if (message.from === chatId) {
        const userResponse = message.body.trim().toLowerCase();
         console.log(`tracking userResponse`);
        // Track users who answered "Yes"
        if (userResponse === 'Yes') {
            responses[message.author] = 'Yes'; // message.author contains the user's ID
            console.log(`${message.author} answered Yes.`);
        } else if (userResponse === 'Not this time') {
            responses[message.author] = 'No';
            console.log(`${message.author} answered No.`);
        }
    }
});
