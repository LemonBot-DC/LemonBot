const { MessageEmbed } = require('discord.js');
const { Client } = require('discord.js');
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});
require('dotenv').config();
client.login(process.env.TOKEN);

module.exports = {
  type: 'CHAT_INPUT',
  name: 'serverlist',
  description: '開啟機器人所在伺服器列表',
  async execute(interaction) {
    if (interaction.user.id != "871616467186098187") {
        return interaction.reply('⚡ | 此指令僅供機器人擁有者使用')
    } else {
    	const res = new MessageEmbed()
          .setAuthor({ name: `${interaction.client.settings.name} 伺服列表`, iconURL: interaction.client.user.displayAvatarURL() })
          .setColor(0xE4FFF6);
        const lists = [];
        client.guilds.cache.forEach(guild => {
            lists.push(`${guild.name} - ${guild.id}`)
        });
          res.setDescription(lists.join('\n'))
            .setFooter({ text: `${interaction.user.tag}・LemonBot`, iconURL: interaction.user.displayAvatarURL() });

          return interaction.reply({ embeds: [res] , ephemeral: true });
    }
  }
}