const net = require('net');
const client = new net.Socket();
client.connect(5432, 'portquiz.net', function() {
    console.log('Connected to portquiz.net:5432');
    client.destroy();
});
client.on('error', function(err) {
    console.error('Connection error: ' + err.message);
});
