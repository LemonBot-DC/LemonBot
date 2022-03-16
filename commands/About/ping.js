module.exports = {
  type: 'CHAT_INPUT',
  name: 'ping',
  description: '查看目前機器人延遲',
  async execute(interaction) {
    const msg = await interaction.reply({ content: '🔄｜計算中......', fetchReply: true })
    const ping = msg.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(`ℹ️｜機器人延遲為 ${ping}ms，API 延遲為 ${interaction.client.ws.ping}ms`);
  }
}
