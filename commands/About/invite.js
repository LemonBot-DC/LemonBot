module.exports = {
  type: 'CHAT_INPUT',
  name: 'invite',
  description: '獲取機器人邀請連結',
  async execute(interaction) {
    interaction.reply('點擊[此連結](https://discord.com/api/oauth2/authorize?client_id=947009545731969044&permissions=8&scope=bot%20applications.commands)以邀請機器人進入您的伺服器');
  }
}
