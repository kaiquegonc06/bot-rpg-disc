module.exports = {
  nome: "Goblin",
  hpMax: 5,
  comandoRollBot: "!r 1d20",
  iniciar: async (interaction, batalhas, getHpBase) => {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    batalhas[channelId] = {
      userId,
      channelId,
      inimigo: "Goblin",
      hpPlayer: getHpBase(userId),
      hpMaxPlayer: getHpBase(userId),
      hpInimigo: 5,
      hpMaxInimigo: 5,
      rollPlayer: null,
      rollBot: null,
      aguardandoRoll: null,
      tipoAcao: null
    };
  }
};