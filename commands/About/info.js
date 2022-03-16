const fs = require('fs');
const { MessageEmbed, Collection } = require('discord.js');
infoCommands = new Collection();

const subCommandFiles = fs.readdirSync('./commands/About/info').filter(file => file.endsWith('.js'));
for (const file of subCommandFiles) {
	const command = require(`./info/${file}`);
  infoCommands.set(command.name, command);
}

module.exports = {
  type: 'CHAT_INPUT',
  name: 'info',
  description: '獲得機器人或成員或伺服器資訊',
  options: [...infoCommands.values()],
  async execute(interaction) {
    const commandName = interaction.options.getSubcommand();

    command = infoCommands.get(commandName);
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
