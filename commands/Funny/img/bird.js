const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'bird',
  description: '隨機獲得一張鳥類圖片',
  async execute(interaction) {
    
    request('https://some-random-api.ml/img/bird', async function (error, body) {
        let result = JSON.parse(body.body);
        const res = new MessageEmbed()
            .setAuthor({ name: '隨機鳥類圖片', iconURL: interaction.client.user.displayAvatarURL() })
            .setColor('#FFFACD')
        	.setImage(`${result.link}`);
    	interaction.reply({ embeds: [res] });
    })
  }
}
