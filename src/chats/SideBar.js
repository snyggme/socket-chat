import React, { Component } from 'react';
import AddChat from '../components/AddChat';
import ChatRoom from '../components/ChatRoom';
import CurrentUser from '../components/CurrentUser';

class SideBar extends Component {
	render() {
		const { chats, activeChat, user, setActiveChat, logout, socket, addChat } = this.props;

		return (
			<div className='sidebar-container'>
				<div className='heading'>
					Awesome Chat Name
				</div>
				<AddChat 
					socket={socket}
					user={user}
					activeChat={activeChat}
					setActiveChat={setActiveChat}
					addChat={addChat}
				/>
				<div className='chat-rooms'>
					{	
						chats.map((chat)=>{
							if (chat.name) {
								const lastMessage = chat.messages[chat.messages.length - 1];
								const classNames = activeChat.id === chat.id ? 'active' : ''
									
								return(
									<ChatRoom 
										key={chat.id}
										lastMessage={lastMessage}
										classNames={classNames}
										chat={chat}
										setActiveChat={setActiveChat}
									/>
								)
							}

							return null
						})	
					}
				</div>
				<CurrentUser 
					username={user.name}
					logout={logout}
				/>
			</div>
		)
	}
}

export default SideBar;