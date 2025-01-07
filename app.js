const { Client, GatewayIntentBits, Partials} = require('discord.js');
const { getResponse } = require('./utils/ollamaApi');
const express = require('express')
require('dotenv').config();

const { DISCORD_TOKEN, CHATBOT_CHANNEL_ID, SYSTEM_PROMPT } = process.env;
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
    res.render('index.ejs');
});


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== CHATBOT_CHANNEL_ID) return;

    const content = message.content;
    const chatHistory = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": content
        }
    ];

    try {
        message.channel.sendTyping();
        const sent = await message.reply({ content: "Mashiro's thinking ...", fetchReply: true });
        getResponse('mashiro', chatHistory)
           .then((response) => {
                sent.edit({ content: response });
            })
            .catch(err => {
                sent.delete();
                message.reply({ content: "Error occurred while communicating with Mashiro.", ephemeral: true });
            });
        
    } catch (error) {
        console.error('Error:', error);
        sent.delete();
        message.reply({ content: "Error occurred while communicating with Mashiro.", ephemeral: true });
    }
});


app.listen(6969);


client.login(DISCORD_TOKEN)
    .then(() => {
        console.log('Login as '+ client.user.tag);
    })
    .catch(error => {
        console.error('Error:', error);
    });
