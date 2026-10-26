module.exports = {
  nome: "Dragão",
  hpMax: 15,
  comandoRollBot: "!r 1d20",
  iniciar: async (interaction, batalhas, getHpBase) => {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    batalhas[channelId] = {
      userId,
      channelId,
      inimigo: "Dragão",
      hpPlayer: getHpBase(userId),
      hpMaxPlayer: getHpBase(userId),
      hpInimigo: 15,
      hpMaxInimigo: 15,
      rollPlayer: null,
      rollBot: null,
      aguardandoRoll: null,
      tipoAcao: null
    };
  }
};