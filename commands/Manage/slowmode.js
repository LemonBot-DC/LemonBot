const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'slowmode',
  description: '設定當前頻道的慢速模式', 
  options: [{
    type: 'INTEGER',
    name: '時長',
    description: '以秒計算要設定慢速模式的時間',
    required: true
  }],
  async execute(interaction) {
    const time = interaction.options.getInteger('時長');
    if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('成功在頻道設定慢速模式')
            .setDescription(`成功將頻道的慢速模式設定為 ${time} 秒`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
       await interaction.channel.setRateLimitPerUser(time);
       await interaction.reply({ embeds: [exampleEmbed] });
    } else {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('無法在頻道設定慢速模式')
            .setDescription(`您沒有權限在伺服器設定慢速模式`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
        interaction.reply({ embeds: [exampleEmbed] })
    }    
  }
}
