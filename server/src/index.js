const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
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

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("sendOffer", ({ from, to, signal }) => {
    // add logic to send offer to another client with id to.
    socket.on("sendOffer", ({ from, to, signal }) => {
      io.to(to).emit("receiveOffer", { from, signal });
    });

    socket.on("sendAnswer", ({ from, to, signal }) => {
      io.to(to).emit("receiveAnswer", { from, signal });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });
  });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
