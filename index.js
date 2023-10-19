const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml')

app.use(express.json())
app.use(cors())

const games = [
    { id: 1, name: "Witcher 3", price: 29.99 },
    { id: 2, name: "Cyberpunk 2077", price: 59.99 },
    { id: 3, name: "Minecraft", price: 266.99 },
    { id: 4, name: "Counter-Strike: Global Offensive", price: 0 },
    { id: 5, name: "Roblox", price: 0 },
    { id: 6, name: "Grand Theft Auto V", price: 29.99 },
    { id: 7, name: "Valorant", price: 0 },
    { id: 8, name: "Forza Horizon 5", price: 59.99 },
]

app.get('/games', (req, res) => {
    res.send(games)
})

app.get('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id)
    const game = games.find(g => g.id === gameId)
    if (!game) {
        return res.status(404).send({ error: "Game not found" })
    }
    res.send(game)
})

app.post('/games', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' })
    }

    const game = {
        id: games.length + 1,
        price: req.body.price,
        name: req.body.name
    }

    games.push(game)

    res.status(201)
        .location(`${getBaseUrl(req)}/games/${game.id}`)
        .send(game)
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.delete('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id)
    const index = games.findIndex(g => g.id === gameId)
    if (index === -1) {
        return res.status(404).send({ error: "Game not found" })
    }

    games.splice(index, 1)

    res.status(204).send({ error: "No content" })
})

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`
}

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})
