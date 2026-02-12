import Company from '../models/Company.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from '../utils/generateToken.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';

// Register a new company
export const registerCompany = async (req, res) => {
	const { name, email, password } = req.body;

	const imageFile = req.file;

	if (!name || !email || !password || !imageFile) {
		return res
			.status(400)
			.json({ success: false, message: 'All fields are required' });
	}

	try {
		const companyExists = await Company.findOne({ email });

		if (companyExists) {
			return res
				.status(409)
				.json({
					success: false,
					message: 'Company with this email already exists',
				});
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const imageUpload = await cloudinary.uploader.upload(imageFile.path);

		const company = await Company.create({
			name,
			email,
			password: hashPassword,
			image: imageUpload.secure_url,
		});

		res.status(201).json({
			success: true,
			company: {
				_id: company._id,
				name: company.name,
				email: company.email,
				image: company.image,
			},
			token: generateToken(company._id),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Login Company
export const loginCompany = async (req, res) => {
	const { email, password } = req.body;

	try {
		const company = await Company.findOne({ email });

		// Check if company exists and then compare password
		if (company && (await bcrypt.compare(password, company.password))) {
			res.status(200).json({
				success: true,
				company: {
					_id: company._id,
					name: company.name,
					email: company.email,
					image: company.image,
				},
				token: generateToken(company._id),
			});
		} else {
			res
				.status(401)
				.json({ success: false, message: 'Invalid email or password' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Get Company Data
export const getCompanyData = async (req, res) => {
	try {
		const company = req.company;

		res.status(200).json({ success: true, company });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Post New Job
export const postJob = async (req, res) => {
	const { title, description, location, salary, level, category } = req.body;

	if (!title || !description || !location || !salary || !level || !category) {
		return res
			.status(400)
			.json({ success: false, message: 'All job fields are required' });
	}

	const companyId = req.company._id;

	try {
		const newJob = new Job({
			title,
			description,
			location,
			salary,
			companyId,
			date: Date.now(),
			level,
			category,
		});

		await newJob.save();

		res.status(201).json({ success: true, newJob });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
	try {
		const companyId = req.company._id;

		// Find job applications for the user and populate related data
		const applications = await JobApplication.find({ companyId })
			.populate('userId', 'name image resume')
			.populate('jobId', 'title location category level salary')
			.exec();

		return res.status(200).json({ success: true, applications });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
	try {
		const companyId = req.company._id;

		const jobsWithApplicantCounts = await Job.aggregate([
			// Match jobs for the specific company
			{ $match: { companyId: companyId } },
			// Perform a left outer join to the jobapplications collection
			{
				$lookup: {
					from: 'jobapplications', // the name of the JobApplication collection in MongoDB
					localField: '_id',
					foreignField: 'jobId',
					as: 'applicants',
				},
			},
			// Add a new field 'applicantsCount' with the size of the 'applicants' array
			{
				$addFields: {
					applicantsCount: { $size: '$applicants' },
				},
			},
			// Remove the 'applicants' array from the final output
			{ $project: { applicants: 0 } },
		]);

		res.status(200).json({ success: true, jobsData: jobsWithApplicantCounts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Change Job Application Status
export const ChangeJobApplicationsStatus = async (req, res) => {
	try {
		const { id, status } = req.body;

		// Find Job application and update status
		await JobApplication.findOneAndUpdate({ _id: id }, { status });

		res.status(200).json({ success: true, message: 'Status Changed' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};

// Change Job Visiblity
export const changeVisiblity = async (req, res) => {
	try {
		const { id } = req.body;

		const companyId = req.company._id;

		const job = await Job.findById(id);

		if (!job) {
			return res.status(404).json({ success: false, message: 'Job not found' });
		}

		if (companyId.toString() === job.companyId.toString()) {
			job.visible = !job.visible;
		} else {
			return res
				.status(403)
				.json({ success: false, message: 'Not authorized to change this job' });
		}

		await job.save();

		res.status(200).json({ success: true, job });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};
