const bcrypt = require('bcryptjs');

const handleSignin = async (req, res, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(async data => {
      // check if password is correct
      const isMatch = await bcrypt.compare(password, data[0].hash);

      if (isMatch) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          });
      } else {
        res.status(400).json('Name or password is incorrect');
      }
    });
};

module.exports = {
  handleSignin
};
