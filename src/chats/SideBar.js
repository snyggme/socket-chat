import React, { Component } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { FaList } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaEject } from 'react-icons/fa';

class SideBar extends Component {
	constructor(props) {
		super(props);

		this.inputRef = React.createRef();

		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();

		const { socket, user } = this.props;
		const chatId = this.inputRef.current.value;

		socket.emit('ADD_USER_TO_CHAT', { chatId, user }, (chat) => {
			this.props.addChat(chat)
		});
	}
	render() {
		const { chats, activeChat, user, setActiveChat, logout } = this.props;

		return (
			<div id='side-bar'>
					<div className='heading'>
						<div className='app-name'>Out Cool Chat <FaAngleDown /></div>
						<div className='menu'>
							<FaList />
						</div>
					</div>
					<div className='search'>
						<form onSubmit={this.handleSubmit}>
							<i className='search-icon'><FaSearch /></i>
							<input ref={this.inputRef} placeholder='search' type='text' />
							<div className='plus' />
						</form>
					</div>
					<div 
						className='users'
						ref='users'
						onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null)}}>
					
						{	
							chats.map((chat)=>{
								if (chat.name) {
									const lastMessage = chat.messages[chat.messages.length - 1];
									// const user = chat.users.find(({name})=>{
									// 	return name !== this.props.name
									// }) 
									const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
									
									return(
										<div 
											key={chat.id} 
											className={`user ${classNames}`}
											onClick={ ()=>{ setActiveChat(chat) } }
											>
											<div className="user-photo">
												{user.name[0].toUpperCase()}
											</div>
											<div className="user-info">
												<div className="name">{chat.name}</div>
												{ lastMessage && 
													<div className="last-message">
														{lastMessage.message}
													</div>
												}
											</div>
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