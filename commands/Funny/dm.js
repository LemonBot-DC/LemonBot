const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'dm',
  description: '讓機器人私訊使用者說出指定的一段話', 
  options: [{
    type: 'STRING',
    name: '內容',
    description: '要讓機器人說的話',
    required: true
  }, {
    type: 'USER',
    name: '使用者',
    description: '要讓機人私訊的使用者',
    required: true
  }],
  async execute(interaction) {
    const content = interaction.options.getString('內容');
    const user = interaction.options.getUser('使用者');    
    const Embed = new MessageEmbed()
        .setColor('#F5F5F5')
        .setTitle(`${interaction.user.username} 發送了一條訊息`)
        .setDescription(`${content}`)
        .setTimestamp()
        .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
    await user.createDM()
    await user.send({ embeds: [Embed] })
    await interaction.reply('✨ | 您的私訊已經成功發送')
  }
}