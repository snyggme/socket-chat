import React, { Component } from 'react';
import { FaAngleDown, FaList, FaEject } from 'react-icons/fa';
import CopyLink from '../components/CopyLink';
import AddChat from '../components/AddChat';

class SideBar extends Component {
	render() {
		const { chats, activeChat, user, setActiveChat, logout, socket, addChat } = this.props;

		return (
			<div id='side-bar'>
					<div className='heading'>
						<div className='app-name'>Cool Chat <FaAngleDown /></div>
						<div className='menu'>
							<FaList />
						</div>
					</div>
					<AddChat 
						socket={socket}
						user={user}
						activeChat={activeChat}
						setActiveChat={setActiveChat}
						addChat={addChat}
					/>
					<div 
						className='users'
						ref='users'
						onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null)}}>
					
						{	
							chats.map((chat)=>{
								if (chat.name) {
									const lastMessage = chat.messages[chat.messages.length - 1];
									const classNames = activeChat.id === chat.id ? 'active' : ''
									
									return(
										<div 
											key={chat.id} 
											className={`user ${classNames}`}
										>
											<div className="user-photo">
												{user.name[0].toUpperCase()}
											</div>
											<div 
												className="user-info" 
												onClick={ ()=>{ setActiveChat(chat) } }
											>
												<div className="name">{chat.name}</div>
												{ lastMessage && 
													<div className="last-message">
														{lastMessage.message}
													</div>
												}
											</div>
											<CopyLink id={chat.id} />
										</div>
									)
								}

								return null
							})	
						}
					</div>
					<div className="current-user">
						<span>{user.name}</span>
						<div onClick={()=>{logout()}} title="Logout" className="logout">
							<FaEject />	
						</div>
					</div>
			</div>
		)
	}
}

export default SideBar;