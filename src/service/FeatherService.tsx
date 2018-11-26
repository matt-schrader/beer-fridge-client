import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

const socket = io.connect('/')
const client = feathers()
client.configure(socketio(socket))
export default client
