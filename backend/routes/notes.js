const express = require('express');
const router = express.Router();

// Example route for notes
router.get('/', (req, res) => {
    res.send('Notes route working');
});

module.exports = router;