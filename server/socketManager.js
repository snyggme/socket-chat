const io = require('./server.js').io;	
const { createUser } = require('../src/utils/factories');

let connectedUsers = {}

module.exports = socket => {
	console.log(`socket id ${socket.id}`);

	socket.on('VERIFY_USER', (nickname, callback) => {
		if (isUser(connectedUsers, nickname)) {
			callback({ isUser: true, user: null })
		} else {
			callback({ isUser: false, user: createUser({ name: nickname })})
		}
	})

	socket.on('USER_CONNECTED', (user) => {
		connectedUsers = addUser(connectedUsers, user);
		socket.user = user;

		io.emit('USER_CONNECTED', connectedUsers)
		console.log(connectedUsers);
	})
}

const isUser = (users, username) => {
	return username in users
}

const removeUser = (users, username) => {
	let newUsers = { ...users };

	delete newUsers[username];

	return newUsers;
}

const addUser = (users, user) => {
	let newUsers = { ...users };

	newUsers[user.name] = user;

	return newUsers;
}