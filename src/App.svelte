<script lang='typescript'>
	import { onMount } from 'svelte';
	import YouTube from 'svelte-youtube'
	import { allData} from './stores/store'
	import { now,dated } from './stores/date'
	
	onMount(() => {
		operations = operations.length < 2 ?[{type: "Site Loaded", date: now(), videoTime: 0}] : [...operations,{type: "Site Loaded", date: now(), videoTime: 0}]
		const interval2 = setInterval(() => onMountTime++, 1000);
		checkIdVid().then(res => {
			linkValid = res
			sendFirstData()
		})
		return () => {
			clearInterval(interval2);
		};
	});

	// Parameters Test
	const params = (new URL(document.location.href)).searchParams
	const urlVid = params.get('v') // is the video info
	const uId = params.get('i')
	console.log("uid:",uId)
	$: console.log(videoId)
	// TODO: Cookies Part 
	


	// document.cookie("Set-Cookie: third_party_var=value; SameSite=None; Secure");
	//console.log(document.cookie)

	// System stuff
	const regex = /(?<=\?v=).{11}/
	let videoUrl = `https://www.youtube.com/watch?v=${urlVid}`
	let videoId = urlVid ? urlVid : ""
	let dev = false;
	let operations = [{type: "", date: "", videoTime: 0}]
	

	// All the tracked data
	let linkValid: boolean 
	let player: any
	let watchTime = 0
	let onMountTime = 0
	let playState = "not started yet"
	let vidInterval: any
	let curTime = 0
	const dataDate = dated()
	let sUrl = `https://video-test-3a5aa-default-rtdb.firebaseio.com/${dataDate}/${videoId}.json`
	// let dataName = (dated()+"-"+videoId).toString()
	// All the reactive variables
	$: videoId = urlVid ? urlVid : videoUrl.match(regex)!.toString()
	
	// The Store Update Part
	$: {
		$allData.linkId = window.location.href
		$allData.videoLink = videoUrl
		$allData.totalSiteTime = onMountTime
		$allData.totalWatchTime = watchTime
		$allData.operations = operations
		if(linkValid) sendData()
	}
	
	const checkIdVid = async() => {
		let idData = {}
		let vidData = {}
		try{
			// Checking if the userID is true
			const resId= await fetch(`https://video-test-3a5aa-default-rtdb.firebaseio.com/userId/${uId}.json`)
			// Checking if the VideoID is true
			const resVid = await fetch(`https://video-test-3a5aa-default-rtdb.firebaseio.com/videoList/${urlVid}.json`)
			idData = await resId.json()
			vidData = await resVid.json()
			if(vidData && idData){
				idData = {visited: idData.visited + 1}
				vidData = {visited: vidData.visited + 1}
				console.log("userid:",idData)
				console.log("vidlink:",vidData)
				
				// Changing the visited number
				const secondResId = await fetch(`https://video-test-3a5aa-default-rtdb.firebaseio.com/userId/${uId}.json`,{
					method: 'PATCH',
					body: JSON.stringify(idData),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				const secondResVid = await fetch(`https://video-test-3a5aa-default-rtdb.firebaseio.com/videoList/${urlVid}.json`,{
					method: 'PATCH',
					body: JSON.stringify(vidData),
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}else{
				console.log("goodbye world")
				return false
			}
		} 
		catch(error) {
			console.log(error)
		}
		return true
	}

	const sendFirstData = () => {
		fetch(sUrl,{
			method: 'POST',
			body: JSON.stringify($allData),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res =>{
			if(!res.ok){
				throw new Error('Failed!')
			}
			return res.json()
		})
		.then(data => {
			$allData.id = data.name
			sUrl = `https://video-test-3a5aa-default-rtdb.firebaseio.com/${dataDate}/${videoId}/${$allData.id}.json`
		})
		.catch(err =>{
			console.log(err)
		})
	}
	const sendData = () => {
		fetch(sUrl,{
			method: 'PATCH',
			body: JSON.stringify($allData),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res =>{
			if(!res.ok){
				throw new Error('Failed!')
			}
		})
		.catch(err =>{
			console.log(err)
		})
		return false
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
	
	// YT Player Event Listeners
	const onReady = (event: Event) => { 
		player = event; 
		operations = [...operations,{type: "Video Loaded", date: now(), videoTime: 0}]
		console.log(player.detail.target.getIframe())
		playState = "loaded"
	}

	const onPlay = () => {
		playState = "playing";
		clearInterval(vidInterval)
		vidInterval = setInterval(() => {(watchTime += 0.25)}, 250);
		curTime = (player != undefined) && player.detail.target.getCurrentTime().toFixed(2);
		operations = [...operations,{type: "Video Playing", date: now(), videoTime: curTime}]
	}

	const onPause = () => {
		playState = "paused"
		clearInterval(vidInterval)
		curTime = (player != undefined) && player.detail.target.getCurrentTime().toFixed(2);
		operations = [...operations,{type: "Video Paused", date: now(), videoTime: curTime}]
	}

	const onEnd = () => { 
		playState = "Ended";
		clearInterval(vidInterval)
		curTime = (player != undefined) && player.detail.target.getCurrentTime().toFixed(2);
		operations = [...operations,{type: "Video Ended", date: now(), videoTime: curTime}]
		console.log($allData)
		// setTimeout(()=>sendData(), 5000)
		//clearTimeout()
	}

	const onError = () => {
		isNoError = false;
	}

	const options = {
		playerVars: {
			controls: 1,
			autoplay: 0,
		}
	}
	// YT Player Stuff Ends
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
  

  <svelte:window on:beforeunload={sendData}/>
  <main class="App">
	
	{#if linkValid}
		<YouTube
			{videoId}   
			id="ytvid"
			class={"ytvid"}
			{options}
			on:play={onPlay} 
			on:pause={onPause}  
			on:ready={onReady}
			on:end={onEnd}
			on:error={onError}
		/>	 
	{:else}
		 <p>Invalid Link</p>
	{/if}

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
		<p>Parameters: {params}</p>
		<p>{$allData.userAgent}</p>
	</div>

	{/if}
</main>
  