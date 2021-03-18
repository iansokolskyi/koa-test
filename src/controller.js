async function profile(ctx) {
  await ctx.render('index', { name: 'Stella' });
}

module.exports = {
  profile,
};
