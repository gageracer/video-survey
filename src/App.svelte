<script lang='typescript'>
	import {onMount} from 'svelte';
	import YouTube from 'svelte-youtube'
	import { allData } from './stores/store'
	import { now } from './stores/date'
	
	onMount(() => {
		oprerations = oprerations.length < 2 ?[{type: "Site Loaded", date: now(), videoTime: 0}] : [...oprerations,{type: "Site Loaded", date: now(), videoTime: 0}]
		const interval2 = setInterval(() => onMountTime++, 1000);
		return () => {
			clearInterval(interval2);
		};
	});
	
	// TODO: Cookies Part 
	
	// document.cookie("Set-Cookie: third_party_var=value; SameSite=None; Secure");
	//console.log(document.cookie)
	// All the tracked data
	let onMountTime = 0;
	let videoUrl = "https://www.youtube.com/watch?v=UkQCuJgKT5g"
	let videoId = videoUrl.split('=')[1];
	let dev = false;
	let player: any;
	let watchTime = 0;
	let playState = "not started yet";
	let vidInterval: any;
	let curTime = 0;
	let oprerations = [{type: "", date: "", videoTime: 0}]
	

	// All the reactive variables
	$: videoId = videoUrl.split('=')[1];

	// The Store Update Part
	$: {
		$allData.linkId = window.location.href;
		$allData.videoLink = videoUrl
		$allData.totalSiteTime = onMountTime
		$allData.totalWatchTime = watchTime
		$allData.operations = oprerations
	}
	
	// DEVMODE STUFF
	const devCode = 'd,e,v,m'
	let cheatCode : any[] = []
	document.onkeypress = (event) => {
		let char = (typeof event !== 'undefined') ? event.key : ''
		//console.log("char is",char)
		
		if (cheatCode.length > 3) {
			[, ...cheatCode] = cheatCode
		}

		cheatCode = [...cheatCode, char.toLowerCase()]

		// check cheat
		if (cheatCode.toString() === devCode) {
			dev = !dev
		}
		//console.log(dev," and code is: ",cheatCode)
	}
	
	const onReady = (event: Event) => { 
		player = event; 
		oprerations = [...oprerations,{type: "Video Loaded", date: now(), videoTime: 0}]
	}

	const onPlay = () => {
		playState = "playing";
		clearInterval(vidInterval)
		vidInterval = setInterval(() => {(watchTime += 0.25)}, 250);
		curTime = (player != undefined) && player.detail.target.getCurrentTime().toFixed(2);
		oprerations = [...oprerations,{type: "Video Playing", date: now(), videoTime: curTime}]
	}

	const onPause = () => {
		playState = "paused"
		clearInterval(vidInterval)
		curTime = (player != undefined) && player.detail.target.getCurrentTime().toFixed(2);
		oprerations = [...oprerations,{type: "Video Paused", date: now(), videoTime: curTime}]
	}

	const onEnd = () => { 
		playState = "Ended";
		//console.log("ended ",now())
		clearInterval(vidInterval)
		curTime = (player != undefined) && player.detail.target.getCurrentTime().toFixed(2);
		oprerations = [...oprerations,{type: "Video Ended", date: now(), videoTime: curTime}]
		console.log($allData)
	}
	now
	const options = {
		playerVars: {
			controls: 1,
			autoplay: 0,
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
		width: 95vw;
		padding-top: 47%;
		display: flex;
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
	:global(#movie_player > div.ytp-chrome-top.ytp-show-cards-title) {
		display: none
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
		<p>Put a youtube video link to change the video here:</p>
		<input type="text" bind:value={videoUrl}>
		<p>Your session time: {onMountTime}</p>
		<p>Current Watched time: {watchTime}</p>
		<p>Videos Current time: {curTime}</p>
		<p>Player State is: {playState}</p>
		<p>Full URL: {window.location.href}</p>
		<p>Host Name: {window.location.hostname}</p>
		<p>Path Name: {window.location.pathname}</p>
	</div>

	{/if}
</main>
  