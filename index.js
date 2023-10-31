const express = require('express');
const cors = require('cors');
const { default: Image } = require('./services/Image');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

app.use(
	cors({
		origin: ['https://paint-online-app.vercel.app'],
		methods: ['POST', 'GET'],
		credentials: true,
	})
);
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
	ws.on('message', (msg) => {
		let parsedMsg = JSON.parse(msg);
		switch (parsedMsg.method) {
			case 'connection':
				connectionHandler(ws, parsedMsg);
				break;
			case 'draw':
				broadcastConnection(ws, parsedMsg);
				break;
		}
	});
});

const connectionHandler = (ws, obj) => {
	ws.id = obj.id;
	broadcastConnection(ws, obj);
};

const broadcastConnection = (ws, msg) => {
	aWss.clients.forEach((client) => {
		if (client.id === msg.id) {
			client.send(JSON.stringify(msg));
		}
	});
};

app.post('/image', Image.saveImg);
app.get('/image', Image.getImg);

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
