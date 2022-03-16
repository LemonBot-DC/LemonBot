const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'purge',
  description: '從頻道中刪除特定數量的訊息', 
  options: [{
    type: 'NUMBER',
    name: '數量',
    description: '欲刪除的訊息數量',
    required: true
  }],
  async execute(interaction) {
    const many = interaction.options.getNumber('數量');
    if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
        if (many>100 || many<1) {
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('訊息數量需介於1至100之間')
                .setDescription(`請輸入一個大於 0 且小於 101 的整數`)
                .setTimestamp()
                .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
            return interaction.reply({ embeds: [exampleEmbed] });
        }
        
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('成功在伺服器刪除特定數量訊息')
            .setDescription(`已刪除此頻道的 ${many} 則訊息`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
        await interaction.channel.bulkDelete(many, { filterOld: true }).catch(e => {throw e});
        await interaction.reply({ embeds: [exampleEmbed] });
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 3000);
    } else {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('無法在伺服器刪除訊息')
            .setDescription(`您沒有權限在伺服器中刪除訊息`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
        return interaction.reply({ embeds: [exampleEmbed] })
    }
  }
}
