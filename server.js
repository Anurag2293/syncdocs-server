const connectToDB = require('./db/mongoose.js')
const Document = require('./models/Document.js')

connectToDB()
const defaultValue = ''

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

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