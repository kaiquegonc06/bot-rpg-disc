const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { criarBarra } = require("../funcao/batalhaInteração");

const ROLLEM_ID = "240732567744151553";

module.exports = async function handleRollem(message, batalhas) {
  if (message.author.id !== ROLLEM_ID) return;

  const channelId = message.channel.id;
  const batalha = batalhas[channelId];

  if (!batalha || !batalha.aguardandoRoll) return;

  // CORREÇÃO DO BUG DO 20: Captura números mesmo com negrito [**20**] do Rollem
  const match = message.content.match(/\[\*?\*?(\d+)\*?\*?\]/);
  if (!match) return;
  const resultado = parseInt(match[1]);

  // Se escolheu FUGIR
  if (batalha.tipoAcao === "fugir") {
    batalha.rollPlayer = resultado;
    batalha.aguardandoRoll = null;
    return tentarFugir(message.channel, batalha, batalhas);
  }

  // Se escolheu LUTAR (Ordem: Inimigo -> Jogador)
  if (batalha.tipoAcao === "lutar") {
    
    // 1. Recebeu o roll do inimigo
    if (batalha.aguardandoRoll === "inimigo") {
      // MELHORIA BONECO: Se for o Boneco, o resultado da rolagem passa a ser sempre 0!
      batalha.rollBot = (batalha.inimigo === "Boneco") ? 0 : resultado;
      batalha.aguardandoRoll = "player";

      return message.channel.send(`🎲 Inimigo (**${batalha.inimigo}**) rolou: **${batalha.rollBot}**\nAgora, peça para o Rollem rolar o seu **1d20** (**Jogador**) no chat!`);
    }

    // 2. Recebeu o roll do jogador
    if (batalha.aguardandoRoll === "player") {
      batalha.rollPlayer = resultado;
      batalha.aguardandoRoll = null;

      await resolverTurno(message.channel, batalha, batalhas);
    }
  }
};

async function tentarFugir(channel, batalha, batalhas) {
  if (batalha.rollPlayer >= 15) {
    delete batalhas[channel.id];
    return channel.send("🏃 **Você fugiu com sucesso!**");
  } else {
    await channel.send("❌ Falhou ao fugir!");
    enviarMenuAcoes(channel, batalha);
  }
}

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
  } else if (bot > player) {
    batalha.hpPlayer--;
    texto += "🩸 Você levou dano!\n";
  } else {
    texto += "⚖️ Empate!\n";
  }

  await channel.send(texto);

  if (batalha.hpPlayer > 0 && batalha.hpInimigo > 0) {
    enviarMenuAcoes(channel, batalha);
  } else {
    finalizarBatalha(channel, batalha, batalhas);
  }
}

function enviarMenuAcoes(channel, batalha) {
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
    channel.send({ content: "💀 Derrota!", components: [row] });
  } else {
    channel.send({ content: "🏆 Vitória!", components: [row] });
  }
}