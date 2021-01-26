// Time calculations for days, hours, minutes and seconds
// var days = Math.floor(distance / (1000 * 60 * 60 * 24));
// var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
// var seconds = Math.floor((distance % (1000 * 60)) / 1000);
// me.innerText = days + "d " + hours + "h "
//     + minutes + "m " + seconds + "s ";


export function now() {
    return new Date().toString()
}

export function dated() {
    const time = new Date()
    return (time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()).toString()
}