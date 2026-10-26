module.exports = {
  nome: "Dr Marcus",
  hpMax: 18,
  comandoRollBot: "!r 2d20", // Dr Marcus usa 2d20!
  iniciar: async (interaction, batalhas, getHpBase) => {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    batalhas[channelId] = {
      userId,
      channelId,
      inimigo: "Dr Marcus",
      hpPlayer: getHpBase(userId),
      hpMaxPlayer: getHpBase(userId),
      hpInimigo: 18,
      hpMaxInimigo: 18,
      efeitoPeste: false,
      contadorRodadas: 0,
      rollPlayer: null,
      rollBot: null,
      aguardandoRoll: null,
      tipoAcao: null
    };
  }
};