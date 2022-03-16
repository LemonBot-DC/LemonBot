const fs = require('fs');
const { MessageEmbed, Collection } = require('discord.js');
imgCommands = new Collection();

const subCommandFiles = fs.readdirSync('./commands/Funny/img').filter(file => file.endsWith('.js'));
for (const file of subCommandFiles) {
	const command = require(`./img/${file}`);
  imgCommands.set(command.name, command);
}

module.exports = {
  type: 'CHAT_INPUT',
  name: 'img',
  description: '獲得指定類別的隨機圖片',
  options: [...imgCommands.values()],
  async execute(interaction) {
    const commandName = interaction.options.getSubcommand();

    command = imgCommands.get(commandName);
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
