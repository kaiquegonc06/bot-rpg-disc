const { rolarDado, esperar } = require("../utils/dadoUtils");

async function processarTurnoInimigo(channel, batalha, rollPlayer) {
  let rollBot = 0;
  let textoNarrativa = "";

  if (batalha.inimigo === "Vampira") {
    await channel.send("🦇 *Turno da Vampira... Analisando os movimentos!*");
    await esperar(1200);

    const decisao = rolarDado("1d2");

    if (decisao === 1) {
      await channel.send("🦇 *A Vampira decidiu usar **Ataque Normal**!*");
      rollBot = rolarDado("1d20");
      await esperar(800);
    } else {
      await channel.send("🦇 *A Vampira decidiu usar **Ataque Especial**...*");
      await esperar(1200);

      const escolhaHabilidade = rolarDado("1d2");
      const testeAtivacao = rolarDado("1d2");

      if (escolhaHabilidade === 1) {
        await channel.send("💃 *A Vampira preparou a habilidade **Dança**!*");
        await esperar(1200);

        if (testeAtivacao < 2) {
          await channel.send("❌ *A Vampira se atrapalhou na Dança e perdeu o turno!*");
          rollBot = 0;
        } else {
          await channel.send("✨ *A Dança te hipnotizou! Você ficou desorientado e perdeu o turno!*");
          rollPlayer = 0; // Zera o roll do player para ele perder a vez
          rollBot = 0;
        }
      } else {
        await channel.send("🩸 *A Vampira preparou o ataque de **Sangue**!*");
        await esperar(1200);

        if (testeAtivacao < 2) {
          await channel.send("❌ *O ataque de Sangue falhou e a Vampira perdeu o turno!*");
          rollBot = 0;
        } else {
          await channel.send("🩸 *O Ataque de Sangue drenou 1 do seu HP diretamente!*");
          batalha.hpPlayer -= 1;
          rollBot = 0;
        }
      }
      await esperar(800);
    }
  } else if (batalha.inimigo === "Boneco") {
    rollBot = 0;
  } else {
    // Para outros inimigos genéricos
    rollBot = rolarDado("1d20");
  }

  return { rollPlayer, rollBot };
}

module.exports = { processarTurnoInimigo }; 