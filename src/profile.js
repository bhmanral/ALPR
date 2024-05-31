const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).json({ message: 'ok' });

})

module.exports = router;