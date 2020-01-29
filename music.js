const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const connection = require("./db");

app.listen(port, error => {
    if (error) {
      console.log("Server error...");
    }
    console.log(`Server is listening on port ${port}!`);
  });

//1
app.post("/music/add/playlist", (req, res) => {
    const title = req.body.title;
    const genre = req.body.genre;

    connection.query(`INSERT INTO playlist SET title = ?, genre = ?`, 
    [title, genre], (error, results) => {
      if (error) {
        res.status(500).send("Error saving a playlist...");
      } else {
        res.json({
            title,
            genre,
            results
          });
        res.sendStatus(201);
      }
    });
  });

  //2
  app.get("/music/add/playlist/:id", (req, res) => {
    const id = req.params.id;

    connection.query(`SELECT title, genre FROM playlist WHERE id = ${id}`, 
    (error, results) => {
      if (error) {
        res.status(500).send("Error retrieving the playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(200);
      }
    });
  });

  //3
  app.post("/music/assign/track/:id/:playlist_id", (req, res) => {
    const id = req.params.id;
    const playlist_id = req.params.playlist_id;

    connection.query(`UPDATE track SET playlist_id = ${playlist_id} 
    WHERE id = ${id}`, (error, results) => {
      if (error) {
        res.status(500).send("Error adding a song to the playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(201);
      }
    });
  });

  //4
  app.get("/music/get/track/:playlist_id", (req, res) => {
    const playlist_id = req.params.playlist_id;

    connection.query(`SELECT * FROM track JOIN playlist 
    ON track.playlist_id = playlist.id
    WHERE playlist_id = ${playlist_id}`, 
    (error, results) => {
      if (error) {
        res.status(500).send("Error getting the song(s) from the playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(200);
      }
    });
  });

  //5
  app.delete("/music/delete/playlist/:id", (req, res) => {
    const id = req.params.id;

    connection.query(`DELETE FROM playlist WHERE id = ${id}`, (error, results) => {
      if (error) {
        res.status(500).send("Error deleting a playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(200);
      }
    });
  });

  //6
  app.post("/music/update/playlist/:id", (req, res) => {
    const titleGenre = req.body;
    const id = req.params.id;

    connection.query(`UPDATE playlist SET ? WHERE id = ?`, 
    [titleGenre, id], (error, results) => {
      if (error) {
        res.status(500).send("Error updating a playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(201);
      }
    });
  });

  //7
  app.delete("/music/delete/track/:playlist_id", (req, res) => {
    const playlist_id = req.params.playlist_id;

    connection.query(`DELETE FROM track WHERE playlist_id = ${playlist_id}`, 
    (error, results) => {
      if (error) {
        res.status(500).send("Error deleting a song from the playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(200);
      }
    });
  });

  //8
  app.post("/music/update/track/:id/:playlist_id", (req, res) => {
    const track = req.body;
    const id = req.params.id;
    const playlist_id = req.params.playlist_id;

    connection.query(`UPDATE track SET ? WHERE id = ?`, [track, id, playlist_id], 
    (error, results) => {
      if (error) {
        res.status(500).send("Error updating the song in the playlist...");
      } else {
        res.json({
            results
          });
        res.sendStatus(201);
      }
    });
  });

  //Bonus
  app.get("/music/search?artist=", 
  (req, res) => {

    /*const parameters = {
        playlist_title: req.params.parameter,
        playlist_genre: req.params.parameter,
        track_artist: req.params.parameter
    }*/

    connection.query(`SELECT * FROM track JOIN playlist 
    ON track.playlist_id = playlist.id
    WHERE artist = ${req.query.artist}`, 
    
    (error, results) => {
        console.log(req.query.artist)

      if (error) {
        res.status(404).send("Error accessing the query...");
      } else {
        res.json({
            results
          });
        res.sendStatus(200);
      }
    });
  });

  // Super Bonus #1
  app.post("/music/add/user", (req, res) => {
    const userProfile = req.body;

    connection.query(`INSERT INTO user SET ?`, 
    [userProfile], (error, results) => {
      if (error) {
        res.status(500).send("Error creating a user profile...");
      } else {
        res.json({
            results
          });
        res.sendStatus(201);
      }
    });
  });


  // Super Bonus #2
  app.post("/music/add/user/:user_id/:playlist_id", (req, res) => {
    const user_id = req.params.user_id;
    const playlist_id = req.params.playlist_id;

    connection.query(`UPDATE playlist SET owner_id = ${user_id} WHERE id = ${playlist_id}`, 
    (error, results) => {
      if (error) {
        res.status(500).send("Error adding a favourite...");
      } else {
        res.json({
            results
          });
        res.sendStatus(201);
      }
    });
  });