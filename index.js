const { Client, GatewayIntentBits } = require("discord.js");

// Importação dos handlers e comandos
const handleInteraction = require("./interacao/interactionHandler");
const handleRollem = require("./interacao/rollemHandler");
const batalhaCommand = require("./comandos/batalha");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;

// Objeto que armazena todas as batalhas ativas divididas por canal
let batalhas = {}; 

client.once("clientReady", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// Escutador de Mensagens (Comandos e Rollem)
client.on("messageCreate", async (message) => {
  // 1. Passa as mensagens para o RollemHandler verificar se veio do Rollem
  await handleRollem(message, batalhas);

  // 2. Comando !batalha para iniciar o jogo
  if (message.content === "!batalha") {
    batalhaCommand.execute(message, [], batalhas);
  }
});

// Escutador de Interações (Cliques nos Botões)
client.on("interactionCreate", async (interaction) => {
  await handleInteraction(interaction, batalhas);
});

client.login(TOKEN);