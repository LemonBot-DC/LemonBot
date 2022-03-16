const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    type: 'CHAT_INPUT',
    name: 'help',
    description: '機器人的指令列表',
    options: [{
        type: 'STRING',
        name: '指令名稱',
        description: '可以選擇特定指令以知用法',
        autocomplete: true,
    }],
    async execute(interaction) {
        const name = interaction.options.getString('指令名稱');
        const res = new MessageEmbed()
            .setAuthor({
                name: `${interaction.client.settings.name} 幫助中心`,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setColor(0xE4FFF6);
        
        if (!name) {
            const namelist = interaction.client.commands
                .filter(command => {
                    return command.type === 'CHAT_INPUT';
                })
                .map(command => {
                    return `${command.name}`;
                });
            const declist = interaction.client.commands
                .filter(command => {
                    return command.type === 'CHAT_INPUT';
                })
                .map(command => {
                    return `${command.description}`;
                });
            
            let res = new MessageEmbed()
                .setAuthor('指令中心', interaction.client.user.displayAvatarURL())
                .setColor(0xE4FFF6);
            
            await interaction.deferReply();
            
            const pages = Math.ceil((namelist.length - 1) / 8);
            
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
            const sButtons = {
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
                    style: 'DANGER',
                    disabled: true
                }),
                next: new MessageButton({
                    customId: 'PageButtonNext',
                    label: '>',
                    style: 'PRIMARY',
                    disabled: true
                }),
                end: new MessageButton({
                    customId: 'PageButtonEnd',
                    label: '>|',
                    style: 'PRIMARY',
                    disabled: true
                })
            }
            
            let index = 1;
            
            const row = new MessageActionRow({
                components: Object.values(pageButtons)
            });
            const srow = new MessageActionRow({
                components: Object.values(sButtons)
            });
            
            async function filter(i) {
                if (!i.customId.startsWith('PageButton')) return false;
                await i.deferUpdate();
                return true;
            }
            
            res = new MessageEmbed()
                .setAuthor('指令列表', interaction.client.user.displayAvatarURL())
                .setDescription("機器人的指令列表")
                .setFooter(`${interaction.user.tag}・第 ${index}/${pages} 頁`, interaction.user.displayAvatarURL())
            if (index == pages) {
                for (var i = 1; i < namelist.length % 8; i++) {
                    res.addFields({
                        name: `${namelist[index*8-8+i]}`,
                        value: `${declist[index*8-8+i]}`
                    });
                }
            } else {
                for (var i = 8; i >= 1; i--) {
                    res.addFields({
                        name: `${namelist[index*8-i]}`,
                        value: `${declist[index*8-i]}`
                    });
                }
            }
            
            interaction.editReply({
                    embeds: [res],
                    components: [row]
                })
                .then(message => {
                    message.createMessageComponentCollector({
                        filter: filter,
                        idle: 30e3,
                        componentType: 'BUTTON'
                    }).on('collect', function(i) {
                        if (i.customId === 'PageButtonExit') {
                            this.stop('EXIT');
                            return interaction.editReply({
                                embeds: [res],
                                components: [srow]
                            })
                        }
                        
                        switch (i.customId) {
                            case 'PageButtonHome':
                                index = 1;
                                break;
                            case 'PageButtonPrev':
                                index--;
                                break;
                            case 'PageButtonNext':
                                index++;
                                break;
                            case 'PageButtonEnd':
                                index = pages;
                                break;
                        }
                        
                        pageButtons.home.setDisabled(index == 1);
                        pageButtons.prev.setDisabled(index == 1);
                        pageButtons.next.setDisabled(index == pages);
                        pageButtons.end.setDisabled(index == pages);
                        
                        res = new MessageEmbed()
                            .setAuthor('指令列表', interaction.client.user.displayAvatarURL())
                            .setDescription("機器人的指令列表")
                            .setFooter(`${interaction.user.tag}・第 ${index}/${pages} 頁`, interaction.user.displayAvatarURL())
                        if (index == pages) {
                            for (var i = 1; i < namelist.length % 8; i++) {
                                res.addFields({
                                    name: `${namelist[index*8-8+i]}`,
                                    value: `${declist[index*8-8+i]}`
                                });
                            }
                        } else {
                            for (var i = 8; i >= 1; i--) {
                                res.addFields({
                                    name: `${namelist[index*8-i]}`,
                                    value: `${declist[index*8-i]}`
                                });
                            }
                        }
                        
                        const newRow = new MessageActionRow({
                            components: Object.values(pageButtons)
                        });
                        
                        interaction.editReply({
                            embeds: [res],
                            components: [newRow]
                        });
                    }).once('end', (_, reason) => {
                        if (reason === 'EXIT') return;
                        interaction.editReply({
                            embeds: [res],
                            components: [srow]
                        }).catch(() => {});
                    })
                });
        } else {
            await interaction.deferReply();
            const command = interaction.client.commands.get(name);
            if (!command) {
                res.setDescription('沒有這個指令');
                return interaction.editReply({
                    embeds: [res]
                });
            }

            res.addFields({
                name: '指令名稱',
                value: command.name
            }, {
                name: '說明',
                value: command.description
            });

            interaction.editReply({
                embeds: [res]
            });
        }
    }
}

