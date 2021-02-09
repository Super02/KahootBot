require('dotenv').config()
const Eris = require('eris')
const Kahoot = require("kahoot.js-updated")
const client = new Kahoot()
const Chance = require('chance');
const chance = new Chance();

const bot = new Eris(process.env.TOKEN)

bot.on('ready', () => {
    console.log(`${bot.user.username}#${bot.user.discriminator} on käynnistetty`)
})

bot.on('messageCreate', (message) => {
    const mentionRegex = RegExp(`^<@!?${bot.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${bot.user.id}>`);

    if (!message || !message.member || message.member.bot) return;

    const prefix = message.content.match(mentionRegexPrefix) ?
        message.content.match(mentionRegexPrefix)[0] : process.env.PREFIX;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'join') {
        let pin = args[0];
        if (!args.length) return message.channel.createMessage('You need to provide me the kahoot\'s pin!')
        message.channel.createMessage('Sending bots to the following kahoot game');

        const bots = [...Array(400).keys()].map((i) => {
            const client = new Kahoot()
            const name = chance.name()
            client.join(pin, name);

            client.on("Joined", () => {
                console.log(`${pin}: Joined successfully`)
            })

            client.on("QuestionStart", question => {
                question.answer(Math.floor(Math.random() * 4))
            })

            return client;
        });

        client.join(pin, 'cancer') // join as someone so it wont spam console logs and messages

        client.on("QuizStart", () => {
            console.log(`${pin}: Quiz is starting`)
            message.channel.createMessage(`${pin}: The quiz is about to start!`)
        })

        client.on("QuestionStart", question => {
            message.channel.createMessage(`${pin}: A new question has started. Answering randomly`)
            console.log(`${pin}: New question has started`);
            question.answer(Math.floor(Math.random() * 4))
        })

        client.on("QuizEnd", () => {
            message.channel.createMessage(`${pin}: The quiz has ended..`)
            console.log(`${pin}: The quiz has ended.`);
        })
    }
})
process.on('warning', e => console.warn(e.stack));

function bots(id) {
    const name = chance.name()
    client.join(id, name)
}

bot.connect()
