import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const Menu = electron.remote.Menu;

function App() {
	const [posts, setPosts] = useState([]);

	const getFetch = async () => {
		await fetch('https://www.reddit.com/r/aww.json')
			.then((res) => res.json())
			.then((data) => {
				console.log(data.data.children);
				setPosts(data.data.children);
			})
			.catch((err) => {
				throw err;
			});
	};

	useEffect(() => {
		initMenu();
	}, []);

	useEffect(() => {
		getFetch();
	}, []);

	const showImage = (image) => {
		ipcRenderer.send('open-image', image);
	};

	const initMenu = () => {
		const menu = Menu.buildFromTemplate([
			{
				label: 'File',
				submenu: [
					{ label: 'New Window' },
					{
						label: 'Settings',
						accelerator: 'CmdOrCtrl+,',
						click: () => {
							ipcRenderer.send('toggle-settings');
						},
					},
					{ type: 'separator' },
					{
						label: 'Quit',
						accelerator: 'CmdOrCtrl+Q',
					},
				],
			},
			{
				label: 'Edit',
				submenu: [{ label: 'Menu Item 1' }, { label: 'Menu Item 2' }, { label: 'Menu Item 3' }],
			},
		]);
		Menu.setApplicationMenu(menu);
	};

	return (
		<div>
			<Grid>
				<ul>
					{posts.map((post, index) => (
						<li key={index} onClick={() => showImage(post.data.thumbnail)}>
							{post.data.title}
						</li>
					))}
				</ul>
			</Grid>
		</div>
	);
}

export default App;
