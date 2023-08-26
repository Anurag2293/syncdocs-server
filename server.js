import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import connectToDB from './db/mongoose.js'
import Document from './models/Document.js'
import { defaultValue } from './utils/constants.js'

connectToDB()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

const port = process.env.PORT || 3001;

io.use((socket, next) => {
    console.log(socket.handshake.query)
    console.log(socket.handshake.auth)

    next(new Error('not authorized'))
})

io.on('connection', socket => {
    socket.on('get-document', async (documentId) => {
        console.log('connected with id : ' + documentId) 
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit('load-document', document.data)

        socket.on('send-changes', delta => {
            // console.log(delta)
            socket.broadcast.to(documentId).emit('receive-changes', delta)
        })

        socket.on('save-changes', async (data) => {
            await Document.findByIdAndUpdate(documentId, { data });
        })
    })
});

const findOrCreateDocument = async (id) => {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
}

server.listen(port, () => console.log(`Listening on port ${port}`))