const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'yes-no',
  description: '詢問一個是非問題並得到答案', 
  options: [{
    type: 'STRING',
    name: '問題',
    description: '要詢問的問題',
    required: true
  }],
  async execute(interaction) {
    const yesno = [
        '💗 | Yes，去做這件事吧，想必一定會有好的結果！',
        '💗 | Yes，雖然可能會有不好的結果，但......Just Do It！',
        '💗 | Yes，一開始也許會有壞的結果，但會倒吃甘蔗，漸入佳境。',
        '💦 | No，你要確定要做哦，先考慮一下會有什麼後果吧！',
        '💦 | No，或許會有好的結果，但是終究會持續不久......',
        '💦 | No，雖然會有好的結果，但是再考慮一下吧 ~',
        '🪐 | Hm，我不太確定應該怎麼做，但你可以再問一次......',
    ];
    function RandArray(array, que){
        let rand = Math.random()*array.length | 0;
        let rValue = array[rand];
        return rValue;
    }
    /* 在此祈求所有問題都能得到最佳的答案，2022/02/14留 */
    const content = interaction.options.getString('問題');
    interaction.reply(`${RandArray(yesno, content)}`)
  }
}