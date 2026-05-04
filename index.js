// ================= INICIO =================
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = "tocken super secreto";
const ROLLEM_ID = "240732567744151553";

let batalhas = {};
let batalhaAtiva = null;
let jogadores = {};

const HP_MIN = 5;
const HP_MAX = 20;

// ================= JSON =================

function carregarDados() {
  if (fs.existsSync("jogadores.json")) {
    jogadores = JSON.parse(fs.readFileSync("jogadores.json"));
  }
}
carregarDados();

function salvarDados() {
  fs.writeFileSync("jogadores.json", JSON.stringify(jogadores, null, 2));
}

function getHpBase(userId) {
  if (!jogadores[userId]) {
    jogadores[userId] = { hpBase: 10 };
    salvarDados();
  }
  return jogadores[userId].hpBase;
}

// ================= DADOS DO BOT (PARTE RANDOM DO D20 DENTRO DO BOT) =================

function d20() {
  return Math.floor(Math.random() * 20) + 1;
}

// ================= BARRA DE VIDA =================

function criarBarra(hpAtual, hpMax) {
  const total = 10;
  const cheios = Math.round((hpAtual / hpMax) * total);
  const vazios = total - cheios;
  return '🟩'.repeat(cheios) + '🟥'.repeat(vazios);
}

// ================= BOT ONLINE =================

client.once("clientReady", () => {
  console.log("Bot online como ${client.user.tag}");
});

// ================= COMANDO =================

client.on("messageCreate", async (message) => {

  // ignora outros bots (exceto Rollem)
  if (message.author.bot && message.author.id !== ROLLEM_ID) return;

  // comando batalha
  if (message.content === '!batalha") {

    if (batalhaAtiva) {
      return message.reply("⚠️ Já existe uma batalha em andamento!");
    }

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("boneco").setLabel("🪵 Boneco").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("goblin").setLabel("🟢 Goblin").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("esqueleto").setLabel("💀 Esqueleto").setStyle(ButtonStyle.Secondary),
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

  // ================= ROLLEM =================

  if (message.author.id === ROLLEM_ID) {

    message.channel.id === batalhaAtiva.channelId

    const match = message.content.match(/\[(\d+)\]/);
if (!match) return;

const resultado = parseInt(match[1]);

    if (!batalhaAtiva) return;
    if (!batalhaAtiva.aguardandoRoll) return;

    batalhaAtiva.rollPlayer = resultado;
    batalhaAtiva.aguardandoRoll = false;

    if (batalhaAtiva.tipoAcao === "fugir") {
      return tentarFugir(message.channel, batalhaAtiva);
    }

    await resolverTurno(message.channel, batalhaAtiva);
  }
});

// ================= BOTÕES =================

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;

  // ENCERRAR
  if (interaction.customId === "encerrar") {
    batalhaAtiva = null;
    return interaction.reply({ content: "🔄 Luta encerrada!", ephemeral: true });
  }

  if (!batalhaAtiva) return;

  if (interaction.user.id !== batalhaAtiva.userId) {
    return interaction.reply({ content: "❌ Não é sua luta!", ephemeral: true });
  }

  // ================= ATACAR =================
  if (interaction.customId === "atacar") {
    batalhaAtiva.tipoAcao = "atacar";
    batalhaAtiva.aguardandoRoll = true;

    return interaction.reply("🎲 Role **1d20** para atacar!");
  }

  // ================= FUGIR =================
  if (interaction.customId === "fugir") {
    batalhaAtiva.tipoAcao = "fugir";
    batalhaAtiva.aguardandoRoll = true;

    return interaction.reply("🏃 Role **1d20** para tentar fugir!");
  }

  // ================= INICIAR BATALHA =================
  const inimigos = {
    boneco: { nome: "Boneco", hp: 8 },
    goblin: { nome: "Goblin", hp: 5 },
    esqueleto: { nome: "Esqueleto", hp: 7 },
    dragao: { nome: "Dragão", hp: 15 },
    vampira: { nome: "Vampira", hp: 20 },
    drmarcus: { nome: "Dr Marcus", hp: 18 }
  };

  channelId: interaction.channel.id

  const inimigo = inimigos[interaction.customId];

  batalhaAtiva = {
    userId,
    inimigo: inimigo.nome,
    hpPlayer: getHpBase(userId),
    hpMaxPlayer: getHpBase(userId),
    hpInimigo: inimigo.hp,
    hpMaxInimigo: inimigo.hp,
    aguardandoRoll: false,
    tipoAcao: null
  };

  await interaction.reply("⚔️ Lutando contra ${inimigo.nome}");
  iniciarTurno(interaction.channel, batalhaAtiva);
});

// ================= TURNO =================

async function iniciarTurno(channel, batalha) {

  batalha.rollBot = d20();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("atacar").setLabel("⚔️ Atacar").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("fugir").setLabel("🏃 Fugir").setStyle(ButtonStyle.Secondary)
  );

  await channel.send({
    content: "🎲 ${batalha.inimigo} rolou: **${batalha.rollBot}**",
    components: [row]
  });
}

// ================= FUGIR =================

async function tentarFugir(channel, batalha) {

  const roll = batalha.rollPlayer;

  if (roll >= 15) {
    batalhaAtiva = null;
    return channel.send("🏃 **Você fugiu com sucesso!**");
  } else {
    await channel.send("❌ Falhou ao fugir!");
    iniciarTurno(channel, batalha);
  }
}

// ================= RESOLVER (ALCULO DO D20 PRA SABER SE É MAIOR OU MENOR) =================

async function resolverTurno(channel, batalha) {

  const bot = batalha.rollBot;
  const player = batalha.rollPlayer;

  let texto = "⚔️ **BATALHA**\n\n";

  texto += "👤 Você\n${criarBarra(batalha.hpPlayer, batalha.hpMaxPlayer)} (${batalha.hpPlayer})\n\n";
  texto += "👹 ${batalha.inimigo}\n${criarBarra(batalha.hpInimigo, batalha.hpMaxInimigo)} (${batalha.hpInimigo})\n\n";

  texto += "🎲 Inimigo: ${bot}\n🎲 Você: ${player}\n\n";

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
    iniciarTurno(channel, batalha);
  } else {
    finalizarBatalha(channel, batalha);
  }
}

// ================= FINAL =================

function finalizarBatalha(channel, batalha) {

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("encerrar")
      .setLabel("❌ Encerrar Luta")
      .setStyle(ButtonStyle.Danger)
  );

  batalhaAtiva = null;

  if (batalha.hpPlayer <= 0) {
    channel.send({ content: "💀 Derrota!", components: [row] });
  } else {
    channel.send({ content: "🏆 Vitória!", components: [row] });
  }
}

client.login(TOKEN);
