import React, { Component } from 'react';
import SideBar from './SideBar';
import ChatHeading from './ChatHeading';
import Messages from './Messages';
import MessageInput from './MessageInput';
import VideoBar from './VideoBar';

class ChatContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: [],
			activeChat: null,
		}

		this.setActiveChat = this.setActiveChat.bind(this);
		this.addChat = this.addChat.bind(this);
	}
	componentDidMount() {
		const { socket } = this.props;

		socket.emit('CREATE_CHAT', this.addChat);

		socket.on('UPDATE_CHAT', (chat) => {
			this.updateChats(chat);
		});
	}
	componentWillUnmount() {
		const { socket } = this.props;

		socket.off('UPDATE_CHAT');
	}
	updateChats(chat) {
		const { id } = chat;
		const { chats, activeChat } = this.state;

		const i = chats.findIndex(ch => ch.id === id);

		this.setState({
			chats: activeChat.id === chat.id 
				? [
					...chats.slice(0, i),
					chat,
					...chats.slice(i + 1)
				] 
				: [...chats],
			activeChat: activeChat.id === chat.id ? chat : activeChat
		})
	}
	addChat(chat, reset = false) {
		const { socket } = this.props;
		const { chats } = this.state;

		const newChats = reset ? [chat] : [...chats, chat];

		this.setState({
			chats: newChats,
			activeChat: chat
		})

		const messageEvent = `MESSAGE_RECEIVED-${chat.id}`;
		const typingEvent = `TYPING-${chat.id}`;

		socket.on(typingEvent, this.updateTypingInChat(chat.id));
		socket.on(messageEvent, this.addMessageToChat(chat.id));
	}
	addMessageToChat(chatId) {
		return message => {
			const { chats } = this.state;
			let newChats = chats.map(chat => {
				if (chat.id === chatId) 
					chat.messages.push(message)

				return chat;
			})

			this.setState({
				chats: newChats
			})
		}
	}
	updateTypingInChat(chatId) {
		return ({ isTyping, user }) => {
			if (user !== this.props.user.name) {
				const { chats } = this.state;

				let newChats = chats.map(chat => {
					if (chat.id === chatId) {
						if (isTyping && !chat.typingUsers.includes(user)) {
							chat.typingUsers.push(user)
						} else if (!isTyping && chat.typingUsers.includes(user)) {
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}

					return chat;
				})

				this.setState({
					chats: newChats
				})
			}
		}
	}
	setActiveChat(activeChat) {
		this.setState({ activeChat })
	}
	sendMessage(chatId, message) {
		const { socket } = this.props;

		socket.emit('MESSAGE_SENT', { chatId, message })
	}
	sendTyping(chatId, isTyping) {
		const { socket } = this.props;

		socket.emit('TYPING', { chatId, isTyping })
	}
	render() {
		const { user, logout, socket } = this.props;
		const { chats, activeChat } = this.state;

		return (
			<div className='chat-container'>
				<SideBar 
					logout={logout}
					socket={socket}
					user={user}
					chats={chats}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					addChat={this.addChat}
				/>
				{
					activeChat && 
						(
							<div className='chatroom-container'>
								<ChatHeading 
									name={activeChat.name} 
									users={activeChat.users} 
								/>
								<Messages
									messages={activeChat.messages}
									user={user}
									typingUsers={activeChat.typingUsers}
								/>
								<MessageInput 
									sendMessage={ message => {
										this.sendMessage(activeChat.id, message)
									}}
									sendTyping={ isTyping => {
									this.sendTyping(activeChat.id, isTyping)
									}}
								/>
							</div>
						)
				}
				{
					activeChat && 
						<VideoBar socket={socket} activeChat={activeChat} />
				}
				
			</div>
		)
	}
}

export default ChatContainer;