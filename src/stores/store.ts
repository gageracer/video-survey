import { writable,readable,get } from 'svelte/store'
import { now } from './date'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics"

var firebaseConfig = {
    apiKey: "AIzaSyBHIiIKu2BjiEJEYb9njVVYm_ZfF1OEg_o",
    authDomain: "video-test-3a5aa.firebaseapp.com",
    databaseURL: "https://video-test-3a5aa-default-rtdb.firebaseio.com",
    projectId: "video-test-3a5aa",
    storageBucket: "video-test-3a5aa.appspot.com",
    messagingSenderId: "4975767435",
    appId: "1:4975767435:web:cb6a59e4b38f00ebbc098e",
    measurementId: "G-HN6FRCXJKV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().signInAnonymously()
    .then(() => {
        console.log("logged?")
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        firebase.auth().currentUser!.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            myTok.set(idToken)
        }).catch(function (error) {
            // Handle error
            console.log("this function is bad")
        });

        var uid = user.uid;
        console.log("state = definitely signed in",get(myTok))
    } else {
        console.log("state = definitely signed out")
    }
});


export const myTok = writable("")

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

export const salt = readable(stonA("PjbJ"), set => { set(stonA("PjbU"))})

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
