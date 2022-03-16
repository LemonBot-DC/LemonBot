const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'remove',
  description: '移除隊列中指定區間的歌曲',
  options: [{
    type: 'INTEGER',
    name: '開頭',
    description: '移除的區間的開頭歌曲編號',
    required: true
  }, {
    type: 'INTEGER',
    name: '結尾',
    description: '移除的區間的結尾歌曲編號'
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

    if(!manager.queue.length) {
      res.setDescription('隊列裡沒有任何音樂')
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      })
    }

    await interaction.deferReply();

    const start = interaction.options.getInteger('開頭');
    let end = interaction.options.getInteger('結尾') ?? start;

    if (end < start) {
      res.setDescription('區間開頭應小於區間結尾數字');
      return interaction.editReply({ embeds: [res] });
    }

    if (start < 1 || end < 0) {
      res.setDescription('區間開頭不得小於一且區間結尾不得小於零');
      return interaction.editReply({ embeds: [res] });
    }

    if (start > manager.queue.length) {
      res.setDescription('清單上沒有此歌曲編號');
      return interaction.editReply({ embeds: [res] });
    }

    if (end > manager.queue.length) {
      end = manager.queue.length;
    }

    manager.queue.splice(start-1, end-start+1);
    res.setDescription(`${interaction.user}，已移除編號在 ${start} 到 ${end} 之間的所有歌曲`);
    if(start === end)
      res.setDescription(`${interaction.user}，已移除編號為 ${start} 的歌曲`);

    interaction.editReply({ embeds: [res] });
  }
}
