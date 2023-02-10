// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { Socket } from 'dgram'
import type {
  NextApiRequest,
  // NextApiResponse
} from 'next'
import { Server } from 'socket.io'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: any
) {
  if (res.socket && res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.emit('hello world', 'hello world')
      socket.on('input-change', msg => {
        console.log('i am in input change!')
        socket.broadcast.emit('update-input', msg)
      })
    })

  }
  res.end()
}
