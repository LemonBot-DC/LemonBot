const { Client, Collection } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { createMusicManager } = require('@kyometori/djsmusic');
const fs = require('fs');
const cooldowns = new Collection();
require('dotenv').config();
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES']
});

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

client.commands = new Collection();
client.autocomplete = new Collection();
client.settings = require('./settings.json');

const cmdDirs = fs.readdirSync('./commands');
for (const dir of cmdDirs) {
    const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        client.commands.set(command.name, command);
    }
}
const autocompleteFiles = fs.readdirSync('./autocomplete').filter(file => file.endsWith('.js'));
for (const file of autocompleteFiles) {
	const autocomplete = require(`./autocomplete/${file}`);
    client.autocomplete.set(autocomplete.name, autocomplete);
}

client.once('shardReady', id => {
  if (id === client.shard.count - 1) setTimeout(() => console.log(`${YELLOW}[MANAGER]${RESET} 全數上線完畢`), 0);
});

client.once('ready', () => {
  if (client.shard) console.log(`${GREEN}[SHARD#${client.shard.ids[0]}]${RESET} ${client.user.tag} 已成功上線`);
  else console.log('成功上線')
  client.user.setPresence({ activities: [{ name: 'LemonBot ‧ /help' }], status: 'online' });
  createMusicManager(client, {
    defaultMaxQueueSize: Infinity,
    enableInlineVolume: true
  });
  const Today = new Date();
  let day = Today.getDate();
  let hours = Today.getUTCHours() + 8;
  if (hours >= 24) {
    hours = hours - 24;
    day = day + 1;
   }
  const lchannel = client.channels.cache.get('946020677893369916');
  const exampleEmbed = new MessageEmbed()
    .setColor('#FFFAFA')
    .setTitle('機器人成功上線紀錄')
    .setAuthor({ name: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' })
    .setDescription(`${Today.getFullYear()} 年 ${(Today.getMonth() + 1)} 月 ${day} 日 ${hours} 時 ${Today.getMinutes()} 分 ${Today.getSeconds()} 秒`)
    .setTimestamp()
        .setFooter({ text: 'LemonBot OnlineRec.', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
 lchannel.send({ embeds: [exampleEmbed] });
    
});

client.on('interactionCreate', interaction => {
  if (!interaction.inGuild() && !interaction.user.id == '871616467186098187') return interaction.reply('🪔 | 請將機器人邀請至伺服器後於伺服器內使用指令');
  const command =
    client.commands.get(interaction.commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(interaction.commandName));
  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return interaction.reply({ content: `🍋 | ${command.name} 指令還在冷卻中，請等待 ${timeLeft.toFixed(1)} 秒後再使用指令。`, ephemeral: true });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  if (interaction.isApplicationCommand()) return commandHandler(interaction);
  if (interaction.isAutocomplete()) return autocompleteHandler(interaction);
});


function commandHandler(interaction) {
  const { commandName } = interaction;
  const command = client.commands.get(commandName);

  if (!command) interaction.reply({
    content: '機器人沒有這個指令，請等待Discord同步',
    ephemeral: true
  });

  command.execute(interaction)
    .then(() => {
      console.log(`${GREEN}[SHARD#${client.shard.ids[0]}]${RESET} 執行指令：${command.name}`);
      const xchannel = client.channels.cache.get('942259831639793704');
      const exampleEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('機器人指令使用紀錄')
        .setAuthor({ name: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' })
        .setDescription(`[${interaction.user.tag}] 執行指令：${command.name}`)
        .setTimestamp()
        .setFooter({ text: 'LemonBot CommandRec.', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
      xchannel.send({ embeds: [exampleEmbed] });
    })
    .catch(err => {throw err});
}

function autocompleteHandler(interaction) {
  const { commandName } = interaction;
  const { name } = interaction.options.getFocused(true);
  client.autocomplete.get(commandName)[name](interaction);
}
function onError(err) {
  console.error(`${GREEN}[SHARD#${client.shard.ids[0]}]${RESET} ${RED}出現錯誤：${RESET}`);
  console.error(err);
  const ychannel = client.channels.cache.get('942256203193548833');
  const exampleEmbed = new MessageEmbed()
    .setColor('RED')
    .setTitle('機器人運行時發生錯誤')
    .setAuthor({ name: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' })
    .setDescription('```'+`${err}`+'```')
    .setTimestamp()
    .setFooter({ text: 'LemonBot ErrorReport', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
  ychannel.send({ embeds: [exampleEmbed] });
}

process
  .on("unhandledRejection", onError)
  .on("uncaughtException", onError);

client.on('error', onError);

client.login(process.env.TOKEN);
