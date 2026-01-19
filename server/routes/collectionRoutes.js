const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  addCollection,
  myCollections,
  allCollections,
  myMonthlySummary,
  myYearlySummary,
  buildingSummary,
  chartData,
  adminSummary,
} = require('../controllers/collectionController');
// Admin summary for dashboard
router.get('/admin-summary', auth, adminSummary);

router.post('/', auth, addCollection);
router.get('/my', auth, myCollections);
router.get('/', auth, allCollections);

// summaries
router.get('/summary/my/monthly', auth, myMonthlySummary);
router.get('/summary/my/yearly', auth, myYearlySummary);
router.get('/summary/building', auth, buildingSummary);

// chart
router.get('/chart', auth, chartData);

module.exports = router;
