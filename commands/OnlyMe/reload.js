const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'reload',
  description: '重新啟動機器人',
  async execute(interaction) {
    if (interaction.user.id != "871616467186098187") {
        return interaction.reply('⚡ | 此指令僅供機器人擁有者使用')
    } else {
    	await interaction.reply({ content: '🌟 | 將開始重新啟動機器人', ephemeral: true })
        await process.exit()
        await require('../../index.js')()
    }
  }
}