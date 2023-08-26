import http from 'http'
import express from 'express'
import connectToDB from './db/mongoose.js'
import io from './routers/socket.js'

connectToDB()
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3001;
io.attach(server)

server.listen(port, () => console.log(`Listening on port ${port}`))