const sha256 = require('js-sha256');

const handleSignin = (req, res, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const hashedPassEntered = sha256(password);
      console.log(-1, password);
      console.log(-1, data[0].hash);
      console.log(1, hashedPassEntered);
      console.log(2, hashedPassEntered == data[0].hash);
      if (hashedPassEntered == data[0].hash) {
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
