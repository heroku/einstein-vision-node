const createServer = require('./server');
const server = createServer();

const PORT = process.env.PORT || 5000;

server.listen(PORT, function() {
  console.log('Image Identifier is running on port', PORT);
});
