const sha256 = require('js-sha256');

const handleRegister = (req, res, db) => {
  const { email, name, password } = req.body;
  console.log(password);
  const hash = sha256(password);
  console.log(hash);
  db.transaction(trx => {
    // create transaction
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into('login') // insert hash and email into login table
      .returning('email') // return email
      .then(loginEmail => {
        return trx('users') // then using loginEmail return another trx transaction to insert into users
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            // respond with json
            res.json(user[0]);
          });
      })
      .then(trx.commit) // must commit trx to add it
      .catch(trx.rollback); // catch error
  }).catch(err => res.status(400).json('unable to register'));
};

module.exports = {
  handleRegister
};
