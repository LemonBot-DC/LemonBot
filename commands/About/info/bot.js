const { MessageEmbed } = require('discord.js');
const { Client } = require('discord.js');
const { version } = require('../../../package.json');
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});
require('dotenv').config();

client.login(process.env.TOKEN);

module.exports = {
  type: 'SUB_COMMAND',
  name: 'bot',
  description: '獲得機器人資訊',
  async execute(interaction) {

    const { tag } = interaction.client.user;
    const { nickname } = interaction.guild.me;
    const promiseGuildCount = interaction.client.shard
      .fetchClientValues('guilds.cache.size')
      .then(reduceReturnValue);
    const promiseMemberCount = interaction.client.shard
      .broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
      .then(reduceReturnValue);
    const promiseConnectionsCount = interaction.client.shard
      .fetchClientValues('music.connections.size')
      .then(reduceReturnValue);
	const uptime = msToHMS(client.uptime)
    const [totalGuildCount, totalMemberCount, totalConnectionsCount] =
      await Promise.all([promiseGuildCount, promiseMemberCount, promiseConnectionsCount]);

    const infoEmbed = new MessageEmbed()
      .setAuthor({ name: '我的資訊', iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.com/api/oauth2/authorize?client_id=947009545731969044&permissions=8&scope=bot%20applications.commands' })
      .setColor(0xE4FFF6)
      .addFields({
        name: '名字',
        value: tag,
        inline: true
      }, {
        name: '在本伺服器暱稱',
        value: nickname ?? '無',
        inline: true
      }, {
        name: '版本',
        value: `v${version}`,
        inline: true
      }, {
        name: '服務伺服器數量',
        value: `${totalGuildCount}`,
        inline: true
      }, {
        name: '服務總用戶數量',
        value: `${totalMemberCount}`,
        inline: true
      }, {
        name: '語音連接數量',
        value: `${totalConnectionsCount}`,
        inline: true
      }, {
        name: '開始服務時間',
        value: `<t:${~~(interaction.client.user.createdTimestamp/1000)}:R>`,
        inline: true
      }, {
        name: '加入本伺服器時間',
        value: `<t:${~~(interaction.guild.me.joinedTimestamp/1000)}:R>`,
        inline: true
      }, {
        name: '啟動時間',
        value: `${uptime}`,
        inline: true
      }, {
        name: '開發者',
        value: 'WinsonOTP',
      }, {
        name: '相關連結',
        value: '[邀請我](https://discord.com/api/oauth2/authorize?client_id=947009545731969044&permissions=8&scope=bot%20applications.commands)・[音樂功能使用開源網址](https://github.com/kyometori/chocomint)'
      })
      .setThumbnail(interaction.client.user.displayAvatarURL({ format: 'png', size: 300 }))
      .setFooter({ text: `${interaction.user.tag}・使用 /help 來查看所有指令`, iconURL: interaction.user.displayAvatarURL() });

    interaction.reply({
      embeds: [infoEmbed]
    });
  }
}

function reduceReturnValue(result) {
  return result.reduce((acc, now) => acc + now, 0);
}

function msToHMS( ms ) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = Math.round(seconds % 3600); // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return hours+":"+minutes+":"+seconds;
}
