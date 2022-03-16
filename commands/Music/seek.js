const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'seek',
  description: '讓當前撥放歌曲跳到指定時間',
  options: [{
    type: 'INTEGER',
    name: '分',
    description: '分鐘數'
  }, {
    type: 'INTEGER',
    name: '秒',
    description: '秒數'
  }],
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

    if (!manager.isPlaying) {
      res.setDescription('當前沒有任何歌曲正在播放');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    const minute = interaction.options.getInteger('分') ?? 0;
    const second = interaction.options.getInteger('秒') ?? 0;

    if (second > 60 || second < 0 || minute < 0) {
      res.setDescription('請輸入有效數字');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    try {
      manager.seek((minute*60+second)*1000);
      res.setDescription(`已跳至 ${minute > 0 ? `${minute} 分 ` : ''}${second} 秒`);
      return interaction.editReply({
        embeds: [res]
      });
    } catch(err) {
      if (err.message === 'INVALID_SEEK_TIME') {
        res.setDescription('此歌曲無此段落');
        return interaction.editReply({ embeds: [res] });
      }
      throw err;
    }
  }
}
