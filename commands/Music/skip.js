const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'skip',
  description: '跳過當前撥放歌曲',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('機器人不在任何語音頻道內');
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

    try {
      manager.skip();
      res.setDescription(`已跳過當前撥放歌曲`);
      interaction.reply({ embeds: [res] });
    } catch(err) {
      if (err.message === 'NO_RESOURCES_PLAYING') {
        res.setDescription('當前沒有歌曲正在撥放');
        return interaction.reply({ embeds: [res], ephemeral: true });
      }
      throw err;
    }
  }
}
