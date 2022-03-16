const fs = require('fs');
const { MessageEmbed, Collection } = require('discord.js');
searchCommands = new Collection();

const subCommandFiles = fs.readdirSync('./commands/Music/search').filter(file => file.endsWith('.js'));
for (const file of subCommandFiles) {
	const command = require(`./search/${file}`);
  searchCommands.set(command.name, command);
}

module.exports = {
  type: 'CHAT_INPUT',
  name: 'search',
  description: '讓機器人搜尋指定關鍵字',
  options: [...searchCommands.values()],
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

    const commandName = interaction.options.getSubcommand();

    command = searchCommands.get(commandName);
    if (!command) return interaction.reply({
      content: '找不到這個指令',
      ephemeral: true
    });

    try {
      await command.execute(interaction);
    } catch(err) {
      interaction.reply({
        content: '使用指令時發生錯誤',
        ephemeral: true
      });
      console.log(err);
    }
  }
}
