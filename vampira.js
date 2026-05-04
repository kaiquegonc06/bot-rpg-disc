module.exports = {
  iniciar: async (i, b, getHpBase) => {
    const u = i.user.id;
    const msg = await i.reply({ content: 'Vampira!', fetchReply: true });

    b[u] = {
      userId: u,
      inimigo: 'Vampira',
      hpPlayer: getHpBase(u),
      hpInimigo: 20,
      rollPlayer: null,
      rollBot: null,
      messageId: msg.id,
      channelId: msg.channel.id
    };

    i.channel.send('!r 2d20');
  }
};
