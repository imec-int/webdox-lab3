var WebSocketServer = require('websocket').server;
var http = require('http');
var express = require('express');
var path = require('path');
var app = express();

var server = http.createServer(app);
var connections = {};
var connectionIDCounter = 0;

server.listen(7076, function() {
    console.log((new Date()) + ' Server is listening on port 7076');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});


function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}



app.use(express.static(path.join(__dirname, 'public')));


app.get('/d3', function(req,res){
    res.sendfile('public/client.html');
});


app.get('/start', function (req, res){
    console.log('Start request - connections to send to:' + connectionIDCounter);
    res.json("OK");
    for (var i = connectionIDCounter - 1; i >= 0; i--) {
            sendToConnectionId(connections[i].id, "testing");
    };

});


wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    connection.id = connectionIDCounter ++;
    connections[connection.id] = connection;

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        console.log('Received Message: ' + message);
        // if (message.type === 'utf8') {
        //

        //     connection.sendUTF(message.utf8Data);
        // }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
        for (var i = connectionIDCounter - 1; i >= 0; i--) {
            sendToConnectionId(connections[i].id, message.utf8Data);
        };


    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


function sendToConnectionId(connectionID, data) {
    // console.log(connectionID);
    var connection = connections[connectionID];
    // console.log('connected? '+ (connection && connection.connected));
    if (connection && connection.connected) {

        connection.sendUTF(data);
    }
}

