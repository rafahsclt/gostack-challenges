const express = require("express")
const cors = require("cors")

const { uuid, isUuid } = require("uuidv4")

const app = express()

app.use(cors())
app.use(express.json())

function logRequests(request, response, next) {
  const { method, url } = request

  const logLable = `[${method.toUpperCase()}] ${url}`

  console.time(logLable)

  next() //Próximo middleware

  console.timeEnd(logLable)
}

function validateProjectID(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)) {
      return response.status(400).json({error : 'Invalid repository ID'})
  }
  
  return next()
}

app.use(logRequests)
app.use('/repositories/:id', validateProjectID)

const repositories = []

app.get("/repositories", (request, response) => {
  return response.json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository)

  return response.json(repository)
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ error : 'Repository not found!' })
  }

  const likes = repositories[repositoryIndex].likes

  // console.log(likes)

  const changedRepository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = changedRepository

  return response.json(changedRepository)
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ error : 'Repository not found!' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", validateProjectID, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ error : 'Repository not found!' })
  }

  const { title, url, techs, likes } = repositories[repositoryIndex]
  
  const changedRepository = {
    id,
    title,
    url,
    techs,
    likes: likes + 1
  }

  // console.log(changedRepository)

  repositories[repositoryIndex] = changedRepository

  return response.json(changedRepository)
})

module.exports = app;
