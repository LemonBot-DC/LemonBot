const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'unmute',
  description: '從伺服器中解除禁言指定用戶', 
  options: [{
    type: 'USER',
    name: '使用者',
    description: '欲解除禁言的使用者',
    required: true
  }],
  async execute(interaction) {
    const user = interaction.options.getMember('使用者');
    if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('成功在伺服器解除禁言指定用戶')
            .setDescription(`${user.user.tag} 已被從伺服器解除禁言`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });        
        try {
        	await user.timeout(null).catch(e => {throw e});
            await interaction.reply({ embeds: [exampleEmbed] });
        } catch(e) {
            const exampleEmbed = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('請將機器人的身分組移動至最高位')
              .setDescription('請至伺服器設定 > 身分組\n將LemonBot的機器人身分組拖曳至最高層\n並給予管理員權限')
              .setTimestamp()
              .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
           	return interaction.reply({ embeds: [exampleEmbed] })
        }
    } else {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('無法在伺服器解除禁言指定用戶')
            .setDescription(`您沒有權限在伺服器解除禁言用戶`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
        interaction.reply({ embeds: [exampleEmbed] })
    }    
  }
}
