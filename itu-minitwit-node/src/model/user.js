const database = require('../db/dbService')

// Get all users
const getAllUsers = async () => {
  
  database.all("SELECT * FROM user", [], (err, rows) => {
    return rows;
  })
}

module.exports = getAllUsers