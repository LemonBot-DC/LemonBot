const { MessageEmbed } = require('discord.js');
const { Client } = require('discord.js');
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});
require('dotenv').config();

client.login(process.env.TOKEN);

module.exports = {
  type: 'CHAT_INPUT',
  name: 'report',
  description: '向機器人的開發者回報問題或提供建議', 
  options: [{
    type: 'STRING',
    name: '主題',
    description: '要提供的建議或回報主題',
    required: true
  },{
    type: 'STRING',
    name: '內容',
    description: '要提供的建議或回報內容',
    required: true
  }],
  async execute(interaction) {
    const topic = interaction.options.getString('主題');
    const content = interaction.options.getString('內容');
    const repchannel = client.channels.cache.get('943494968541081630');
    const repEmbed = new MessageEmbed()
        .setColor('#BC8F8F')
        .setTitle(`${topic}`)
        .setAuthor({ name: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' })
        .setDescription(`${interaction.user.tag} 提供的一項建議： \n${content}`)
        .setTimestamp()
        .setFooter({ text: 'LemonBot Report', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
    repchannel.send({ embeds: [repEmbed] });
    interaction.reply('🚨 | 您的建議或回報已經成功送出')
  }
}