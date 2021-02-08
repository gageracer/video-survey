<script lang="typescript">
    
    let videoUrl: string
    let videoName: string
    let videoGroup: string
    let videoDate: string
    let videoId: string | null

    // Checking the form inputs
    const checkInputs = () => {
        const regex = /(?<=\?v=).{11}/
        videoId = videoUrl ? videoUrl.match(regex)!.toString() : null
        const videoDateCheck = videoDate ? videoDate : null
        const videoGroupCheck = videoGroup.length == 2
        const videoNameCheck = videoName || null
        return videoId && videoDateCheck && videoGroupCheck && videoNameCheck
    }

    // Sending the new video to db
    const submitVideo = async() => {
        if(!checkInputs()) return false

        try {
            const resVid = await fetch(`${(import.meta.env.SNOWPACK_PUBLIC_VIDEO_URL)}videoList/${videoDate}/${videoGroup[0]}/${videoGroup[1]}.json`,{
                method: 'PUT',
                body: JSON.stringify(
                    {   
                        videoId: videoId,
                        visited: 0,
                        group: videoGroup,
                        name: videoName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if(!res.ok){
                    throw new Error('Failed!')
                }
                return res.json()
            }).then( () =>{
                console.log("succesful!")
            })
        } catch (error) {
            console.log(error)
        }
        return true
    }

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
		height: 1.5em;
		font-size: 1.2rem;
        margin-bottom: 1em;
	}
    
    .dev>button {
		width: auto;
		height: 1.5em;
		font-size: 1.2rem;
        margin-bottom: 1em;
	}

</style>

     <div class="dev">
        <p>All are mandatory. Youtube Video Link:</p>
        <input type="text" placeholder="example: https://www.youtube.com/watch?v=lo2GmBahoyI" bind:value={videoUrl}>
        <p>Video Group:</p>
        <input type="text" placeholder="example: a" bind:value={videoGroup}>
        <p>Video Date to Watch:</p>
        <input type="date" placeholder="example: 02-09 (month-day)" bind:value={videoDate}>
        <p>Video Name:</p>
        <input type="text" placeholder="example: Maradona" bind:value={videoName}>
        <button on:click={submitVideo}>Submit</button>
     </div>