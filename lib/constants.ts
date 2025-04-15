export const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export const certifications = [
  {
    title: "Advanced React",
    issuer: "Udemy",
    year: "2023",
    link: "https://www.udemy.com/certificate/...",
    badge: "/cert-badges/react-cert.png" // Optional badge images
  },
  {
    title: "Next.js Fundamentals",
    issuer: "Frontend Masters",
    year: "2022",
    link: "https://frontendmasters.com/certificates/...",
    badge: "/cert-badges/nextjs-cert.png"
  },
  {
    title: "TypeScript Masterclass",
    issuer: "Pluralsight",
    year: "2021",
    link: "https://www.pluralsight.com/certificates/...",
    badge: "/cert-badges/typescript-cert.png"
  }
]

export const projects = [
  {
    "title": "HNU-PORTAL",
    "description": "A full-featured university management system built with vanilla JavaScript, featuring role-based access control, dynamic timetables, QR attendance tracking, and student data management.",
    "tags": [
      "JavaScript", 
      "HTML5", 
      "CSS3",
    ],
    "github": "https://github.com/mahmoudmatter12/hnu-portal",
    "live": "",
    "image": "",
    "features": [
      "Role-based authentication system",
      "Dynamic timetable generator",
      "QR code attendance tracking",
      "Student data management",
      "Excel export functionality",
      "Responsive faculty dashboard"
    ],
    "achievements": [
      "Optimized vanilla JS performance (50% faster render than jQuery equivalent)",
      "Implemented complex state management without frameworks",
      "Reduced bundle size to just 45KB (uncompressed)"
    ]
  },
  {
    "title": "HNU-ICPC Admin Management",
    "description": "A full-stack student management system built with React and Flask, designed to help HNU-ICPC community admins efficiently manage their students through CRUD operations and real-time status toggling.",
    "tags": [
      "React",
      "React Router",
      "Flask",
      "REST API",
      "Python",
      "SQLAlchemy"
    ],
    "github": "https://github.com/mahmoudmatter12/ICPC_Admin_Panal_react-router",
    "live": "",
    "image": "",
    "features": [
      "View all students with pagination and filters",
      "Toggle student status (Accepted / Rejected)",
      "Add new students with validation",
      "Update existing student data",
      "Delete student records",
      "View individual student profiles",
      "Frontend routing with React Router",
      "RESTful Flask backend with SQLAlchemy ORM"
    ],
    "achievements": [
      "First full-stack project using React Router and Flask REST APIs",
      "Successfully implemented full CRUD operations from scratch",
      "Improved student management experience for ICPC admins"
    ]
  }  
]
