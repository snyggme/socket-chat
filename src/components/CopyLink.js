import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

class CopyLink extends Component {
	constructor(props) {
		super(props);

		this.state = {
			copied: false
		}
	}
	render() {
		const { id } = this.props;
		const { copied } = this.state;

		return (
			<div className='share-link'>
				<CopyToClipboard 
					text={id}
					onCopy={() => {
						this.setState({ copied: true });
						setTimeout(() => {
							this.setState({ copied: false });
						}, 1000);
					}}
				>
					<FaCopy />
				</CopyToClipboard>
				{
					copied && <span>Link Copied!</span>
				}
			</div>
		)
	}
}

export default CopyLink;