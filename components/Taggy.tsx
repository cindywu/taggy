import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
// import "./Taggy.module.css";

let socket: Socket;

interface CarState {
  x: number;
  y: number;
  speed: number;
  angle: number;
  username: string;
}

const Home = () => {
  const [cars, setCars] = useState<CarState[]>([]);
  const [myCar, setMyCar] = useState<CarState>({
    x: 0,
    y: 0,
    speed: 0,
    angle: 0,
    username: "cindy",
  });

  // position updated

  // user joined
  // car position

  // user left
  const myCarRef = useRef(myCar);
  myCarRef.current = myCar;

  const socketInitializer = useCallback(async () => {
    await fetch("/api/hello");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
      socket.emit("join", myCarRef.current);
    });
    socket.on("update-car", (car: CarState) => {
      if (car.username === myCarRef.current.username) {
        return;
      }
      setCars((prev) => {
        const index = prev.findIndex((c) => c.username === car.username);
        if (index > -1) {
          prev[index] = car;
          return [...prev];
        }
        return [...prev, car];
      });
    });
  }, []);

  useEffect(() => void socketInitializer(), [socketInitializer]);

  useEffect(() => {
    const listener = (e: KeyboardEvent): void => {
      const newCar = { ...myCar };
      if (e.key === "ArrowRight") {
        newCar.angle += 10;
      } else if (e.key === "ArrowLeft") {
        newCar.angle -= 10;
      }
      // if (e.key === 'ArrowLeft') {
      //   setMyCar({ ...myCar, x: myCar.x - 1 })
      // }
      if (e.key === "ArrowUp") {
        newCar.speed += 10;
      } else if (e.key === "ArrowDown") {
        newCar.speed -= 10;
      }
      setMyCar(newCar);
      socket?.emit("car-change", newCar);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [myCar]);

  const FPS = 60;
  useEffect(() => {
    const interval = setInterval(() => {
      setMyCar((prev) => {
        const x =
          prev.x + (Math.cos((prev.angle * Math.PI) / 180) * prev.speed) / FPS;
        const y =
          prev.y + (Math.sin((prev.angle * Math.PI) / 180) * prev.speed) / FPS;
        const speed = prev.speed * 0.99;
        return { ...prev, x, y, speed };
      });
    }, 1000 / FPS);
    return () => clearInterval(interval);
  }, [myCar.speed]);

  // const [input, setInput] = useState();

  const onChangeHandler = (e: any) => {
    // debugger;
    // setInput(e.target.value);
    setMyCar({ ...myCar, username: e.target.value });
    socket?.emit("input-change", e.target.value);
  };

  return (
    <div style={{ position: "relative" }}>
      <Car myCar={myCar} />
      {cars.map((car) => (
        <Car key={car.username} backgroundColor={"red"} myCar={car} />
      ))}
      <input
        placeholder="Type something"
        value={myCar.username}
        onChange={onChangeHandler}
      />
    </div>
  );
};

function Car({
  myCar,
  backgroundColor,
}: {
  myCar: CarState;
  backgroundColor?: string;
}) {
  return (
    <div
      style={{
        transform: `translate(${myCar.x}px, ${myCar.y + 30}px) rotate(${
          myCar.angle
        }deg)`,
        width: "50px",
        height: "25px",
        position: "absolute",
        backgroundColor: backgroundColor ?? "blue",
      }}
    ></div>
  );
}

export default function Taggy() {
  return (
    <div>
      Taggy
      <Home></Home>
    </div>
  );
}
