<script lang="typescript">
    import { salt, ntos } from '../stores/store'

    let videoUrl: string
    let videoName: string
    let videoGroup: string
    let videoDate: string
    let videoId: string | null

    let newLink = false
    let newLinks : {}[]
    let data : string

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
            newLink = false
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
        generateLinks()
        return true
    }

    const generateLinks = async() => {
        let d = videoDate.replaceAll('-','')
        let v = videoGroup
        const date = parseInt(d?.slice(-4)!,10)
        const vidId = parseInt(v.charCodeAt(0).toString(4),10)
        
        const link = (d: string,i:number,v:string,r:string) => {return { [i] : `https://whatsappstudy2021.vercel.app/?d=${d}&i=${i}&v=${v}&r=${r}`} }
        
        try{
            // Checking if the userID is true
                const resId= await fetch(`${(import.meta.env.SNOWPACK_PUBLIC_USER_URL)}userId/${v[0]}.json`)
                let idData = Object.keys(await resId.json())
                idData.forEach(el => {
                    //console.log(el)
                    const id = parseInt(el!,10)
                    const mid = date ^ id ^ vidId
                    const result = ntos($salt.map( x => (x ^ mid) % 512))
                    newLinks = newLinks ? [...newLinks, link(d,id,v,result)] : [link(d,id,v,result)]
                    //console.log(newLinks)
                });
        }
        catch(error) {
			console.log(error)
        }
        data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newLinks))
        newLink = true
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
        {#if newLink}
             <p>Here is the links for the users:</p>
             <a href="{`data:${data}`}" download="{`links_${videoDate}_${videoGroup}_${videoName}.json`}">download JSON</a>
        {/if}
        <p>All are mandatory. Youtube Video Link:</p>
        <input type="text" placeholder="example: https://www.youtube.com/watch?v=lo2GmBahoyI" bind:value={videoUrl}>
        <p>Video Group:</p>
        <input type="text" placeholder="example: a1" bind:value={videoGroup}>
        <p>Video Date to Watch:</p>
        <input type="date" placeholder="example: 02-09 (month-day)" bind:value={videoDate}>
        <p>Video Name:</p>
        <input type="text" placeholder="example: Maradona" bind:value={videoName}>
        <button on:click={submitVideo}>Submit</button>
     </div>