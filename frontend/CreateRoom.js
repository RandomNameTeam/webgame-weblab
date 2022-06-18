const onPlaySubmitted = () => {

    const title = document.getElementsByClassName("title");
    title[0].innerHTML("<p> Kapusta </p>");

}

const socket = io();
console.log(socket.id);

socket.on('created-room', () => {
    console.log("hi i am here");
    socket.emit('skills', "Damage");
})



const logging = () => {
    console.log("Yes")
}


