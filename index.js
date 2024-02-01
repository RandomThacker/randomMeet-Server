const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

const isDev = app.settings.env === "development";
const URL = isDev
  ? "http://localhost:3000"
  : "https://samvad-setu-gyandeeparyan.vercel.app/";

app.use(cors({ origin: URL }));
app.use(express.json({ extended: true }));
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: URL });

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("join-room", (roomId, userId) => {
      console.log(`A NEW USER WITH ${userId} JOINED ROOM ${roomId}`);
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected", userId);
    });

    socket.on("toggle-audio", (userId, roomId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("toggle-audio", userId);
    });
    socket.on("toggle-video", (userId, roomId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("toggle-video", userId);
    });
    socket.on("leave", (userId, roomId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("leave", userId);
    });
  });

httpServer.listen(5000);