const fs = require('fs');
const { MessageEmbed, Collection } = require('discord.js');
volumeCommands = new Collection();

const subCommandFiles = fs.readdirSync('./commands/Music/volume').filter(file => file.endsWith('.js'));
for (const file of subCommandFiles) {
	const command = require(`./volume/${file}`);
  volumeCommands.set(command.name, command);
}

module.exports = {
  type: 'CHAT_INPUT',
  name: 'volume',
  description: '調整音樂撥放音量',
  options: [...volumeCommands.values()],
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
      res.setDescription('目前沒有音樂正在播放');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      })
    }

    const commandName = interaction.options.getSubcommand();

    command = volumeCommands.get(commandName);
    if (!command) return interaction.reply({
      content: '找不到指令',
      ephemeral: true
    });

    try {
      await command.execute(interaction);
    } catch(err) {
      interaction.reply({
        content: '出現錯誤',
        ephemeral: true
      });
      console.log(err);
    }
  }
}
