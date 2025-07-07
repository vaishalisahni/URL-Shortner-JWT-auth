const express = require('express');

const router= express.Router();

const { handleGenerateNewShortURL , handleGetOriginalURL , handleGetAnalytics } = require('../controllers/url');

router.post('/', handleGenerateNewShortURL);

router.get('/:shortId', handleGetOriginalURL);

router.get('/analytics/:shortId',handleGetAnalytics)

module.exports = router;