const express = require('express');
const app = express();

// Route handler for the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});