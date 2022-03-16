const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'notify',
  description: '讓機器人在指定時間後提醒你', 
  options: [{
    type: 'INTEGER',
    name: '數字',
    description: '多少分鐘後要發出通知',
    required: true
  }, {
    type: 'STRING',
    name: '原因',
    description: '要發出的通知內容'
  }],
  async execute(interaction) {
    const when = interaction.options.getInteger('數字');
    const why = interaction.options.getString('原因') || '無';
    await interaction.reply(`♻ | 機器人將在 ${when} 分鐘後私訊通知您`);
    
    setTimeout(async function(){
        await interaction.user.createDM();
    	await interaction.user.send(`🧶 | 您所設置的 ${when} 分鐘通知時間已到 ( 通知原因：${why} )`)
    },when*60*1000);    
  }
}