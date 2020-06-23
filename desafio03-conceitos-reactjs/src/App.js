import React, { useState, useEffect } from "react";
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `New repository ${Date.now()}`,
      url: 'http://github.com/rafahsclt',
      techs: [
        'VueJS',
        'ReactJS',
        'NodeJS'
      ]
    })

    const repository = response.data

    setRepositories([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`)

    const repositoryIndex = repositories.findIndex(repository => repository.id === id)

    const changedRepositories = repositories
    changedRepositories.splice(repositoryIndex, 1)

    setRepositories([...changedRepositories])
  }

  useEffect(() => {
    api.get('/repositories')
      .then(response => setRepositories(response.data))
  }, [])

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository =>
          <li key={repository.title}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
          </button>
          </li>)}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
