import React, { Component } from 'react';
import { FaPlus } from 'react-icons/fa';

class AddChat extends Component {
	constructor(props) {
		super(props);

		this.inputRef = React.createRef();

		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();

		const { socket, user, activeChat } = this.props;
		const chatId = this.inputRef.current.value;

		if (activeChat.id !== chatId) {
			socket.emit('ADD_USER_TO_CHAT', { chatId, user }, (chat) => {
				this.props.addChat(chat);
				this.props.setActiveChat(chat);
			});
		}

		e.target.reset();
	}
	render(){
		return(
			<div className='add-chat'>
				<form onSubmit={this.handleSubmit}>
					<i className='add-chat-icon'><FaPlus /></i>
					<input ref={this.inputRef} placeholder='add chat' type='text' />
					<div className='plus' />
				</form>
			</div>	
		)
	}
}

export default AddChat;