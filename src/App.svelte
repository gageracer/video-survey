<script lang='typescript'>
	import {onMount} from 'svelte';
	import YouTube from 'svelte-youtube'

	let onMountTime = 0;
	onMount(() => {
	  const interval2 = setInterval(() => onMountTime++, 1000);
	  return () => {
		clearInterval(interval2);
	  };
	});

	
	// All the tracked data
	let videoUrl = "https://www.youtube.com/watch?v=UkQCuJgKT5g"
	let videoId = videoUrl.split('=')[1];
	let dev = false;
	let player: any;
	let curTime = 0;
	let playState = "not started yet";
	let vidInterval: any;

	$: videoId = videoUrl.split('=')[1];
	// DEVMODE STUFF
	const devCode = 'd,e,v,m'
	let cheatCode : any[] = []
	document.onkeypress = (event) => {
		let char = (typeof event !== 'undefined') ? event.key : null
		console.log("char is",char)
		
		if (cheatCode.length > 3) {
			[, ...cheatCode] = cheatCode
		}

		cheatCode = [...cheatCode, char.toLowerCase()]

		// check cheat
		if (cheatCode.toString() === devCode) {
			dev = !dev
		}
		console.log(dev," and code is: ",cheatCode)
	}
	
	const onReady = (event: Event) => { 
		player = event; 
		// curTime = player.detail.target.getCurrentTime();
		event.detail.target.playVideo();
		console.log(player.detail.target)
		//topCard.style.display = "none";
	}

	const onPlay = () => {
		// player= event.detail.target; 
		console.log(player)
		//curTime = player.getCurrentTime();
		playState = "playing";
		clearInterval(vidInterval)
		vidInterval = setInterval(() => curTime += 0.25, 250);
		console.log("playing");
		let topCard = document.getElementsByClassName("ytp-chrome-top.ytp-show-cards-title")
		console.log(topCard)
	}

	const onPause = () => {
		// player= event.detail.target; 
		//curTime = player.getCurrentTime();
		playState = "paused"
		console.log("paused")
		clearInterval(vidInterval)
		console.log(player.target)
	}

	const onEnd = () => { 
		playState = "Ended";
		clearInterval(vidInterval)
	}

	 const options = {
		playerVars: {
			controls: 1,
			
		}
	}
  </script>
  
  <style>
	:global(html,body) {
		position: relative;
		width: 100%;
		height: 100%;
	}
	:global(body) {
		margin: 0;
		width: 100%;
		position: relative;
		font-family: Arial, Helvetica, sans-serif;
		background-color: #f9f6f6;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	:global(.ytvid) {
		position: relative;
		overflow: hidden;
		width: 100vw;
		padding-top: 56.25%;
	}
	:global(#ytvid) {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}
	.App{
	  color: #333;
	  min-height: 100vh;
	  width: 100vw;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  font-size: calc(10px + 2vmin);
	}
	.dev {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		width: 50vw;
		font-size: 1.2rem;
		background-color: lightblue;
		padding-left:1rem;
	}

	.dev>input {
		width: 95%;
		height: 2em;
		font-size: 1.2rem;
	}
  </style>
  
  <main class="App">
	<YouTube
		{videoId}   
		id="ytvid"
		class={"ytvid"}
		{options}
		on:play={onPlay} 
		on:pause={onPause}  
		on:ready={onReady}
		on:end={onEnd}
	/>
	<!-- Dev View to see the variables working -->
	{#if dev}
	<div class="dev">
		<p>Full URL: {window.location.href}</p>
		<p>Host Name: {window.location.hostname}</p>
		<p>Path Name: {window.location.pathname}</p>
		<p>Put a youtube video link to change the video here:</p>
		<input type="text" bind:value={videoUrl}>
		<p>Your session time: {onMountTime}</p>
		<p>Current Watched time: {curTime}</p>
		<p>Player State is: {playState}</p>
	</div>

	{/if}
</main>
  