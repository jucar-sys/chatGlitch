// Dinamismo en tiempo real con sockets
const socket = io();
let user = sessionStorage.getItem('user') || '';
const chatbox = document.getElementById('chatbox');

if(!user){
    Swal.fire({
        title: 'Auth',
        input: 'text',
        text: 'Set username',
        inputValidator: value => {
            return !value.trim() && 'Por favor ingresa tu nombre de usuario'
        },
        allowOutsideClick: false,
    }).then(result => {
        user = result.value;
        document.getElementById('username').innerHTML = user;
        sessionStorage.setItem("user", user);
        socket.emit('new', user);
    });
} else {
    document.getElementById('username').innerHTML = user;
    socket.emit('new', user);
}

// Enviar mensajes
chatbox.addEventListener('keyup', event => {
    if(event.key === 'Enter'){
        const message = chatbox.value.trim();
        if(message.length > 0){
            socket.emit('message', {
                user,
                message
            });
            chatbox.value = '';
        }
    }
});

// Recibir mensajes
socket.on('logs', data => {
    const divLogs = document.getElementById('logs');
    let messages = '';

    data.forEach(message => {
        messages = `<p><i>${message.user}</i>: ${message.message}</p>` + messages;
    });

    divLogs.innerHTML = messages;
});
