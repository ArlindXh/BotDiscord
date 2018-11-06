const Discord = require("discord.js");
const client = new Discord.Client();


const config = require("./config.json");


client.on("ready", () => {
    console.log("Bot Ready!");
});

client.on("message", (message) => {
    if (message.author.bot) return;

    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        message.channel.send("pong");
    }

    if (command === 'math') {

        message.channel.send("2+2*2=?")
            .then(() => {
                message.channel.awaitMessages(response => response.content === "6", {
                    max: 1,
                    time: 10000,
                    errors: ['time'],
                })
                    .then((collected) => {
                        message.channel.send(`${collected.first().content} is correct. Good job ${message.author} but let's be real, it wasnt that hard... `);
                    })
                    .catch(() => {
                        message.channel.send('There was no reply');
                    });
            })
    }

});






client.login(config.token);