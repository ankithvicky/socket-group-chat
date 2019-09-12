var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT_NUMBER = 4000;

app.use(express.static('assets'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/chat.html');
});

let groups = [
    { id: 'GRP001', Name: 'Benki' },
    { id: 'GRP002', Name: 'SCH' },
];

let users = [
    { id: 'USR001', Name: 'Vicky' },
    { id: 'USR002', Name: 'Ragav' }
]

//Sockets
var user = io.of('/user');
user.on('connection', function (socket) {
    groups.forEach(row => {
        socket.join(row.id);
    });
    socket.on('message-server', (msg, user_id, room_id) => {
        console.log("message got in server");
        user.to(room_id).emit('message-client', msg, user_id, room_id);
    })
});

http.listen(PORT_NUMBER, (err) => {
    if (err)
        console.log(err);
    console.log(`Listening on the port ${PORT_NUMBER}`)
})