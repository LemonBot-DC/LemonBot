const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'server',
  description: '獲得伺服器資訊',
  async execute(interaction) {
            const infoEmbed = new MessageEmbed()
              .setAuthor({ name: '伺服器資訊', iconURL: interaction.client.user.displayAvatarURL() })
              .setColor('#F0F8FF')
              .addFields({
                name: '伺服器名稱',
                value: interaction.guild.name,
                inline: true
              },  {
                name: '伺服器ID',
                value: `${interaction.guild.id}`,
                inline: true
              }, {
                name: '伺服器人數',
                value: `${interaction.guild.memberCount}`,
                inline: true
              }, {
                name: '伺服器簡介',
                value: interaction.guild.description ?? '無',
                inline: true
              }, {
                name: '伺服器擁有者',
                value: `<@${interaction.guild.ownerId}>`,
                inline: true
              }, {
                name: '伺服器創建時間',
                value: `<t:${~~(interaction.guild.createdTimestamp/1000)}:R>`,
                inline: true
              })
              .setThumbnail(interaction.guild.iconURL({ format: 'png', size: 300 }))
              .setFooter({ text: `${interaction.guild.name}・伺服器相關資訊`, iconURL: interaction.guild.iconURL() });
        	return interaction.reply({ embeds: [infoEmbed] })
  }
}
