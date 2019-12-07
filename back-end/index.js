const Server = require('./server/server');

function main() {
    console.log('Starting APP..');
  
    const server = new Server();

    server.init();
}

main();