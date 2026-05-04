module.exports = {
  iniciar: async (i, b, getHpBase) => {
    const u = i.user.id;
    const msg = await i.reply({ content: 'Dr Marcus!', fetchReply: true });

    b[u] = {
      userId: u,
      inimigo: 'Dr Marcus',
      hpPlayer: getHpBase(u),
      hpInimigo: 18,
      rollPlayer: null,
      rollBot: null,
      efeitoPeste: false,
      contadorRodadas: 0,
      messageId: msg.id,
      channelId: msg.channel.id
    };

    i.channel.send('!r 2d20');
  }
};
