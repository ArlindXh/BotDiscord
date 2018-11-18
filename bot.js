const Discord = require("discord.js");
const client = new Discord.Client();

const talkedRecently = new Set();

const config = require("./config.json");

const swears = ["darn", "shucks", "frik", "shyte"];
// removing the "!" prefix
const swearWord = swears.slice(1);


client.on("ready", () => {
    console.log("Bot Ready!");
});

client.on("message", async (message) => {
    // don't react to other bot replies
    if (message.author.bot) return;

    // set a 2.5s CD for commands per user
    if (talkedRecently.has(message.author.id))
        return;

    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 2500)



    // don't react to messages that dont start with "!"
    //   if (message.content.indexOf(config.prefix) !== 0) return;

    // take the content, remove whitespaces, remove the prefix, split in single spaces
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    // take the command from the array transform it to lowercase
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        await message.channel.send("pong");
    }



    if (command === 'math') {

        await message.channel.send("2+2*2=?")
            .then(() => {
                message.channel.awaitMessages(response => response.content === "6", {
                    max: 1,
                    time: 5000,
                    errors: ['time'],
                }
                )

                    .then((collected) => {


                        message.channel.send(`${collected.first().content} is correct. Good job ${message.author} but let's be real, it wasn't that hard... `);

                    })

                    .catch(() => {
                        message.channel.send('Better luck next time');
                    });
            })
    }

    // warns if u use a swear word 
    if (swearWord.some(word => message.content.includes(word))) {
        await message.reply(`Oh, thats a no-no word`)
    }

    if (command === 'cat') {
        await message.reply(`${"http://media.petsathome.com/wcsstore/pah-cas01//c/catL.png"}`)
    }
});






client.login(config.token);