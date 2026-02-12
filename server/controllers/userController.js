import { v2 as cloudinary } from 'cloudinary';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';

// Get User Data
export const getUserData = async (req, res) => {
	const userId = req.auth.userId;

	try {
		const user = await User.findById(userId);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: 'User Not Found' });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Apply For Job
export const applyForJob = async (req, res) => {
	const { jobId } = req.body;

	const userId = req.auth.userId;

	try {
		const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });

		if (isAlreadyApplied) {
			return res
				.status(409)
				.json({
					success: false,
					message: 'You have already applied for this job',
				});
		}

		const jobData = await Job.findById(jobId);

		if (!jobData) {
			return res.status(404).json({ success: false, message: 'Job Not Found' });
		}

		await JobApplication.create({
			companyId: jobData.companyId,
			userId,
			jobId,
		});

		res.status(201).json({ success: true, message: 'Applied Successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Get User Applied Applications Data
export const getUserJobApplications = async (req, res) => {
	try {
		const userId = req.auth.userId;

		const applications = await JobApplication.find({ userId })
			.populate('companyId', 'name email image')
			.populate('jobId', 'title description location category level salary')
			.exec();

		return res.status(200).json({ success: true, applications });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Update User Resume
export const updateUserResume = async (req, res) => {
	try {
		const userId = req.auth.userId;

		const resumeFile = req.file;

		const userData = await User.findById(userId);

		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: 'User not found' });
		}

		if (resumeFile) {
			const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
			userData.resume = resumeUpload.secure_url;
		} else {
			return res
				.status(400)
				.json({ success: false, message: 'No resume file provided' });
		}

		await userData.save();

		return res
			.status(200)
			.json({
				success: true,
				message: 'Resume Updated',
				resume: userData.resume,
			});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};
