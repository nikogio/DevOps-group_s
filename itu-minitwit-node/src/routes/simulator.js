var express = require('express');
var router = express.Router();

const isSimulator = require('../utils/authorizationValidator');
const hash = require('../utils/hash')

const database = require('../db/dbService')

const LatestService = require('../services/LatestService');
const latestService = new LatestService();

const getAllUsers = require('../model/user')


router.get('/latest', function (req, res, next) {
  res.send({ latest: latestService.getLatest() });
})

router.post("/register", async function (req, res, next) {
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.pwd;

    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: "You are not authorized to use this resource!" });
      return;
    }

    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && parseInt(latest) !== NaN) {
      latestService.updateLatest(parseInt(latest));
    }

    //Checks if username is taken
    const users = await getAllUsers()
    const userFound = users.find(user => user.username == username)

    var error = null
    if (username === null) {
      error = "You have to enter a username";
    } else if (email === null || email.indexOf("@") === -1) {
      error = error + ". You have to enter a valid email address"
    } else if (password === null) {
      error = error + ". You have to enter a password"
    } else if (userFound !== undefined) {
      error = error + ". The username is already taken"
    }

    if (error === null) {
      const body = {
        username: username,
        email: email,
        pw_hash: hash(password)
      };
      database.add('user', body, function(lasdId, err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log('New user added successfully with id: ' + lasdId);
          res.status(204).send("");
        }
      });

    } else {
      //Send error
      res.status(400).send({ status: 400, error_msg: error });
    }
  } catch (error) {
    console.log("error", error)
  }
});

// @app.route("/register", methods=["POST"])
// def register():
//     # update LATEST
//     update_latest(request)

//     request_data = request.json

//     error = None
//     if request.method == "POST":
//         if not request_data["username"]:
//             error = "You have to enter a username"
//         elif not request_data["email"] or "@" not in request_data["email"]:
//             error = "You have to enter a valid email address"
//         elif not request_data["pwd"]:
//             error = "You have to enter a password"
//         elif get_user_id(request_data["username"]) is not None:
//             error = "The username is already taken"
//         else:
//             query = """INSERT INTO user
//                        (username, email, pw_hash) VALUES (?, ?, ?)"""
//             g.db.execute(
//                 query,
//                 [
//                     request_data["username"],
//                     request_data["email"],
//                     generate_password_hash(request_data["pwd"]),
//                 ],
//             )
//             g.db.commit()

//     if error:
//         return jsonify({"status": 400, "error_msg": error}), 400
//     else:
//         return "", 204


router.get('/msgs', function (req, res, next) {
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: "You are not authorized to use this resource!" });
      return;
    }

    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && parseInt(latest) !== NaN) {
      latestService.updateLatest(parseInt(latest));
    }

    //Gets Limit
    var no_msgs = parseInt(req.query.no);
    if (no_msgs == undefined) {
      no_msgs = 100;
    }
    const query = `SELECT message.*, user.* FROM message, user
    WHERE message.flagged = 0 AND message.author_id = user.user_id
    ORDER BY message.pub_date DESC LIMIT ?`

    database.all(query, [no_msgs], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).render('error');
        return;
      }
      const filteredMsgs = [];
      for (const msg of rows) {
        const filteredMsg = {};
        filteredMsg.content = msg.text;
        filteredMsg.pubDate = msg.pubDate;
        filteredMsg.user = msg.username;
        filteredMsgs.push(filteredMsg);
      }
      res.send(filteredMsgs);


    });
  } catch (error) {
    console.log("error", error)
  }
});

router.get('/msgs/:username', async function (req, res, next) {
  let username = req.params.username;
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: "You are not authorized to use this resource!" });
      return;
    }
    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && parseInt(latest) !== NaN) {
      latestService.updateLatest(parseInt(latest));
    }
    //Gets Limit
    var no_msgs = parseInt(req.query.no);
    if (!no_msgs) {
      no_msgs = 100;
    }

    const users = await getAllUsers()
    const userSelected = users.find(user => user.username = username)
    if (userSelected == -1) {
      res.status(404).send({ status: 404, error_msg: "User is not on our database" });
    }
    const userId = userSelected.user_id

    const query = `SELECT message.*, user.* FROM message, user 
    WHERE message.flagged = 0 AND
    user.user_id = message.author_id AND user.user_id = ?
    ORDER BY message.pub_date DESC LIMIT ?`

    database.all(query, [userId, no_msgs], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).render('error');
        return;
      }
      const filteredMsgs = [];
      for (const msg of rows) {
        const filteredMsg = {};
        filteredMsg.content = msg.text;
        filteredMsg.pubDate = msg.pubDate;
        filteredMsg.user = msg.username;
        filteredMsgs.push(filteredMsg);
      }
      if (filteredMsgs.length == 0) {
        res.status(204).send("");
      } else {
        res.status(200).send(filteredMsgs);
      }
    });
  } catch (error) {
    console.log("error", error)
  }
})

module.exports = router;