import React, { Component } from 'react';

class MessageInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: '',
			isTyping: false
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.sendTyping = this.sendTyping.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}
	componentWillUnmount() {
		this.stopCheckingTyping();
	}
	handleSubmit(e) {
		e.preventDefault();

		this.sendMessage();

		this.setState({ message: ''})
	}
	sendMessage() {
		const { message } = this.state;

		this.props.sendMessage(message);
	}
	sendTyping() {
		this.lastUpdateTime = Date.now();

		const { isTyping } = this.state;

		if (!isTyping) {
			this.setState({
				isTyping: true
			})

			this.props.sendTyping(true);
			this.startCheckingTyping()
		}
	}
	startCheckingTyping() {
		this.typingInterval = setInterval(() => {
			if ((Date.now() - this.lastUpdateTime) > 300) {
				this.setState({
					isTyping: false
				})
				
				this.stopCheckingTyping();
			}
		}, 300)
	}
	stopCheckingTyping() {
		if (this.typingInterval) {
			clearInterval(this.typingInterval);
			this.props.sendTyping(false);
		}
	}
	render() {
		const { message } = this.state;
		return (
			<div className='message-input'>
				<form
					onSubmit={this.handleSubmit}
					className='message-form'
				>
					<input 
						id='message'
						ref='messageinput'
						type='text'
						className='form-control'
						value={message}
						autoComplete='off'
						placeholder='Write your message...'
						onKeyUp={ e => { e.keyCode !== 13 && this.sendTyping()}}
						onChange={
							({ target }) => {
								this.setState({ message: target.value })
							}
						}
					/>
					<button
						disabled={message.length < 1}
						type='submit'
						className='send-btn'
					>
						Send
					</button>
				</form>
			</div>
		)
	}
}

export default MessageInput;