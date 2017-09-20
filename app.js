var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/',function(req,res){
    res.sendfile('index.html');
});

// app.post('/fileupload',function(req,res){
//     var form = new formidable.IncomingForm();
//      var oldpath = files.filetoupload.path;
//       var newpath = 'C:/Users/' + files.filetoupload.name;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.write('File uploaded and moved!');
//         res.end();
//       });
// });

var clients = 0;

io.on('connection',function(socket,formidable,fs){
    console.log(fs);
    socket.formidable = formidable;
    socket.files = fs;
    clients++;
   console.log('A user connected');

// broadcasting
io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
//end

//clients disconnected
 socket.on('disconnect', function () {
	       clients--;
	        io.sockets.emit('broadcast',{ disconnectUser : socket.userName});
 });
//end


setTimeout(function() {
    socket.send("Message from a socket event");
},4000);

// creating a custom event
setTimeout(function() {
    socket.emit('testEvent',{description:"A custom event fired"});
}, 2000);

// end
//client name	
socket.on('clientName', function(data){
    socket['userName'] = data.sendTest;
 });

// custome event from client
socket.on('clientEvent', function(data){
    console.log(fs);
     io.sockets.emit('passData',{description:data.sendData, userName : data.sendName, fileValue: data.FileData});
 });
//end

// socket.on('disconnect',function(){
//     console.log('User disconnected.');
// });
});

http.listen(process.env.PORT || 8082,function(){
    console.log("The server started.");
})
