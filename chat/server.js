const app = require('express')(),
      http = require('http').createServer(app),
      io = require('socket.io')(http),
      uuid = require('uuid');

const PORT = 8080;

let clients = [];

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{
    console.log('Client has joined.');

    let client = new Object;
    client.id = socket.id;
    client.nick = "Anon";
    clients.push(client);
    console.log(clients);
    io.emit('chat message', `${client.nick} has joined.`)
    // client();
    
    socket.on('chat message', (msg)=>{
        console.log('message: ' + msg);
        if(msg.slice(0,4)==="nick"){
            changeNick(socket, msg);
        } else {
            broadcastMsg(socket, msg);
        }

    });

    socket.on('disconnect',()=>{
        console.log('Client disconnected.', socket.id)
        let cli = clients.findIndex(i=> i.id === socket.id)

        if(cli>-1){
            clients.splice(cli,1);
        }
        console.log(clients);
    });
});

http.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
});

function client(socket){
    
    let id = uuid.v4();

    let time = new Date();
    time = (time.getHours()%12)+":"+time.getMinutes();
    let client = 
    {
        id: id,
        age: time
    }
    clients.push(client);
    console.log(clients);
}

function changeNick(socket, msg){
    console.log('change nick');
    let cli = clients.findIndex(i=> i.id === socket.id)
    
    if(cli>-1){
        clients.slice(cli,1);
    }            
    newNick=msg.slice(4);;
    io.emit('chat message', `${clients[cli].nick} is now ${newNick}.`)            
    clients[cli].nick=newNick;
    console.log(cli)
}


function broadcastMsg(socket, msg){
            let cli = clients.findIndex(i=> i.id === socket.id)
            msg = clients[cli].nick + " says " + msg;
            io.emit('chat message',  msg);
}