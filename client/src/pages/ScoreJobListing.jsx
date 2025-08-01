import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, Filter, Search, ChevronDown, Star, ChevronRight, Check, X, MessageCircle } from 'lucide-react';

export default function JobListingsWithFeedback() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechInnovate Solutions",
      location: "San Francisco, CA (Remote Available)",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      posted: "3 days ago",
      description: "We're looking for a Senior Full Stack Developer proficient in React, Node.js, and MongoDB...",
      fitScore: 84.12,
      feedback: "Strong match for core requirements. Experience with React, Node.js, and team leadership is excellent. Missing TypeScript and AWS experience.",
      matchedSkills: ["React", "Node.js", "MongoDB", "REST APIs"],
      missingSkills: ["TypeScript", "AWS"]
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "DataVision Analytics",
      location: "Boston, MA (Hybrid)",
      type: "Full-time",
      salary: "$110,000 - $135,000",
      posted: "1 week ago",
      description: "Seeking a Data Scientist with strong Python, SQL, and machine learning experience...",
      fitScore: 92.5,
      feedback: "Exceptional match. Strong background in all required skills including Python, SQL, statistics and machine learning. Previous projects align perfectly with our needs.",
      matchedSkills: ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics"],
      missingSkills: []
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "CloudFlow Systems",
      location: "Remote",
      type: "Full-time",
      salary: "$115,000 - $140,000",
      posted: "2 days ago",
      description: "Looking for a DevOps Engineer with expertise in AWS, Docker, Kubernetes, and CI/CD pipelines...",
      fitScore: 68.3,
      feedback: "Moderate match. Strong with Docker and CI/CD pipelines, but lacking AWS and Kubernetes experience which are crucial for this role.",
      matchedSkills: ["Docker", "CI/CD", "Linux"],
      missingSkills: ["AWS", "Kubernetes", "Terraform"]
    },
    {
      id: 4,
      title: "Frontend Developer",
      company: "Creative Web Solutions",
      location: "New York, NY (On-site)",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      posted: "5 days ago",
      description: "Seeking a Frontend Developer with strong React, TypeScript, and CSS skills...",
      fitScore: 76.8,
      feedback: "Good match for most requirements. Strong React and CSS skills, but TypeScript experience is missing. Consider highlighting any TypeScript exposure in your application.",
      matchedSkills: ["React", "JavaScript", "CSS", "HTML"],
      missingSkills: ["TypeScript", "Redux"]
    },
    {
      id: 5,
      title: "Product Manager",
      company: "InnoTech Products",
      location: "Austin, TX (Hybrid)",
      type: "Full-time",
      salary: "$125,000 - $155,000",
      posted: "1 day ago",
      description: "Looking for an experienced Product Manager to lead our tech product development...",
      fitScore: 52.4,
      feedback: "Limited match. You have some product development experience, but this role requires B2B SaaS background and technical expertise that isn't apparent in your profile.",
      matchedSkills: ["Product Development", "User Research"],
      missingSkills: ["Agile", "B2B SaaS", "Technical Background"]
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [fitFilter, setFitFilter] = useState('all'); // 'all', 'high', 'medium', 'low'
  
  // Function to filter jobs based on search and fit score
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (fitFilter === 'all') return matchesSearch;
    if (fitFilter === 'high') return matchesSearch && job.fitScore >= 80;
    if (fitFilter === 'medium') return matchesSearch && job.fitScore >= 60 && job.fitScore < 80;
    if (fitFilter === 'low') return matchesSearch && job.fitScore < 60;
    
    return matchesSearch;
  });
  
  // Function to determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  // Function to determine match status text
  const getMatchStatus = (score) => {
    if (score >= 80) return "Strong Match";
    if (score >= 60) return "Potential Match";
    return "Low Match";
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Listings</h1>
        <p className="text-gray-600">Personalized job recommendations with AI fit analysis</p>
      </header>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search jobs, companies, or keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={fitFilter}
            onChange={(e) => setFitFilter(e.target.value)}
          >
            <option value="all">All Match Scores</option>
            <option value="high">Strong Matches (80%+)</option>
            <option value="medium">Potential Matches (60-79%)</option>
            <option value="low">Low Matches (Below 60%)</option>
          </select>
          
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 bg-white hover:bg-gray-50">
            <Filter size={18} />
            Filters
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      
      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Job Info - 2 columns */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600">{job.title}</h2>
                    <div className="mt-1 text-gray-600">{job.company}</div>
                    
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={16} className="mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-1" />
                        Posted {job.posted}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="font-medium text-gray-700 mb-2">Skills Match</div>
                      <div className="flex flex-wrap gap-2">
                        {job.matchedSkills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                            <Check size={14} className="mr-1" />
                            {skill}
                          </span>
                        ))}
                        {job.matchedSkills.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            +{job.matchedSkills.length - 3} more
                          </span>
                        )}
                        {job.missingSkills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                            <X size={14} className="mr-1" />
                            {skill}
                          </span>
                        ))}
                        {job.missingSkills.length > 2 && (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            +{job.missingSkills.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Feedback Column - 1 column */}
                  <div className="md:col-span-1 flex flex-col">
                    <div className="flex items-center mb-2">
                      <MessageCircle size={16} className="mr-2 text-blue-600" />
                      <h3 className="font-semibold text-gray-700">AI Feedback</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-gray-700 text-sm flex-grow">
                      {job.feedback}
                    </div>
                  </div>
                  
                  {/* Score + Apply - 1 column */}
                  <div className="md:col-span-1 flex flex-col items-center md:items-end justify-between">
                    <div className="bg-blue-50 p-3 rounded-lg text-center min-w-24">
                      <div className="text-sm font-medium text-gray-600">Job Fit</div>
                      <div className={`text-2xl font-bold ${getScoreColor(job.fitScore)}`}>
                        {job.fitScore}%
                      </div>
                      <div className={`text-xs font-medium ${getScoreColor(job.fitScore)}`}>
                        {getMatchStatus(job.fitScore)}
                      </div>
                    </div>
                    
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium w-full md:w-auto">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <div className="flex gap-4">
                  <button className="flex items-center text-gray-600 hover:text-blue-600 text-sm">
                    <Star size={16} className="mr-1" />
                    Save
                  </button>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-600">No matching jobs found. Try adjusting your search criteria.</div>
          </div>
        )}
      </div>
    </div>
  );
}