const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'pause',
  description: '暫停當前撥放音樂',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('目前沒有音樂正在撥放');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    const manager = interaction.client.music.get(interaction.guild.id);

    if (!interaction.member.voice.channel ||
        interaction.member.voice.channel.id !== manager.channel.id) {

      res.setDescription('機器人不在您所在的語音頻道內');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    if (!manager.isPlaying) {
      res.setDescription('目前沒有音樂正在撥放');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    try {
      manager.pause();
      res.setDescription(`${interaction.user}，已暫停播放`);
      interaction.reply({ embeds: [res] });
    } catch(err) {
      if (err.message === 'ALREADY_PAUSED') {
        res.setDescription('目前音樂已經暫停');
        return interaction.reply({ embeds: [res], ephemeral: true });
      }
      throw err;
    }
  }
}
