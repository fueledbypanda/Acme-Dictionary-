const express = require("express");
const app = express();
const db = require("./db");
const morgan = require("morgan");
const faker = require("faker");
const path = require("path");
// const pg = require("pg");
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/api/nouns", (req, res, next) => {
  db.readNoun()
    .then(response => res.send(response))
    .catch(next);
});

app.get("/api/verbs", (req, res, next) => {
  db.readVerb()
    .then(response => res.send(response))
    .catch(next);
});

app.get("/api/adjectives", (req, res, next) => {
  db.readAdjective()
    .then(response => res.send(response))
    .catch(next);
});
app.post("/api/nouns", async (req, res, next) => {
  try {
    const noun = await db.createNoun(faker.hacker.noun());
    res.send(noun);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/verbs", async (req, res, next) => {
  try {
    const verb = await db.createVerbs(faker.hacker.verb());
    res.send(verb);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/adjectives", async (req, res, next) => {
  try {
    const adjective = await db.createAdjectives(faker.hacker.adjective());
    res.send(adjective);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/nouns/:id", (req, res, next) => {
  db.deleteNoun(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

app.delete("/api/verbs/:id", (req, res, next) => {
  db.deleteVerb(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

app.delete("/api/adjectives/:id", (req, res, next) => {
  db.deleteAdjective(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err.toString() });
});
const port = process.env.PORT || 3000;
db.sync().then(() => {
  console.log("synced");
  console.log(faker.hacker.noun());
  app.listen(port, () => console.log(`listening on port ${port}`));
});
app.use(express.static("assets"));
