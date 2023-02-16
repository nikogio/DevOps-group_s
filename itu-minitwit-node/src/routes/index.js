var express = require('express');
var router = express.Router();

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

router.get('/', function(req, res, next) {
  if(req.params.session.user_id == null){ // if not logged in 

    database.all("select message.*, user.* from message, user \
                where message.flagged = 0 \
                and message.author_id = user.user_id \
                order by message.pub_date desc limit ?"
    , [PER_PAGE], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).render('error');
      return;
    }

    console.log('Successfully retrieved ' + rows.length + ' messages');
    res.render('index', { title: 'ITU-MiniTwit-App' });
    });

  } else { // if logged in 

    database.all("select message.*, user.* from message, user \
                  where message.flagged = 0 \
                  and message.author_id = user.user_id \
                  and ( user.user_id = ? or user.user_id \
                    in (select whom_id from follower \
                    where who_id = ?)) \
                  order by message.pub_date desc limit ?"
    , [PER_PAGE], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).render('error');
      return;
    }

    console.log('Successfully retrieved ' + rows.length + ' messages');
    res.render('index', { title: 'ITU-MiniTwit-App' });
    });

  }
});


module.exports = router;