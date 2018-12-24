import React, { Component } from 'react';
import SideBar from './SideBar';
import ChatHeading from './ChatHeading';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';

class ChatContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: [],
			activeChat: null,
		}

		this.setActiveChat = this.setActiveChat.bind(this);
		this.resetChat = this.resetChat.bind(this);
		this.addChat = this.addChat.bind(this);
		this.addMessageToChat = this.addMessageToChat.bind(this);
		this.updateTypingInChat = this.updateTypingInChat.bind(this);
	}
	componentDidMount() {
		const { socket } = this.props;

		socket.emit('CREATE_CHAT', this.addChat)
	}
	resetChat(chat) {
		
		this.addChat(chat, true);
	}
	addChat(chat, reset = false) {
		console.log(chat)
		const { socket } = this.props;
		const { chats } = this.state;

		const newChats = reset ? [chat] : [...chats, chat];

		this.setState({
			chats: newChats,
			activeChat: reset ? chat : this.state.activeChat
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
		console.log(activeChat)
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
			<div className='chat'>
				<SideBar 
					logout={logout}
					socket={socket}
					user={user}
					chats={chats}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					addChat={this.addChat}
				/>
				<div className='chatroom-container'>
					{
						activeChat !== null 
							? (
								<div className='chatroom'>
									<ChatHeading name={activeChat.name} />
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
							) : 
								<div className='chatroom-choose'>
									<h3>Choose a Chat!</h3>
								</div>
					
					}
				</div>
			</div>
		)
	}
}

export default ChatContainer;