const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'calc',
  description: '讓機器人計算指定算式', 
  options: [{
    type: 'STRING',
    name: '算式',
    description: '要讓機器人計算的算式',
    required: true
  }],
  async execute(interaction) {
    await interaction.deferReply();
    const content = interaction.options.getString('算式');
    const ans = math.evaluate(content)
    await interaction.editReply(`${ans}`)
  }
}