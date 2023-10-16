const express = require('express');

const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
	console.log('Connection is stable');
	ws.send('You was connected successfully');

	ws.on('message', (msg) => {
		let parsedMsg = JSON.parse(msg);
		switch (parsedMsg.method) {
			case 'connection':
				connectionHandler(ws, parsedMsg);
				break;
		}
	});
});

const connectionHandler = (ws, obj) => {
	ws.id = obj.id;
	broadcastConnection(ws, obj);
};

const broadcastConnection = (ws, obj) => {
	aWss.clients.forEach((client) => {
		if (client.id === obj.id) {
			client.send(`User ${obj.username} was connected`);
		}
	});
};

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
