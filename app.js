const { Client, GatewayIntentBits, Partials} = require('discord.js');
const { getResponse } = require('./utils/ollamaApi');
const express = require('express')
require('dotenv').config();

const { DISCORD_TOKEN, CHATBOT_CHANNEL_ID } = process.env;
const app = express();

app.set('view engine', 'ejs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});


app.get('/', (req, res) => {
    res.send('hello');
});


client.on('messageCreate', (message) => {
    const content = message.content;
    if(message.author.bot) return;
    // Isn't Chat Bot Channel return.
    if (!(message.channel.id === CHATBOT_CHANNEL_ID)) return;
    message.channel.sendTyping();
    getResponse('mashiro:1.2b', content)
        .then(response => {
            message.reply(response);
        })
        .catch(error => console.error('Error:', error));
});


app.listen(8080);


client.login(DISCORD_TOKEN)
    .then(() => {
        console.log('Login as '+ client.user.tag);
    })
    .catch(error => {
        console.error('Error:', error);
    });