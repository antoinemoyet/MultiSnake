'use strict';

const path = require('path');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

import * as constant from '../client/js/constant';
import Board from '../client/js/board.js';

var b = new Board();

app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {

	io.emit('client ID', socket.id);
	io.emit('connect message');

	socket.on('movement', event => {
		io.emit('movement', event);
	});

	socket.on('disconnect', () => {
		io.emit('disconnect message');
	});
});

setInterval(function() {
	io.emit('start', 'Démarrage de la partie');

	while(b.apples.length < constant.DEFAULT_APPLES_NUMBER){
		let apple = b.generateApple();
		io.emit('new_apple', apple);
	}

	setTimeout(function() {
		io.emit('end', 'Fin de la partie');
	}, constant.GAME_DURATION);
}, constant.TOTAL_DURATION);

http.listen(3000, () => {
	console.log('listening on *:3000');
});