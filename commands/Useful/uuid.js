const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'uuid',
  description: '讓機器人產生指定數量組UUID識別碼', 
  options: [{
    type: 'INTEGER',
    name: '數量',
    description: '要讓機器人產生的數量',
    required: true
  }],
  async execute(interaction) {
    const times = interaction.options.getInteger('數量');
    if (times > 100) return interaction.reply('💥 | 產生的數量不可大於 100')
    function _uuid() {
      let d = Date.now();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
    let replyuuid = ''
    for (let i = 0; i<times; i++) replyuuid = `${replyuuid}${_uuid()}\n`
    const useruuid = new MessageEmbed()
        .setColor('#F5FFFA')
        .setTitle('隨機 ＵＵＩＤ 辨識碼')
        .setDescription(replyuuid);
    await interaction.reply({
        embeds: [useruuid],
    });
  }
}