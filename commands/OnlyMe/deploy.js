const { MessageEmbed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const https = require('https');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'deploy',
  description: '刷新機器人斜線指令',
  async execute(interaction) {
    if (interaction.user.id != "871616467186098187") {
        return interaction.reply('⚡ | 此指令僅供機器人擁有者使用')
    } else {
        await interaction.reply({ content: '🌟 | 已經開始刷新機器人斜線指令', ephemeral: true })
        require('dotenv').config();
        const  { TOKEN } = process.env;
        const rest = new REST({ version: '9' }).setToken(TOKEN);

        const command_type_resolve = {
          "CHAT_INPUT": 1,
          "USER": 2,
          "MESSAGE": 3
        }

        const option_type_resolve = {
          "SUB_COMMAND": 1,
          "SUB_COMMAND_GROUP": 2,
          "STRING": 3,
          "INTEGER": 4,
          "BOOLEAN": 5,
          "USER": 6,
          "CHANNEL": 7,
          "ROLE": 8,
          "MENTIONABLE": 9,
          "NUMBER": 10
        }

        const commands = [];
        const cmdDirs = fs.readdirSync('./commands');

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const dir of cmdDirs) {
            const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
              // 抓取檔案
              const command = require(`../../commands/${dir}/${file}`);
              // 基本資料
              const data = {
                type: command_type_resolve[command.type],
                name: command.name,
                description: command.description
              }

              /***** 如果指令有選項的話 *****/
              if (command.options) {
                // 宣告裝填選項的空陣列
                data.options = [];
                // 製作選項
                makeOptions(data.options, command.options);
              }
              /**/

              // 將資料放入要 request 的陣列中
              commands.push(data);
            }
        }

        const data = JSON.stringify(commands);

        deploy(TOKEN, data);

        async function deploy(token, commandData) {
          // 解出應用程式 id
            const { id } = await getDataByToken(token)
              .catch(err => {
                console.error(err);
                throw err;
              });
            rest.put(
                Routes.applicationCommands(id),
                { body: commands },
            );
          
              // 成功清除指令
              console.log('成功部署指令')
              console.log(`${commands.length} 條斜線指令`)
              console.log('你部署的為全域指令，需等待一小時後才會作用至所有伺服器');

        }

        // get data function
        function getDataByToken(token) {
          // 透過神奇的 Promise 讓我們可以 return callback 中的 listener 中的東西
          return new Promise((resolve, reject) => {
            // request discord api
            https.get('https://discord.com/api/v9/users/@me', {
              headers: {
                Authorization: `Bot ${token}`
              }
            }, res => {
              let data = '';

              res.on('data', chunk => {
                data += chunk;
              });

              res.once('end', () => {
                // 失敗就 reject
                if (res.statusCode !== 200) return reject(JSON.parse(data));
                // 返回資料
                resolve(JSON.parse(data))
              });
            });
          });
        }

        // 解析 option 的函式
        function resolveOptions(option) {
          const data = {
            type: option_type_resolve[option.type],
            name: option.name,
            description: option.description,
            // 以下可能缺項，但 JSON.stringify 會幫我們拿掉
            required: option.required,
            choices: option.choices,
            channel_types: option.channelTypes,
            min_value: option.minValue,
            max_value: option.maxValue,
            autocomplete: option.autocomplete
          }

          return data;
        }

        // 製作 option 的函式
        function makeOptions(container, options) {
          // 遍歷選項
          for (const option of options) {
            // 解出選項
            const option_data = resolveOptions(option);

            // 如果選項還有選項
            if (option.options?.length) {
              // 選項的選項的容器
              option_data.options = [];
              // 透過遞迴把選項加入
              makeOptions(option_data.options, option.options);
            }

            // 將選項放入容器
            container.push(option_data);
          }
        }
    }
  }
}