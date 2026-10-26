const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "batalha",
  execute(message, args, batalhas) {
    const channelId = message.channel.id;
    if (batalhas[channelId]) {
      return message.reply("⚠️ Já existe uma batalha em andamento neste canal!");
    }

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("boneco").setLabel("🪵 Boneco").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("goblin").setLabel("🟢 Goblin").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("esqueleto").setLabel("💀 Esqueleto").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("dragao").setLabel("🔥 Dragão").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("vampira").setLabel("🩸 Vampira").setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("drmarcus").setLabel("☣️ Dr Marcus").setStyle(ButtonStyle.Danger)
    );

    message.reply({
      content: "⚔️ Escolha seu inimigo:",
      components: [row1, row2]
    });
  }
};