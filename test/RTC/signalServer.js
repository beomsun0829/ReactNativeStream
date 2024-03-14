const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 6789 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

console.log('Signaling server running on ws://127.0.0.1:6789');
