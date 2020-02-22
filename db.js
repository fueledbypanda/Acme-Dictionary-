const pg = require("pg");
const uuid = require("uuid");
const { Client } = pg;
const client = new Client("postgres://localhost/dictionary_db");
client.connect();
const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS nouns;
  DROP TABLE IF EXISTS verbs;
  DROP TABLE IF EXISTS adjectives;
  CREATE TABLE nouns
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    CHECK (char_length(name) > 0)
  );
  CREATE TABLE verbs
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    CHECK (char_length(name) > 0)
  );
  CREATE TABLE adjectives
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    CHECK (char_length(name) > 0)
  );
  INSERT INTO nouns (name) VALUES ('table');
  INSERT INTO verbs (name) VALUES ('run');
  INSERT INTO adjectives (name) VALUES ('fast');
  `;
  await client.query(SQL);
};
const readNoun = async () => {
  const SQL = "SELECT * FROM nouns";
  const response = await client.query(SQL);
  return response.rows;
};

const readVerb = async () => {
  const SQL = "SELECT * FROM verbs";
  const response = await client.query(SQL);
  return response.rows;
};

const readAdjective = async () => {
  const SQL = "SELECT * FROM adjective";
  const response = await client.query(SQL);
  return response.rows;
};
const createNoun = async noun => {
  const SQL = "INSERT INTO nouns (name) VALUES ($1) RETURNING *";
  const response = await client.query(SQL, [noun]);
  console.log(response.rows);
  return response.rows[0];
};

const createVerbs = async verb => {
  const SQL = "INSERT INTO verbs (name) VALUES ($1) RETURNING *";
  const response = await client.query(SQL, [verb]);
  console.log(response.rows);
  return response.rows[0];
};

const createAdjectives = async adjectives => {
  const SQL = "INSERT INTO nouns (name) VALUES ($1) RETURNING *";
  const response = await client.query(SQL, [adjectives]);
  console.log(response.rows);
  return response.rows[0];
};

const deleteNoun = async id => {
  const SQL = "DELETE FROM nouns WHERE id = $1";
  const response = await client.query(SQL, [id]);
  return response;
};

const deleteVerb = async id => {
  const SQL = "DELETE FROM verbs WHERE id = $1";
  const response = await client.query(SQL, [id]);
  return response;
};
const deleteAdjective = async id => {
  const SQL = "DELETE FROM adjectives WHERE id = $1";
  const response = await client.query(SQL, [id]);
  return response;
};

sync();
module.exports = {
  sync,
  readNoun,
  createNoun,
  readVerb,
  createVerbs,
  readAdjective,
  createAdjectives,
  deleteNoun,
  deleteVerb,
  deleteAdjective
};
