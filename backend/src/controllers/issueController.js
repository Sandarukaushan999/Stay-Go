const { validationResult } = require('express-validator');
const IssueReport = require('../models/IssueReport');
const { createNotification } = require('../services/roommateNotificationService');
const { ISSUE_STATUS, NOTIFICATION_TYPE } = require('../constants/enums');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation failed', errors.array());
    }
}

// POST /api/issues — student create issue
exports.createIssue = async (req, res, next) => {
    try {
        checkValidation(req);

        const data = {
            ...req.body,
            studentId: req.studentId,
        };

        // If an image was uploaded via multer
        if (req.file) {
            data.attachmentImage = req.file.path;
        }

        const issue = await IssueReport.create(data);
        sendSuccess(res, 'Issue reported successfully', issue, 201);
    } catch (err) {
        next(err);
    }
};

// GET /api/issues/me — student's own issues
exports.getMyIssues = async (req, res, next) => {
    try {
        const issues = await IssueReport.find({ studentId: req.studentId }).sort({
            createdAt: -1,
        });
        sendSuccess(res, 'Issues retrieved', issues);
    } catch (err) {
        next(err);
    }
};

// GET /api/issues/:id — issue detail (student sees own, admin sees any)
exports.getIssueById = async (req, res, next) => {
    try {
        const issue = await IssueReport.findById(req.params.id).populate(
            'studentId',
            'firstName lastName email'
        );
        if (!issue) throw new ApiError(404, 'Issue not found');

        // Students can only see their own issues
        if (
            req.role !== 'admin' &&
            issue.studentId._id.toString() !== req.studentId
        ) {
            throw new ApiError(403, 'Access denied');
        }

        sendSuccess(res, 'Issue retrieved', issue);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/issues/:id — student edit (only if still SUBMITTED and belongs to them)
exports.updateIssue = async (req, res, next) => {
    try {
        checkValidation(req);

        const issue = await IssueReport.findById(req.params.id);
        if (!issue) throw new ApiError(404, 'Issue not found');

        if (issue.studentId.toString() !== req.studentId) {
            throw new ApiError(403, 'You can only edit your own issues');
        }
        if (issue.status !== ISSUE_STATUS.SUBMITTED) {
            throw new ApiError(400, 'Can only edit issues that are still in SUBMITTED status');
        }

        // Allow updating certain fields
        const allowedFields = ['title', 'description', 'category', 'priority', 'additionalNotes'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                issue[field] = req.body[field];
            }
        });

        if (req.file) {
            issue.attachmentImage = req.file.path;
        }

        await issue.save();
        sendSuccess(res, 'Issue updated', issue);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/issues/:id/status — admin update status
exports.updateIssueStatus = async (req, res, next) => {
    try {
        checkValidation(req);

        const issue = await IssueReport.findById(req.params.id);
        if (!issue) throw new ApiError(404, 'Issue not found');

        issue.status = req.body.status;
        await issue.save();

        // Notify the student about status change
        await createNotification(
            issue.studentId,
            NOTIFICATION_TYPE.ISSUE_STATUS_UPDATED,
            'Issue Status Updated',
            `Your issue "${issue.title}" status changed to ${issue.status}.`,
            issue._id
        );

        sendSuccess(res, 'Issue status updated', issue);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/issues/:id/comment — admin add comment
exports.addAdminComment = async (req, res, next) => {
    try {
        checkValidation(req);

        const issue = await IssueReport.findByIdAndUpdate(
            req.params.id,
            { adminComment: req.body.adminComment },
            { new: true }
        );
        if (!issue) throw new ApiError(404, 'Issue not found');

        sendSuccess(res, 'Admin comment added', issue);
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/issues — admin list all issues with filters
exports.listAllIssues = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.priority) filter.priority = req.query.priority;

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const skip = (page - 1) * limit;

        const [issues, total] = await Promise.all([
            IssueReport.find(filter)
                .populate('studentId', 'firstName lastName email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            IssueReport.countDocuments(filter),
        ]);

        sendSuccess(res, 'Issues retrieved', {
            issues,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        next(err);
    }
};
