import { writable,readable } from 'svelte/store'
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

export const params = readable({d:"", i:"", v:"", r:""}, set =>{
    if(checkParams()) {
        const myParams = (new URL(document.location.href)).searchParams
        set({   
                d: myParams.get('d') || "",
                i: myParams.get('i') || "",
                v: myParams.get('v') || "",
                r: myParams.get('r') || "",
        })
    }
    return () => {};
})

// Function that checks the randomized token
function checkValidLink( myParams: URLSearchParams, paramsArr: [string,string][]) {
    if(!checkParamsKeys(paramsArr))
        return false
    
    const validator = parseInt(myParams.get('r')! ,10)
    const date = parseInt(myParams.get('d')?.slice(-4)!,10)
    const id = parseInt(myParams.get('i')!,10)
    const vidId = parseInt(myParams.get('v')?.charCodeAt(0).toString(4)!,10)
    const result = date ^ id ^ vidId
    // console.log("date is:",date)
    // console.log("id is:",id)
    // console.log("vidId is:",vidId)
    // console.log("validator:",validator," result:",result)
    return validator === result
}

// Function to check parameter key names
function checkParamsKeys(paramsArr:[string,string][]) {
    const regex = new RegExp(/[divr]/)
    return paramsArr.every( (ele:[string,string]) => regex.test(ele[0]) && ele[1]!.length != 0)
}

// Function to check if the parameters are valid
function checkParams(): boolean {
    const myParams = (new URL(document.location.href)).searchParams
    const paramsArr = Array.from(myParams)
    return paramsArr.length === 4 && checkValidLink(myParams, paramsArr)
}

export function isEmpty(obj: object) {
    for (var i in obj) return false;
    return true;
}
