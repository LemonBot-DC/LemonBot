const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'say',
  description: '讓機器人說出指定的一段話', 
  options: [{
    type: 'STRING',
    name: '內容',
    description: '要讓機器人說的話',
    required: true
  }],
  async execute(interaction) {
    const content = interaction.options.getString('內容');
    await interaction.channel.send(`${content}`)
    await interaction.reply({ content: '💌 | 機器人成功發送指定訊息', ephemeral: true })
  }
}