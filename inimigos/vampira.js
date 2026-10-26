module.exports = {
  nome: "Vampira",
  hpMax: 20,
  comandoRollBot: "1d20", // Atualizado para 1d20
  
  iniciar: async (interaction, batalhas, getHpBase) => {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    batalhas[channelId] = {
      userId,
      channelId,
      inimigo: "Vampira",
      hpPlayer: getHpBase(userId),
      hpMaxPlayer: getHpBase(userId),
      hpInimigo: 20,
      hpMaxInimigo: 20,
      rollPlayer: null,
      rollBot: null,
      aguardandoRoll: null,
      tipoAcao: null
    };
  }
};