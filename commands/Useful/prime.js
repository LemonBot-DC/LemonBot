const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'prime',
  description: '讓機器人偵測指定數字是否為質數', 
  options: [{
    type: 'INTEGER',
    name: '數字',
    description: '要讓機器人偵測的數字',
    required: true
  }],
  async execute(interaction) {
    const what = interaction.options.getInteger('數字');
    function isPrime(num) {
        const t = parseInt(Math.sqrt(num));
        for (let i = 2; i <= t; i++) {
            if (num % i == 0 && !num <= 1) {
                return false;
            }
        }
        return true;
    }
    if (what <= 0) {
    	return await interaction.reply('📠 | 請輸入一個正整數');
    } else if (what <= 1) {
    	return await interaction.reply(`🟡 | ${what} 不是質數也不是合數`);
    } else if (isPrime(what) == true) {
    	return await interaction.reply(`🟢 | ${what} 是一個質數`);
    } else {
    	return await interaction.reply(`🔴 | ${what} 不是一個質數`);
    }
  }
}