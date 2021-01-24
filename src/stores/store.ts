import { writable } from 'svelte/store'
import { now } from './date'

// let videoId = "ch0NEbfP0kY";
// let dev = true;
// let player: any;
// let curTime = 0;
// let playState = "not started yet";


export const allData = writable({
    linkId: "",
    videoLink: "",
    date: now(),
    totalSiteTime: 0,
    totalWatchTime: 0,
    operations: [
        {
            type: "",// started video / paused video / website opened / video finished / website closed
            date: "",// when this operation happened
            videoTime: 0, // The video track time
        },
    ]
})
