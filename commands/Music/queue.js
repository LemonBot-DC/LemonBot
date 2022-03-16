const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'queue',
  description: '查看目前隊列',
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

    await interaction.deferReply();

    const manager = interaction.client.music.get(interaction.guild.id)

    const queue = manager.queue
      .map(track => {
        const name = track.title === 'unknown' ? track.audioResource : track.title;
        const url = track.details.from === 'Youtube' ? track.details.data.url : track.audioResource;
        return `[${name}](${url})`;
      });

    if (!queue.length && !manager.isPlaying) {
      res.setDescription('隊列中尚無任何歌曲');
      return interaction.editReply({
        embeds: [res]
      });
    }

    const pages = [];
    const np = interaction.client.music
      .get(interaction.guild.id).nowPlaying

    const nowPlaying = {
      name: np.title === 'unknown' ? np.audioResource : np.title,
      url: np.details.from === 'Youtube' ? np.details.data.url : np.audioResource
    }

    queue.forEach((v, i) => {
      const index = ~~(i/8);
      if(i%8 === 0) pages.push([]);
      pages[index].push(`\` ${twoDigits(i+1)} \` ${v}`);
    });

    if (!pages.length) pages.push([]);

    const pageButtons = {
      home: new MessageButton({
        customId: 'PageButtonHome',
        label: '|<',
        style: 'PRIMARY',
        disabled: true
      }),
      prev: new MessageButton({
        customId: 'PageButtonPrev',
        label: '<',
        style: 'PRIMARY',
        disabled: true
      }),
      exit: new MessageButton({
        customId: 'PageButtonExit',
        label: 'x',
        style: 'DANGER'
      }),
      next: new MessageButton({
        customId: 'PageButtonNext',
        label: '>',
        style: 'PRIMARY',
        disabled: pages.length < 2
      }),
      end: new MessageButton({
        customId: 'PageButtonEnd',
        label: '>|',
        style: 'PRIMARY',
        disabled: pages.length < 2
      })
    }

    let index = 0;

    const row = new MessageActionRow({
      components: Object.values(pageButtons)
    });

    async function filter(i) {
      if (!i.customId.startsWith('PageButton')) return false;
      await i.deferUpdate();

      if (i.user.id !== interaction.user.id) {
        i.followUp({
          content: '您無法使用他人的按鈕',
          ephemeral: true
        });
        return false;
      }
      return true;
    }

    res.setAuthor({ name: `${interaction.client.settings.name} 的音樂中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(`\` >> \` [${nowPlaying.name}](${nowPlaying.url})\n\n${pages[0].join('\n')}`)
      .setFooter({ text: `${interaction.user.tag}・第 ${index+1}/${pages.length} 頁`, iconURL: interaction.user.displayAvatarURL() });

    interaction.editReply({ embeds: [res], components: [row] })
      .then(message => {
        message.createMessageComponentCollector({
          filter: filter,
          idle: 30e3,
          componentType: 'BUTTON'
        }).on('collect', function(i) {
          if (i.customId === 'PageButtonExit') {
            i.followUp({
              content: '清單已關閉',
              ephemeral: true
            });
            this.stop('EXIT');
            return message.delete();
          }

          switch (i.customId) {
            case 'PageButtonHome': index = 0; break;
            case 'PageButtonPrev': index-- ; break;
            case 'PageButtonNext': index++ ; break;
            case 'PageButtonEnd': index = pages.length - 1; break;
          }

          pageButtons.home.setDisabled(index == 0);
          pageButtons.prev.setDisabled(index == 0);
          pageButtons.next.setDisabled(index == pages.length - 1);
          pageButtons.end.setDisabled(index == pages.length - 1);

          res.setDescription(`\` >> \` [${nowPlaying.name}](${nowPlaying.url})\n\n${pages[index].join('\n')}`)
            .setFooter({ text: `${interaction.user.tag}・第 ${index+1}/${pages.length} 頁`, iconURL: interaction.user.displayAvatarURL() });

          const newRow = new MessageActionRow({
            components: Object.values(pageButtons)
          });

          interaction.editReply({ embeds: [res], components: [newRow] });
        }).once('end', (_, reason) => {
          if (reason === 'EXIT') return;
          message.delete().catch(() => {});
          interaction.followUp({
            content: '清單因閒置過久而自動關閉',
            ephemeral: true
          })
        })
      });
  }
}

const twoDigits = num => num < 10 ? `0${num}` : `${num}`;
