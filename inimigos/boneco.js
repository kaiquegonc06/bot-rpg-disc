module.exports = {
  nome: "Boneco",
  hpMax: 8,
  comandoRollBot: "!r 1d20",
  rolagemFixa: 0, // Flag para zerar a rolagem
  iniciar: async (interaction, batalhas, getHpBase) => {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    batalhas[channelId] = {
      userId,
      channelId,
      inimigo: "Boneco",
      hpPlayer: getHpBase(userId),
      hpMaxPlayer: getHpBase(userId),
      hpInimigo: 8,
      hpMaxInimigo: 8,
      rollPlayer: null,
      rollBot: null,
      aguardandoRoll: null,
      tipoAcao: null
    };
  }
};