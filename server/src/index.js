const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
// setup server socket
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
  res.send("Hello World");
});

// when connected by a client via socket, do sth to the socket.
io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  // when server reveive sendOffer request from client 1
  // let dest client with id <to> receive offer.
  socket.on("sendOffer", ({ from, to, stream }) => {
    io.to(to).emit("receiveOffer", { from, stream });
  });

  socket.on("sendAnswer", ({ from, to, stream }) => {
    io.to(to).emit("receiveAnswer", { from, stream });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
