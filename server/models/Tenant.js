const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    floor: {
      type: Number,
      required: true,
    },
    flat: {
      type: String,
      required: true,
    },
    tenantName: {
      type: String,
      required: true,
    },
    phone: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);
