import { writable } from 'svelte/store'
import { now } from './date'

export const allData = writable({
    id: "",
    partId: "",
    userAgent: navigator.userAgent,
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

export function isEmpty(obj: object) {
    for (var i in obj) return false;
    return true;
}