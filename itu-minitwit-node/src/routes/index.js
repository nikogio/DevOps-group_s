var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

/**
 * GET /
 *
 * Checks whether the user is logged in.
 * If not logged in, retrieves most recent messages from the database and returns them (public timeline).
 * If logged in, retrieves most recent messages (follower and own) from the database and returns them.
 * 
 * Errors:
 *  - 500: An error occurred while retrieving the message
 */


// TODO: Switch to "personal" timeline if logged in. Currently only shows public timeline. 
router.get('/', function(req, res, next) {
    const flash = req.session.flash;
    delete req.session.flash;
    database.all("select message.*, user.* from message, user \
                where message.flagged = 0 \
                and message.author_id = user.user_id \
                order by message.pub_date desc limit 30"
    , [], (err, rows) => {

    if (err) {
      console.error(err);
      res.status(500).render('error');
      return;
    }
    
    console.log('Successfully retrieved ' + rows.length + ' messages');
    res.render('index', { messages: rows , flash: flash});
    });
});


router.post('/register', function(req, res, next) {

    res.render('test', { title: 'MiniTwit', messages: "test" });
});

module.exports = router;