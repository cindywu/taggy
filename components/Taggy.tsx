import React, { useState } from 'react'
import { useEffect } from 'react'
// import { Socket } from 'Socket.IO-client'
// import io from 'Socket.IO-client'
let socket : any

interface CarState {
  x: number
  y: number
  angle: number
  username: string
}

const Home = () => {
  const [cars, setCars] = useState<CarState[]>([])
  const [myCar, setMyCar] = useState<CarState>({ x: 0, y: 0, angle: 0, username: 'cindy' })

  // position updated

  // user joined
    // car position

  // user left

  useEffect(() => void socketInitializer(), [])

  // useEffect(() => {
  //   document.addEventListener('keydown', (e) => {
  //     if (e.key === 'ArrowRight') {
  //       setMyCar({ ...myCar, x: myCar.x + 1 })
  //     }
  //     if (e.key === 'ArrowLeft') {
  //       setMyCar({ ...myCar, x: myCar.x - 1 })
  //     }
  //     if (e.key === 'ArrowUp') {
  //       setMyCar({ ...myCar, y: myCar.y - 1 })
  //     }
  //     if (e.key === 'ArrowDown') {
  //       setMyCar({ ...myCar, y: myCar.y + 1 })
  //     }
  //   })

  // },[myCar])

  const [input, setInput] = useState('')

  const onChangeHandler = (e : any) => {
    // debugger;
    setInput(e.target.value)
    socket?.emit('input-change', e.target.value)
  }

  const socketInitializer = async () => {
    await fetch('/api/hello')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
      socket.emit('join', myCar)
    })
  }

  return (
    <div style={{position: 'relative'}}>
      <div style={{transform: `translate(${myCar.x}, ${myCar.y})`, width: '50px', height: '25px', position: 'absolute', backgroundColor: 'blue'}}>

      </div>
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
    </div>
  )
}

export default function Taggy() {
  return (
    <div>Taggy
      <Home></Home>
    </div>
  )
}
