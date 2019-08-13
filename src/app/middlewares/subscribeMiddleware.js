const Opsub = require('../models/openSub');

module.exports = async (req, res, next) => {
  const { from, until } = await Opsub.findOne({ unique: true });
  const date = new Date();

  if (date >= Date.parse(from) && date < Date.parse(until)) {
    return next();
  }
  return res.status(400).send({ error: 'Incrições fechadas' });
};
