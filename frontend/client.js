const onPlaySubmitted = (sock) => (e) =>{
    e.preventDefault();

    const input = document.querySelector('#name');
    const text = input.value;
    input.value = '';

    sock.emit('Registred', text);
}

(() =>{

    const sock = io();

   /* document
        .querySelector("#name-form")
        .addEventListener('submit', onPlaySubmitted(sock));*/
})();