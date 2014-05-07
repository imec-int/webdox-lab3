
function connect() {
    var url = "ws://127.0.0.1:7076"

    var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
    this.socket = new wsCtor(url, 'echo-protocol');

    console.log("connected oh yeah!");

    this.socket.onmessage = this.handleWebsocketMessage.bind(this);
    this.socket.onclose = this.handleWebsocketClose.bind(this);

};

function handleWebsocketMessage(message) {
    console.log('handling websocketmessage' + message);
    try {
        var D3object = JSON.parse(message.data);
            }
    catch(e) { /* do nothing */ }

    if (D3object.type  = "rect") {
        console.log(D3object);
        rectdata.push(D3object);
        drawrect(rectdata);
    }
};

function handleWebsocketClose() {
    console.log("WebSocket Connection Closed.");
};


function init(){
    var w = 1920,h = 1080;
    var svg;
    var rectdata = [];
    svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr('class','background');
};


// function rect(data) {
//     svgback.selectAll("rect")
//      .data

// };

function drawrect(data){
    svgback.selectAll("rect")
        .data(data)
        .enter
}



$(function(){
    connect();
    init();
});