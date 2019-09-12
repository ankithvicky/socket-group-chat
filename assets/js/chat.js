var message = {};
var user;
var user_id;
var room_id = 'GRP001';
function onAuthenticate() {
    user = io.connect('http://localhost:4000/user');
    user.on('message-client', (msg, user_id, room_id) => {
        let chat = message[room_id] || [];
        chat.push({ msg, user_id, date: Date.now() });
        message[room_id] = chat;
        loadMessage(room_id);
    })
}
function getUserName() {
    var person = prompt("Please enter your name", "Harry Potter");

    if (person != null) {
        user_id = person;
        onAuthenticate();
    }
}
function selectChat(_id) {
    room_id = _id;
    loadMessage(_id);
}

function sendMessage() {
    let msg = document.getElementById('message-to-send').value;
    user.emit('message-server', msg, user_id, room_id);
}

getUserName();

function loadMessage(_groupid) {
    let container = document.getElementById('chat_history');
    let room_msg = message[_groupid] || [];
    let str = '';
    for (msg of room_msg) {
        str += ` <li class="clearfix">
        <div class="message-data align-right">
            <span class="message-data-time">${formatDate(msg.date)}</span> &nbsp; &nbsp;
            <span class="message-data-name">${msg.user_id}</span> <i class="fa fa-circle me"></i>
    
        </div>
        <div class="message other-message float-right">
            ${msg.msg}
        </div>
    </li>`
    }
    container.innerHTML = str;
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-').concat(` ${hour}:${min} `);
}