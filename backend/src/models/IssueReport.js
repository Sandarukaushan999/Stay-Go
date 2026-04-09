const mongoose = require('mongoose');
const { ISSUE_CATEGORY, ISSUE_PRIORITY, ISSUE_STATUS } = require('../constants/enums');

const issueReportSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: Object.values(ISSUE_CATEGORY),
        },
        priority: {
            type: String,
            required: true,
            enum: Object.values(ISSUE_PRIORITY),
        },
        attachmentImage: { type: String, default: null },
        additionalNotes: { type: String, default: null },
        status: {
            type: String,
            required: true,
            enum: Object.values(ISSUE_STATUS),
            default: ISSUE_STATUS.SUBMITTED,
        },
        roomNumber: { type: String, default: null },
        adminComment: { type: String, default: null },
    },
    { timestamps: true }
);

issueReportSchema.index({ studentId: 1 });

module.exports = mongoose.model('IssueReport', issueReportSchema);
