/**
 * Admin summary for dashboard: returns [{adminId, name, email, total, count}]
 */
exports.adminSummary = async (req, res) => {
  try {
    // Get all admins' total collection and count
    const summary = await Collection.aggregate([
      {
        $group: {
          _id: '$collectedBy',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'admin',
        },
      },
      { $unwind: '$admin' },
      {
        $project: {
          adminId: '$admin._id',
          name: '$admin.name',
          email: '$admin.email',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
    res.json(summary);
  } catch (error) {
    console.error('Admin summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// /server/controllers/collectionController.js
const Collection = require('../models/Collection');
const Tenant = require('../models/Tenant');
const mongoose = require('mongoose');

/**
 * Helper: compute month and year for collection
 */
const computeMonthYear = date => {
  const d = date ? new Date(date) : new Date();
  return { month: d.getMonth() + 1, year: d.getFullYear() };
};

exports.addCollection = async (req, res) => {
  try {
    const { tenantId, amount, date, note, floor, flat, tenantName, phone } =
      req.body;

    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    let tenant = null;
    // If tenantId provided, use it. If not, optional create or link by floor+flat.
    if (tenantId) {
      if (!mongoose.Types.ObjectId.isValid(tenantId))
        return res.status(400).json({ message: 'Invalid tenantId' });
      tenant = await Tenant.findById(tenantId);
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    } else {
      // Create or find by floor+flat
      if (floor == null || !flat || !tenantName)
        return res.status(400).json({
          message:
            'Provide tenant info (floor, flat, tenantName) when no tenantId',
        });

      tenant = await Tenant.findOne({ floor, flat });
      if (!tenant) {
        tenant = await Tenant.create({
          floor,
          flat,
          tenantName,
          phone,
          createdBy: req.user.id,
        });
      }
    }

    const { month, year } = computeMonthYear(date);
    const coll = await Collection.create({
      tenantId: tenant._id,
      collectedBy: req.user.id,
      amount,
      date: date ? new Date(date) : new Date(),
      month,
      year,
      note,
    });

    res.status(201).json(coll);
  } catch (error) {
    console.error('Add collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ collectedBy: req.user.id })
      .populate('tenantId')
      .sort({ date: -1 });

    res.json(collections);
  } catch (error) {
    console.error('My collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.allCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate('tenantId')
      .populate('collectedBy', 'name email')
      .sort({ date: -1 });

    res.json(collections);
  } catch (error) {
    console.error('All collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Monthly summary for logged-in admin
 */
exports.myMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query; // optional
    const qMonth = parseInt(month) || new Date().getMonth() + 1;
    const qYear = parseInt(year) || new Date().getFullYear();

    const summary = await Collection.aggregate([
      {
        $match: {
          collectedBy: new mongoose.Types.ObjectId(req.user.id),
          month: qMonth,
          year: qYear,
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json(summary[0] || { total: 0, count: 0 });
  } catch (error) {
    console.error('My monthly summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Yearly summary for logged-in admin
 */
exports.myYearlySummary = async (req, res) => {
  try {
    const { year } = req.query;
    const qYear = parseInt(year) || new Date().getFullYear();

    const summary = await Collection.aggregate([
      {
        $match: {
          collectedBy: new mongoose.Types.ObjectId(req.user.id),
          year: qYear,
        },
      },
      {
        $group: {
          _id: '$month',
          month: { $first: '$month' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.json(summary);
  } catch (error) {
    console.error('My yearly summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Summary across all admins (total building collection)
 */
exports.buildingSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const match = {};
    if (month) match.month = parseInt(month);
    if (year) match.year = parseInt(year);

    const summary = await Collection.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$collectedBy',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'admin',
        },
      },
      { $unwind: '$admin' },
      {
        $project: {
          adminId: '$admin._id',
          name: '$admin.name',
          email: '$admin.email',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Also compute overall total
    const overall = await Collection.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json({
      byAdmin: summary,
      overall: overall[0] || { total: 0, count: 0 },
    });
  } catch (error) {
    console.error('Building summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Chart data endpoint (monthly trend across a year)
 * returns: [{ month: 1, total: 1000 }, ...]
 */
exports.chartData = async (req, res) => {
  try {
    const { year } = req.query;
    const qYear = parseInt(year) || new Date().getFullYear();

    const data = await Collection.aggregate([
      { $match: { year: qYear } },
      {
        $group: {
          _id: '$month',
          month: { $first: '$month' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Ensure all months present (1..12)
    const monthsMap = {};
    data.forEach(d => (monthsMap[d.month] = d.total));
    const full = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: monthsMap[i + 1] || 0,
    }));

    res.json(full);
  } catch (error) {
    console.error('Chart data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
