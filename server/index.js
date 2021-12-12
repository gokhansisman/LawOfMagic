import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import * as SocketIO from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new SocketIO.Server(server)

let mockCoordinates = [
    {
        lat: 40.93567,
        lng: 29.15507,
        date: 1639312919489
    },
    {
        lat: 41.01643,
        lng: 29.12476,
        date: 1639313919489
    },
    {
        lat: 40.98582939,
        lng: 28.856996572,
        date: 1639314919489
    }
]

let coordinates = [...mockCoordinates]

app.use(express.static('public'))
app.use(bodyParser.json())
app.set('json spaces', 3)

app.post('/api/coordinate', (req, res) => {
    const { lat, lng } = req.body;

    let coordinate = {
        lat,
        lng,
        date: +new Date()
    }

    coordinates.push(coordinate)
    io.emit('new coordinate', coordinate)

    res.json({
        status: true
    })
})

app.get('/api/coordinates', (req, res) => {
    res.json(coordinates)
})

server.listen(8080, () => console.log(`Server port: 8080`))