<script lang='typescript'>
    import NewVideo from './NewVideo.svelte'
    
    // Props
    export let videoUrl: string
    export let onMountTime: number
    export let watchTime: number
    export let curTime: number
    export let playState: string
    export let paramNum = Array.from((new URL(document.location.href)).searchParams).length
    export let userAgent: string

    // state
    let addVideoPanel = false

</script>

<style>
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
    button {
        margin: 1em 1em;
        font-size: 1.2rem;
    }
</style>


{#if addVideoPanel}
    <NewVideo/>
    <button on:click="{() => addVideoPanel = false}">Stats</button>   
{:else}
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
        <p>Parameters: {paramNum}</p>
        <p>{userAgent}</p>

    </div>
    <button on:click="{() => addVideoPanel = true}">Add Video</button>
{/if}