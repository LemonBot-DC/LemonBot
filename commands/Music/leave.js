const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'leave',
  description: '離開目前語音頻道',
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

      res.setDescription('機器人不在您的語音頻道內');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    interaction.client.music.leave(interaction.guild.id);
    res.setDescription(`已離開 ${interaction.member.voice.channel.name}`);
    interaction.reply({ embeds: [res] });
  }
}
