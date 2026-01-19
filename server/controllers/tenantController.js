// /server/controllers/tenantController.js
const Tenant = require('../models/Tenant');

exports.addTenant = async (req, res) => {
  try {
    const { floor, flat, tenantName, phone } = req.body;
    if (floor == null || !flat || !tenantName)
      return res.status(400).json({ message: 'Missing required fields' });

    // Optional: prevent duplicate flat at same floor
    const exists = await Tenant.findOne({ floor, flat });
    if (exists)
      return res
        .status(400)
        .json({ message: 'Tenant for this floor+flat already exists' });

    const tenant = await Tenant.create({
      floor,
      flat,
      tenantName,
      phone,
      createdBy: req.user.id,
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error('Add tenant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ floor: 1, flat: 1 });
    res.json(tenants);
  } catch (error) {
    console.error('Get tenants:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    console.error('Get tenant by id:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    console.error('Update tenant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json({ message: 'Tenant deleted' });
  } catch (error) {
    console.error('Delete tenant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
