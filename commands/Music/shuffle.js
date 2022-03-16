const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'shuffle',
  description: '讓隊列隨機排序',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('機器人尚未加入任何語音頻道');
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

    if (!manager.queue.length) {
      res.setDescription('隊列目前沒有任何歌曲');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    manager.queue = manager.queue.sort((a, b) => Math.random() - 0.5);

    res.setDescription('已成功將隊列順序打亂');

    interaction.editReply({
      embeds: [res]
    });

  }
}
