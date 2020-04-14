const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
function ValidaProjectId(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ error: "id de projeto invalido" });
  }
  return next();
}

const repositories = [];
async function git() {
  try {
    const response = await axios.get(
      "https://api.github.com/users/drigoalves0/repos"
    );

    response.data.forEach((repositorio) => {
      let { svn_url, node_id, name, language, stargazers_count } = repositorio;
      // let url = repositorio.svn_url;
      // let repositorio.node_id
      //testes

      repositories.push({
        id: uuid(),
        title: name,
        techs: language,
        url: svn_url,
        likes: stargazers_count,
      });
    });
  } catch (error) {}
}
repositories.length == 0
  ? git()
  : console.log("🚨 repositorios já foram carregados");

app.get("/repositories", (req, res) => {
  res.json(repositories);
});

app.post("/repositories", (req, res) => {
  let { title, techs, url } = req.body;
  // let id = uuid();
  let id = uuid();

  // let repositorie = { id, title, node_id: id, techs, url, likes: 0 };
  let repositorie = { id, title, techs, url, likes: 0 };

  let repositorie2 = { id, title, techs, url, likes: 0 };
  let repositorieIndex = repositories.findIndex(
    (repositorie3) => repositorie3.url == url
  );
  // if (repositorieIndex == 0) {
  //   return res.status(400).json("error repositorie already registered");
  // }
  repositories.push(repositorie);
  res.json(repositorie2);
});

app.put("/repositories/:id", ValidaProjectId, (req, res) => {
  let { id } = req.params;
  if (id == null && id == undefined) {
    return res.status(400).json("error repositorie null");
  }
  let repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id == id
  );
  if (repositorieIndex < 0) {
    return res.status(400).json("repositorie not found");
  } else {
    let { title, techs, url } = req.body;

    let repositorieIndex2 = repositories.findIndex(
      (repositorie3) => repositorie3.url == url
    );
    if (repositorieIndex2 == 0) {
      return res.status(400).json("error repositorie already registered");
    }
    let { likes } = repositories[repositorieIndex];
    let repositorie = {
      id,
      title,
      node_id: id,
      techs,
      url,
      likes,
    };
    let repositorie2 = {
      id,
      title,
      techs,
      url,
      likes,
    };
    repositories[repositorieIndex] = repositorie;
    res.json(repositorie2);
  }
});

app.delete("/repositories/:id", ValidaProjectId, (req, res) => {
  let { id } = req.params;
  let repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id == id
  );
  if (repositorieIndex < 0) {
    return res.status(400).json("repositorie not found");
  }
  repositories.splice(repositorieIndex, 1);
  res.status(204).send();
});

app.post("/repositories/:id/like", ValidaProjectId, (req, res) => {
  let { id } = req.params;
  if (id == null && id == undefined) {
    return res.status(400).json("error repositorie null");
  }
  let repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id == id
  );
  if (repositorieIndex < 0 && repositorieIndex == 0) {
    return res.status(400).json("repositorie not found");
  } else {
    let { likes } = repositories[repositorieIndex];

    repositories[repositorieIndex].likes = likes + 1;
    let repositorie = repositories[repositorieIndex];
    res.json({ likes: repositories[repositorieIndex].likes });
  }
});

module.exports = app;
