import { writable,readable,get } from 'svelte/store'
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


export const stonA =  (str: string) => {
    let result = []
    for (const key of str) {
        result.push(key.charCodeAt(0))
    }
    return result
}

export const stonA2 = (str: string) => {
    let result = []
    let slt = get(salt).reduce((acc, cur) => acc ^ cur)
    console.log(slt)
    for (const key of str) {
        result.push(key.charCodeAt(0) ^ slt)
    }
    return result
}
export const salt = readable(stonA("PjbJ"), set => { set(stonA("PjbU"))})

export const testCode = readable([] as number[], set => { set(stonA2("https://video-test-3a5aa-users-rtdb.firebaseio.com/")) })

export const speDec = (num: string) => {
    let result = ""
    // turn the string to number Array
    let arr = stonA(num)
    console.log("arr is:", arr)
    // get the salt
    let slt = get(salt).reduce((acc, cur) => acc ^ cur)
    console.log("salt is:", slt)
    // decrypt the message
    for (const key of arr) {
        result += (key ^ slt ) != 127 ? String.fromCharCode(key ^ slt) : String.fromCharCode(114)
    }
    return result
}
export const ntos = (num: number[]) => {
    let result = ""
    for (const key of num) {
        result += key
    }
    return result
}


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
    
    const validator = myParams.get('r')
    const date = parseInt(myParams.get('d')?.slice(-4)!,10)
    const id = parseInt(myParams.get('i')!,10)
    const vidId = parseInt(myParams.get('v')?.charCodeAt(0).toString(4)!,10)
    const mid = date ^ id ^ vidId
    const result = ntos(get(salt).map( x => (x ^ mid) % 512))
    // console.log("date is:",date)
    // console.log("id is:",id)
    // console.log("vidId is:",vidId)
    // console.log("validator:",validator," result:",result)
    // console.log(result)
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