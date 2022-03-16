const { MessageEmbed } = require('discord.js');
const translate = require('translate-google')

module.exports = {
  type: 'CHAT_INPUT',
  name: 'transl-toen',
  description: '讓機器人翻譯指定的一段內容為英文', 
  options: [{
    type: 'STRING',
    name: '內容',
    description: '要讓機器人翻譯的內容',
    required: true
  }],
  async execute(interaction) {
    await interaction.deferReply();
    const content = interaction.options.getString('內容');
    translate(`${content}`, {to: 'en'}).then(res => {
        const exampleEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle('翻譯結果')
            .setDescription(`${res}`)
            .setTimestamp()
            .setFooter({ text: 'LemonBot', iconURL: 'https://images-ext-2.discordapp.net/external/Lqm9_BKgGBOroYpE7-ydDBd8MTPVovqYt0BAMmOzLd0/%3Fsize%3D300/https/cdn.discordapp.com/avatars/947009545731969044/15c048483f9eeb7a46cd0a42a04e54d7.png' });
        interaction.editReply({ embeds: [exampleEmbed] })
    }).catch(err => {
        throw err
    })
  }
}