const io = require('./server.js').io;	
const { createUser, createChat, createMessage } = require('../src/utils/utils');

let connectedUsers = {}
let allChats = [];

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

	socket.on('CREATE_CHAT', (callback) => {
		const chat = createChat({
			name: `${socket.user.name}'s chat room`, 
			users: [socket.user]
		})
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

	socket.on('ADD_USER_TO_CHAT', ({ chatId, user }, callback) => {
		let chat = findChatById(chatId);

		if (chat !== undefined) {
			chat = addUserToChat(chat, user);

			callback(chat);

			io.emit('UPDATE_CHAT', chat);
		}		
	})

	socket.on('STREAM', ({ image, chatId }) => {
		socket.broadcast.emit(`STREAM-${chatId}`, image);
	})
}

const addUserToChat = (chat, user) => {
	let newChat = { ...chat };

	newChat.users.push(user);

	return newChat;
}

const findChatById = (chatId) => {
	return allChats[allChats.findIndex(chat => chat.id === chatId)];
}

const sendTypingToChat = (user) => {
	return (chatId, isTyping) => {
		io.emit(`TYPING-${chatId}`, { user, isTyping});
	}
}

const sendMessageToChat = (sender) => {
	return (chatId, message) => {
		const newMessage = createMessage({
			message,
			sender
		})

		findChatById(chatId).messages.push(newMessage);

		io.emit(`MESSAGE_RECEIVED-${chatId}`, newMessage);
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