
const onPlaySubmitted = (sock) => (e) =>{
    e.preventDefault();

    const input = document.querySelector('#name');
    const text = input.value;
    input.value = '';

    sock.emit('Registred', (sock, text));
}

(() =>{

    const sock = io();
    sock.on('connect', () => {
        console.log(sock.id);
    })

    sock.on('something', (text) =>{
        console.log(text);
    })
   /* document
        .querySelector("#name-form")
        .addEventListener('submit', onPlaySubmitted(sock));*/
})();