const router = require('express').Router();
const auth = require('../middleware/authMiddleware');

const {
 addTenant,
 getTenants,
 updateTenant,
 deleteTenant
} = require('../controllers/tenantController');

// Add a new tenant
router.post('/', auth, addTenant);
// Get all tenants
router.get('/', auth, getTenants);
// Update a tenant
router.put('/:id', auth, updateTenant);
// Delete a tenant
router.delete('/:id', auth, deleteTenant);

module.exports = router;