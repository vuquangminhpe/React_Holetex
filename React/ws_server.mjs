import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 9072 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Received:", parsedMessage);

      switch (parsedMessage.type) {
        case "NEW_COMMENT":
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "NEW_COMMENT",
                  comment: parsedMessage.comment,
                })
              );
            }
          });
          break;

        case "DELETE_COMMENT":
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "DELETE_COMMENT",
                  commentId: parsedMessage.commentId,
                })
              );
            }
          });
          break;

        case "EDIT_COMMENT":
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "EDIT_COMMENT",
                  comment: parsedMessage.comment,
                })
              );
            }
          });
          break;

        case "NEW_REPLY":
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "NEW_REPLY",
                  reply: parsedMessage.reply,
                })
              );
            }
          });
          break;

        case "VOTE_COMMENT":
          {
            const { commentId, value, userId } = parsedMessage.vote || {};
            if (commentId && value !== undefined && userId) {
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "VOTE_COMMENT",
                      vote: { commentId, value, userId },
                    })
                  );
                }
              });
            } else {
              console.error(
                "VOTE_COMMENT message is missing data:",
                parsedMessage.vote
              );
            }
          }
          break;

        case "UPDATE_GRADES":
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "UPDATE_GRADES",
                  grades: parsedMessage.grades,
                })
              );
            }
          });
          break;

        default:
          console.error("Unknown message type:", parsedMessage.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

console.log("WebSocket server is running on ws://localhost:9072");
