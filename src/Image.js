import React, { useEffect, useState } from 'react';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const Image = () => {
	const [imageUrl, setImageurl] = useState('');

	useEffect(() => {
		ipcRenderer.on('image', (event, arg) => {
			setImageurl(arg);
		});
	}, []);

	return (
		<div>
			<img src={imageUrl} style={{ maxWidth: '100%' }} />
		</div>
	);
};

export default Image;
