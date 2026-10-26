const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getHpBase } = require("../funcao/database");
const { criarBarra } = require("../funcao/batalhaInteração");
const inimigos = require("../inimigos");
const { rolarDado, esperar } = require("../utils/dadoUtils");
const { processarTurnoInimigo } = require("../funcao/habilidadesGerais");

module.exports = async function handleInteraction(interaction, batalhas) {
  if (!interaction.isButton()) return;

  const channelId = interaction.channel.id;
  const userId = interaction.user.id;

  if (interaction.customId === "encerrar") {
    if (batalhas[channelId]) delete batalhas[channelId];
    return interaction.reply({ content: "🔄 Luta encerrada!", ephemeral: true });
  }

  const batalha = batalhas[channelId];

  if (inimigos[interaction.customId]) {
    if (batalha) {
      return interaction.reply({ content: "⚠️ Já existe uma batalha ativa neste canal!", ephemeral: true });
    }

    await interaction.deferReply();
    const moduloInimigo = inimigos[interaction.customId];
    await moduloInimigo.iniciar(interaction, batalhas, getHpBase);

    const rowAcoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("lutar").setLabel("⚔️ Lutar").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("fugir").setLabel("🏃 Fugir").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("habilidades").setLabel("✨ Habilidades").setStyle(ButtonStyle.Secondary).setDisabled(true)
    );

    await interaction.editReply({
      content: `⚔️ **Batalha iniciada contra ${moduloInimigo.nome}!**\nEscolha sua ação:`,
      components: [rowAcoes]
    });
    return;
  }

  if (!batalha) {
    return interaction.reply({ content: "❌ Não há luta ativa neste canal!", ephemeral: true });
  }

  if (userId !== batalha.userId) {
    return interaction.reply({ content: "❌ Não é sua luta!", ephemeral: true });
  }

  // ================= FUGIR =================
  if (interaction.customId === "fugir") {
    await interaction.deferUpdate();
    const rollFuga = rolarDado("1d20");

    if (rollFuga >= 12) {
      delete batalhas[channelId];
      return interaction.channel.send(`🎲 Você rolou **${rollFuga}** no 1d20.\n🏃 **Você fugiu com sucesso!**`);
    } else {
      await interaction.channel.send(`🎲 Você rolou **${rollFuga}** no 1d20.\n❌ **Falhou ao tentar fugir!**`);
      return enviarMenuAcoes(interaction.channel);
    }
  }

  // ================= LUTAR =================
  if (interaction.customId === "lutar") {
    await interaction.deferUpdate();
    const channel = interaction.channel;

    const rollPlayerInicial = rolarDado("1d20");

    // Delega o turno do inimigo para o arquivo de habilidades
    const resultadoTurno = await processarTurnoInimigo(channel, batalha, rollPlayerInicial);

    batalha.rollPlayer = resultadoTurno.rollPlayer;
    batalha.rollBot = resultadoTurno.rollBot;

    await resolverTurno(channel, batalha, batalhas);
  }
};

async function resolverTurno(channel, batalha, batalhas) {
  const bot = batalha.rollBot;
  const player = batalha.rollPlayer;

  let texto = "⚔️ **RESULTADO DO TURNO**\n\n";
  texto += `👤 Você\n${criarBarra(batalha.hpPlayer, batalha.hpMaxPlayer)} (${batalha.hpPlayer})\n\n`;
  texto += `👹 ${batalha.inimigo}\n${criarBarra(batalha.hpInimigo, batalha.hpMaxInimigo)} (${batalha.hpInimigo})\n\n`;
  texto += `🎲 ${batalha.inimigo}: ${bot}\n🎲 Você: ${player}\n\n`;

  if (player > bot) {
    batalha.hpInimigo--;
    texto += "⚔️ Você acertou!\n";
  } else if (bot > player && bot > 0) {
    batalha.hpPlayer--;
    texto += "🩸 Você levou dano!\n";
  } else if (player === bot && bot > 0) {
    texto += "⚖️ Empate!\n";
  }

  await channel.send(texto);

  if (batalha.hpPlayer > 0 && batalha.hpInimigo > 0) {
    enviarMenuAcoes(channel);
  } else {
    finalizarBatalha(channel, batalha, batalhas);
  }
}

function enviarMenuAcoes(channel) {
  const rowAcoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("lutar").setLabel("⚔️ Lutar").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("fugir").setLabel("🏃 Fugir").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("habilidades").setLabel("✨ Habilidades").setStyle(ButtonStyle.Secondary).setDisabled(true)
  );

  channel.send({
    content: "Escolha sua próxima ação:",
    components: [rowAcoes]
  });
}

function finalizarBatalha(channel, batalha, batalhas) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("encerrar").setLabel("❌ Encerrar Luta").setStyle(ButtonStyle.Danger)
  );

  delete batalhas[channel.id];

  if (batalha.hpPlayer <= 0) {
    channel.send({ content: "💀 Derrota! Seu HP chegou a zero.", components: [row] });
  } else {
    channel.send({ content: "🏆 Vitória! Você derrotou o inimigo!", components: [row] });
  }
}