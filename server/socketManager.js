const io = require('./server.js').io;	
const { createUser, createChat, createMessage } = require('../src/utils/factories');

let connectedUsers = {}
let allChats = [];
let communityChat = createChat();
allChats.push(communityChat);

module.exports = socket => {
	console.log(`socket id ${socket.id}`);

	let sendMessageToChatFromUser;
	let sendTypingFromUser;

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

		sendMessageToChatFromUser = sendMessageToChat(user.name);
		sendTypingFromUser = sendTypingToChat(user.name);

		io.emit('USER_CONNECTED', connectedUsers)
		console.log(connectedUsers);
	})

	socket.on('ADD_CHAT', (callback) => {
		const chat = createChat({name: `${socket.user.name}'s chat room`})
		allChats.push(chat);

        callback(chat, true);
	});﻿

	socket.on('disconnect', () => {
		if ('user' in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user.name);

			io.emit('USER_DISCONNECTED', connectedUsers);
			console.log('disconnect' ,connectedUsers);
		}
	})

	socket.on('LOGOUT', () => {
		connectedUsers = removeUser(connectedUsers, socket.user.name);

		io.emit('USER_DISCONNECTED', connectedUsers);
		console.log('disconnect', connectedUsers);
	})

	socket.on('MESSAGE_SENT', ({ chatId, message }) => {
		sendMessageToChatFromUser(chatId, message);
	})

	socket.on('TYPING', ({ chatId, isTyping }) => {
		sendTypingFromUser(chatId, isTyping)
	})
}

const sendTypingToChat = (user) => {
	return (chatId, isTyping) => {
		io.emit(`TYPING-${chatId}`, { user, isTyping})
	}
}

const sendMessageToChat = (sender) => {
	return (chatId, message) => {
		io.emit(`MESSAGE_RECEIVED-${chatId}`, createMessage({
			message,
			sender
		}))
	}
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