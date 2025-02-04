const WebSocket = require("ws");
const generateRandomSentence = require("./generateExpectedSentence");

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

const players = [];

let expected = "";

// connection established
server.on("connection", (socket) => {
  if (players.length >= 4) {
    //handling if more than 2 player
    socket.send("2 players already connected");
    socket.close();
    return;
  }

  const playerNumber = players.length + 1;
  players.push({
    socket,
    ready: false,
    display: undefined,
    playerId: playerNumber,
  }); // adding player
  const resObj = { type: "init", payload: playerNumber };
  console.log(`player ${playerNumber} connected`);
  socket.send(JSON.stringify(resObj));

  socket.on("message", (event) => {
    try {
      const data = JSON.parse(event);
      console.log(data.payload);
      if (data.type === "startTest") {
        players[playerNumber - 1].ready = true;
        // check if all players are ready
        if (checkReadyStatus(players)) {
          expected = generateRandomSentence();
          server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              const resObj = { type: "expectedString", payload: expected };
              client.send(JSON.stringify(resObj));
              let timeInterval = setInterval(() => {
                const displayObj = {
                  type: "allPlayerDisplay",
                  payload: players,
                };
                client.send(JSON.stringify(displayObj));
              }, 100);
              setTimeout(() => {
                clearInterval(timeInterval);
              }, 30000);
            }
          });
        }
      } else if (data.type === "myDisplay") {
        //   console.log(data.payload);
        players[playerNumber - 1].display = data.payload;
        console.log(players[playerNumber - 1].display);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  // when client gets disconnected
  socket.on("close", () => {
    console.log(`player ${playerNumber} disconnected`);
    players.splice(playerNumber - 1, 1);
  });
});

function checkReadyStatus(arr) {
  let status = true;
  arr.forEach((element) => {
    if (element.ready === false) {
      status = false;
    }
  });
  return status;
}
