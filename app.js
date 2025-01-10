require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { getResponse } = require('./utils/ollamaApi');

const bodyParser = require('body-parser');

const { DISCORD_TOKEN, CHATBOT_CHANNEL_ID, SYSTEM_PROMPT } = process.env;
const app = express();
let model = "hf.co/mashironotdev/mashiro:Q4_K_M"; // Default model name.

app.set('view engine', 'ejs');
app.use(bodyParser.json());

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

app.post('/api/selectModel', (req, res) => {
    model = req.body.model;
    console.log(`Selected model: ${model}`); // Debugging line
    res.sendStatus(200);
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
        const sent = await message.reply({ content: "Mashiro's thinking ..." });
        getResponse(model, chatHistory)
           .then((response) => {
                sent.delete();
                message.reply({ content: response });
            })
            .catch(async err => {
                sent.delete();
                await message.reply({ content: "Error occurred while communicating with Mashiro.", ephemeral: true });
            });
        
    } catch (error) {
        console.error('Error:', error);
        sent.delete();
        await message.reply({ content: "Error occurred while communicating with Mashiro.", ephemeral: true });
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
