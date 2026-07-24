export const mockKpis = {
    totalApplications: 47,
    responseRate: 32,
    interviewRate: 18,
    offerRate: 6,
};

export const mockStatusBreakdown = [
    { status: "Wishlist", count: 12, color: "#818cf8" },
    { status: "Applied", count: 18, color: "#3525cd" },
    { status: "Interviewing", count: 9, color: "#f7bd3e" },
    { status: "Offer", count: 3, color: "#22c55e" },
    { status: "Rejected", count: 5, color: "#ba1a1a" },
];

export const mockRecentActivity = [
    { id: "1", text: "Applied to Senior Frontend Engineer at Acme Corp", time: "2h ago" },
    { id: "2", text: "Interview scheduled with TechStart Inc.", time: "5h ago" },
    { id: "3", text: "Status changed to Interviewing for Backend Role at DataFlow", time: "1d ago" },
    { id: "4", text: "Added new company: CloudNine Systems", time: "2d ago" },
];

export const mockUpcomingInterviews = [
    { id: "1", jobTitle: "Senior Frontend Engineer", company: "Acme Corp", date: "Jul 26, 2026", time: "2:00 PM" },
    { id: "2", jobTitle: "Backend Engineer", company: "DataFlow", date: "Jul 28, 2026", time: "10:30 AM" },
];