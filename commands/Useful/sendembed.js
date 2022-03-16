const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'sendembed',
  description: '讓機器人傳送一個嵌入訊息', 
  options: [{
    type: 'STRING',
    name: '標題',
    description: '嵌入的標題',
    required: true
  }, {
    type: 'STRING',
    name: '描述',
    description: '嵌入的說明文字',
    required: true
  }, {
    type: 'STRING',
    name: '顏色',
    description: '嵌入內容的顏色'
  }, {
    type: 'STRING',
    name: '嵌入頭像',
    description: '嵌入內容中的用戶頭像網址'
  }, {
    type: 'STRING',
    name: '嵌入名字',
    description: '嵌入內容中的用戶名字'
  }, {
    type: 'STRING',
    name: '嵌入圖片',
    description: '嵌入內容中的圖片'
  }, {
    type: 'STRING',
    name: '項目標題一',
    description: '嵌入內容中第一項的標題'
  }, {
    type: 'STRING',
    name: '項目內容一',
    description: '嵌入內容中第一項的內容'
  }, {
    type: 'STRING',
    name: '項目標題二',
    description: '嵌入內容中第二項的標題'
  }, {
    type: 'STRING',
    name: '項目內容二',
    description: '嵌入內容中第二項的內容'
  }],
  async execute(interaction) {
    const topic = interaction.options.getString('標題');
    const desc = interaction.options.getString('描述');
    const color = interaction.options.getString('顏色');
    const autht = interaction.options.getString('嵌入頭像');
    const authm = interaction.options.getString('嵌入名字');
    const photo = interaction.options.getString('嵌入圖片');
    const f01t = interaction.options.getString('項目標題一');
    const f01c = interaction.options.getString('項目內容一');
    const f02t = interaction.options.getString('項目標題二');
    const f02c = interaction.options.getString('項目內容二');
    const f03t = interaction.options.getString('項目標題三');
    const f03c = interaction.options.getString('項目內容三');
    const sende = new MessageEmbed()
        .setTitle(topic)
        .setDescription(desc)
        .setTimestamp()
    if (color) sende.setColor(color);
    if (authm&&autht) sende.setAuthor({ name: authm, iconURL: autht });
    if (photo) sende.setImage(photo);
    if (f01t&&f01c) sende.addField(f01t, f01c, true)
    if (f02t&&f02c) sende.addField(f02t, f02c, true)
    if (f03t&&f03c) sende.addField(f03t, f03c, true)
    await interaction.channel.send({ embeds: [sende]})
    await interaction.reply({ content: '💌 | 您的嵌入內容已經成功發送', ephemeral: true })
  }
}