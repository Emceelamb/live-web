const app = require('express')(),
      http = require('http').createServer(app),
      io = require('socket.io')(http);

const PORT = 8080;

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{
    console.log('A user has joined.');
    socket.on('disconnect',()=>{console.log('user disconnected')});
    socket.on('chat message', (msg)=>{
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
});
