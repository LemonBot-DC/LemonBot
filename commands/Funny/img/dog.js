const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'dog',
  description: '隨機獲得一張狗的圖片',
  async execute(interaction) {
    
    request('https://some-random-api.ml/img/dog', async function (error, body) {
        let result = JSON.parse(body.body);
        const res = new MessageEmbed()
            .setAuthor({ name: '隨機狗的圖片', iconURL: interaction.client.user.displayAvatarURL() })
            .setColor('#FFFACD')
        	.setImage(`${result.link}`);
    	interaction.reply({ embeds: [res] });
    })
  }
}
