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

    if (command === "kick") {

        if (!message.member.roles.some(r => ["BANKAI", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server");
        if (!member.kickable)
            return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        // Now, time for a swift kick in the nuts!
        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

    }
});






client.login(config.token);