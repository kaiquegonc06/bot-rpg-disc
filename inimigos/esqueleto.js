module.exports = {
  nome: "Esqueleto",
  hpMax: 7,
  comandoRollBot: "!r 1d20",
  iniciar: async (interaction, batalhas, getHpBase) => {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    batalhas[channelId] = {
      userId,
      channelId,
      inimigo: "Esqueleto",
      hpPlayer: getHpBase(userId),
      hpMaxPlayer: getHpBase(userId),
      hpInimigo: 7,
      hpMaxInimigo: 7,
      rollPlayer: null,
      rollBot: null,
      aguardandoRoll: null,
      tipoAcao: null
    };
  }
};