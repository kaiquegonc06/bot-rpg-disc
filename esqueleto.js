module.exports = {
  iniciar: async (i, b, getHpBase) => {
    const u = i.user.id;
    const msg = await i.reply({ content: 'Esqueleto!', fetchReply: true });

    b[u] = {
      userId: u,
      inimigo: 'Esqueleto',
      hpPlayer: getHpBase(u),
      hpInimigo: 7,
      rollPlayer: null,
      rollBot: null,
      messageId: msg.id,
      channelId: msg.channel.id
    };

    i.channel.send('!r 1d20');
  }
};
