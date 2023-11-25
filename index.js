const express = require('express');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
    console.log('Server test is running on port 3000');
});