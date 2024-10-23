const express = require('express');
const router = express.Router();

// Example route for flashcards
router.get('/', (req, res) => {
    res.send('Flashcards route working');
});

module.exports = router;