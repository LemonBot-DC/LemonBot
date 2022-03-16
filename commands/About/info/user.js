const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'user',
  description: '獲得成員資訊',
  options: [{
    type: 'USER',
    name: '使用者',
    description: '欲查看資訊的使用者'
  }],
  async execute(interaction) {
    const user = interaction.options.getUser('使用者');
    if (!user) {
            const infoEmbed = new MessageEmbed()
              .setAuthor({ name: '使用者資訊', iconURL: interaction.client.user.displayAvatarURL() })
              .setColor('#F0F8FF')
              .addFields({
                name: '使用者名稱',
                value: interaction.user.username,
                inline: true
              },  {
                name: '是否為機器人',
                value: `${interaction.user.bot}`,
                inline: true
              }, {
                name: '使用者ID',
                value: `${interaction.user.id}`,
                inline: true
              }, {
                name: '帳號創建時間',
                value: `<t:${~~(interaction.user.createdTimestamp/1000)}:R>`,
                inline: true
              })
              .setThumbnail(interaction.user.displayAvatarURL({ format: 'png', size: 300 }))
              .setFooter({ text: `${interaction.user.tag}・使用者相關資訊`, iconURL: interaction.user.displayAvatarURL() });
        	return interaction.reply({ embeds: [infoEmbed] })
    } else {
        const infoEmbed = new MessageEmbed()
              .setAuthor({ name: '使用者資訊', iconURL: interaction.client.user.displayAvatarURL() })
              .setColor('#F0F8FF')
              .addFields({
                name: '使用者名稱',
                value: user.username,
                inline: true
              },  {
                name: '是否為機器人',
                value: `${user.bot}`,
                inline: true
              }, {
                name: '使用者ID',
                value: `${user.id}`,
                inline: true
              }, {
                name: '帳號創建時間',
                value: `<t:${~~(user.createdTimestamp/1000)}:R>`,
                inline: true
              })
              .setThumbnail(user.displayAvatarURL({ format: 'png', size: 300 }))
              .setFooter({ text: `${user.tag}・使用者相關資訊`, iconURL: user.displayAvatarURL() });
        	return interaction.reply({ embeds: [infoEmbed] })
        
    }
  }
}
