// Optimized with throttling for better performance
let scrollTimeout;

// Back to top button visibility with throttled scroll
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            const backToTopButton = document.getElementById('back-to-top');
            backToTopButton?.classList.toggle('show', window.pageYOffset > 300);

            // Update active navigation link
            updateActiveNavLink();

            scrollTimeout = null;
        }, 100);
    }
}, { passive: true });

// Active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.resume-section');
    const navLinks = document.querySelectorAll('.sticky-nav .nav-link');

    let currentSection = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 150) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${currentSection}`;
        link.classList.toggle('active', isActive);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Fade-in animation using Intersection Observer (optimal for performance)
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Unobserve after animation to free up resources
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe fade-in elements
document.querySelectorAll('.experience-item, .education-item').forEach(item => {
    fadeObserver.observe(item);
});

// PDF Download Function
function downloadResumePDF() {
    // Check if jsPDF is loaded
    if (!window.jspdf) {
        alert('PDF library is not loaded. Please refresh the page and try again.');
        console.error('jsPDF library not found');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Color definitions
        const primaryColor = [74, 123, 167];
        const secondaryColor = [44, 82, 130];
        const textColor = [51, 51, 51];
        const lightGray = [128, 128, 128];

        let yPos = 20;
        const leftMargin = 15;
        const rightMargin = 195;
        const pageHeight = 280;

        // Helper function to check if we need a new page
        function checkPageBreak(neededSpace) {
            if (yPos + neededSpace > pageHeight) {
                doc.addPage();
                yPos = 20;
                return true;
            }
            return false;
        }

        // Helper function to add wrapped text
        function addText(text, x, y, maxWidth, fontSize, color, isBold = false) {
            doc.setFontSize(fontSize);
            doc.setTextColor(...color);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return lines.length * (fontSize * 0.4);
        }

        // Header Section
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 50, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('BLAGOJ SIMONOVSKI', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('SOLUTIONS ARCHITECT', 105, 28, { align: 'center' });

        doc.setFontSize(9);
        doc.text('Phone: 00389 75 787 423  |  Location: Skopje, Macedonia  |  Email: blagojsk@gmail.com', 105, 40, { align: 'center' });

        yPos = 60;

        // Professional Summary
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SUMMARY', leftMargin, yPos);
        yPos += 2;
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, yPos, 80, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'normal');
        const summaryText = "I am a Solutions Architect with over 10 years of experience designing and implementing scalable cloud and software solutions across diverse industries. My expertise encompasses the full software lifecycle, from pre-sales technical consulting and rapid prototyping to high-level architectural design, infrastructure planning, hands-on backend development, database optimization, and DevOps automation.\n\nI have successfully delivered solutions across microservices, event-driven, and serverless architectures on all major cloud platforms (AWS, Azure, Google Cloud), with particular depth in the Java ecosystem, Spring Boot, and modern data technologies including PostgreSQL, vector databases, and LLMs. I excel at building proof-of-concepts that validate technical feasibility and accelerate decision-making, while also supporting sales teams with technical expertise during client engagements.\n\nThroughout my career, I've led cross-functional teams, mentored developers, and driven strategic technical initiatives that balance business objectives with engineering excellence. I thrive in collaborative environments where I can contribute to both the technical vision and the day-to-day problem-solving that brings that vision to life. What truly motivates me is creating software that delivers tangible value to users and organizations, while fostering a culture of continuous improvement, shared learning, and collective success within my teams.";
        yPos += addText(summaryText, leftMargin, yPos, rightMargin - leftMargin, 10, textColor);
        yPos += 10;

        // Professional Experience
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL EXPERIENCE', leftMargin, yPos);
        yPos += 2;
        doc.line(leftMargin, yPos, 95, yPos);
        yPos += 7;

        // Experience items
        const experiences = [
            {
                company: 'AVIATION AI RAG Platform',
                title: 'Solutions Architect',
                date: 'August 2025 - ongoing',
                duties: [
                    'Architecture and infrastructure design',
                    'Domain Driven Design and Data Architecture',
                    'Integration of web application with RAG-optimized LLMs',
                    'Integration of Quarkus with LangChain4j',
                    'Deploying containerized Ollama models',
                    'Code and development practices review',
                    'Project and delivery management',
                    'Discovery and business analysis'
                ]
            },
            {
                company: 'Logistics Web Platform',
                title: 'Solutions Architect',
                date: 'September 2025 - November 2025',
                duties: [
                    'Architecture and infrastructure design',
                    'Domain Driven Design and Data Architecture',
                    'Order processing with Spring AI and Gemini API',
                    'Building Vaadin UIs',
                    'Code and development practices review',
                    'Project and delivery management',
                    'Discovery and business analysis'
                ]
            },
            {
                company: 'eSchool Platform',
                title: 'Solutions Architect',
                date: 'January 2025 - October 2025',
                duties: [
                    'Architecture and infrastructure design',
                    'Domain Driven Design and Data Architecture',
                    'Code and development practices review',
                    'Project and delivery management',
                    'Discovery and business analysis'
                ]
            },
            {
                company: 'AVIATION IT SYSTEM',
                title: 'Software Architect',
                date: 'April 2024 – August 2025',
                duties: [
                    'Architecture and infrastructure design',
                    'Integration planning',
                    'Code and development practices review',
                    'Discovery and business analysis'
                ]
            },
            {
                company: 'MEDIA-MARKETING WEB PLATFORM',
                title: 'Solutions Architect',
                date: 'January 2021 – April 2024',
                duties: [
                    'Lead 8 development teams in designing and developing the application services',
                    'Participated in an architectural board that oversaw 300 people and the entire delivery process',
                    'High-level software and infrastructure design',
                    'Continuous implementation of evolving microservices architecture',
                    'Extracting development targets from business roadmaps and feature design',
                    'Code and practices review, planning non-functional improvements',
                    'Developed PoCs',
                    'Helped with major incidents and bug fixing'
                ]
            },
            {
                company: 'BUSINESS-INTELLIGENCE SOLUTION',
                title: 'Solutions Architect',
                date: 'October 2022 – September 2023',
                duties: [
                    'Design and implementation of network, infrastructure, application and data layers',
                    'Backend development in Java and Spring Boot',
                    'Code reviews',
                    'Bug-fixing'
                ]
            },
            {
                company: 'MEDIA-MARKETING WEB PLATFORM',
                title: 'Development Team Lead',
                date: 'January 2019 – January 2021',
                duties: [
                    'Lead a 10-person development team',
                    'Design and development of application components',
                    'Technical tasks involving code refactoring and improvement',
                    'Bug fixing',
                    'Implementation of high-level design and architecture',
                    'Client demo presentations'
                ]
            },
            {
                company: 'MEDIA-MARKETING INFRASTRUCTURE PLATFORM',
                title: 'DevOps Team Lead',
                date: 'May 2017 – January 2019',
                duties: [
                    'Supported every phase of the software development lifecycle and responded to incidents',
                    'Design and implementation of CI/CD pipelines and release strategies',
                    'Design and implementation of AWS-based IaaS and PaaS solutions',
                    'Database architecture design and administration',
                    'Incident response'
                ]
            },
            {
                company: 'TIMEKEEPING APP',
                title: 'Software Engineer',
                date: 'September 2016 – January 2017',
                duties: [
                    'Database design and development',
                    'Network communication planning',
                    'Feature development in Java',
                    'Code reviews',
                    'Bug fixing'
                ]
            }
        ];

        experiences.forEach(exp => {
            checkPageBreak(40);

            doc.setFontSize(11);
            doc.setTextColor(...secondaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text(exp.company, leftMargin, yPos);
            yPos += 5;

            doc.setFontSize(10);
            doc.setTextColor(...primaryColor);
            doc.text(exp.title, leftMargin, yPos);
            yPos += 5;

            doc.setFontSize(9);
            doc.setTextColor(...lightGray);
            doc.setFont('helvetica', 'italic');
            doc.text(exp.date, leftMargin, yPos);
            yPos += 6;

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textColor);
            doc.setFontSize(9);
            exp.duties.forEach(duty => {
                checkPageBreak(10);
                const lines = doc.splitTextToSize('• ' + duty, rightMargin - leftMargin - 5);
                doc.text(lines, leftMargin + 5, yPos);
                yPos += lines.length * 4;
            });
            yPos += 5;
        });

        // Technical Skills
        checkPageBreak(60);
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('TECHNICAL SKILLS', leftMargin, yPos);
        yPos += 2;
        doc.line(leftMargin, yPos, 70, yPos);
        yPos += 7;

        const skills = [
            {
                category: 'Server-side',
                items: 'Java, Spring, Spring Boot, Spring AI, REST, Hibernate, Liquibase, JUnit, Mockito, Arch Unit, ActiveMQ, RabbitMQ, Kafka, Hazelcast, Eureka, Zuul, Hystrix, JWT, JSON, OpenID, SAML, Nginx, WordPress, cPanel'
            },
            {
                category: 'Client-side',
                items: 'HTML, CSS, JavaScript, NodeJS, React, HTMX'
            },
            {
                category: 'Data',
                items: 'SQL, PostgreSQL, PgBouncer, PgVector, MySQL, Elasticsearch, Cassandra, LLMs, Ollama'
            },
            {
                category: 'Infrastructure',
                items: 'AWS, Azure, Google Cloud, Ansible, Terraform, Docker, Kubernetes, Nagios, ELK'
            },
            {
                category: 'Continuous Deployment',
                items: 'Git, Jenkins, GitLab CI/CD, GitHub Actions, Argo CD, Maven, Gradle, Nexus, SonarQube'
            },
            {
                category: 'Methodologies',
                items: 'Scrum, Kanban, ITIL, Enabling Team Topologies, C4 Diagrams'
            }
        ];

        skills.forEach(skill => {
            checkPageBreak(15);

            doc.setFontSize(10);
            doc.setTextColor(...secondaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text(skill.category, leftMargin, yPos);
            yPos += 5;

            doc.setFontSize(9);
            doc.setTextColor(...textColor);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(skill.items, rightMargin - leftMargin);
            doc.text(lines, leftMargin, yPos);
            yPos += lines.length * 4 + 3;
        });

        // Education & Training
        checkPageBreak(40);
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('EDUCATION & TRAINING', leftMargin, yPos);
        yPos += 2;
        doc.line(leftMargin, yPos, 85, yPos);
        yPos += 7;

        const education = [
            {
                title: 'Bachelor of Science in Electrical Engineering',
                subtitle: 'Computer System Engineering, Automation and Robotics',
                institution: 'Faculty of Electrical Engineering and Information Technologies – Skopje',
                date: ''
            },
            {
                title: 'International Training for Foreign Students',
                subtitle: 'St. Wilfrid\'s High School',
                institution: 'Leeds, England',
                date: '2015'
            },
            {
                title: 'Team Engineering Competition - Mission on Mars Robot Challenge',
                subtitle: '',
                institution: 'MathWorks in Paris, France',
                date: '2016 - 16th place by world rankings'
            },
            {
                title: 'Communication Feature for Air Traffic Control',
                subtitle: 'Eurocontrol Hackathon',
                institution: '',
                date: '2016'
            },
            {
                title: 'Seavus Engineering Competition',
                subtitle: '',
                institution: '',
                date: '2016 - 2nd place'
            }
        ];

        education.forEach(edu => {
            checkPageBreak(15);

            doc.setFontSize(10);
            doc.setTextColor(...primaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text(edu.title, leftMargin, yPos);
            yPos += 5;

            if (edu.subtitle) {
                doc.setFontSize(9);
                doc.setTextColor(...secondaryColor);
                doc.setFont('helvetica', 'normal');
                doc.text(edu.subtitle, leftMargin, yPos);
                yPos += 4;
            }

            if (edu.institution) {
                doc.setFontSize(9);
                doc.setTextColor(...textColor);
                doc.text(edu.institution, leftMargin, yPos);
                yPos += 4;
            }

            if (edu.date) {
                doc.setFontSize(9);
                doc.setTextColor(...lightGray);
                doc.setFont('helvetica', 'italic');
                doc.text(edu.date, leftMargin, yPos);
                yPos += 4;
            }

            yPos += 3;
        });

        // Certifications
        checkPageBreak(50);
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICATIONS', leftMargin, yPos);
        yPos += 2;
        doc.line(leftMargin, yPos, 65, yPos);
        yPos += 7;

        const certifications = [
            { name: 'Oracle Certified Associate, Java SE 8 Programmer', org: 'Oracle' },
            { name: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services (AWS)' },
            { name: 'AWS Certified Developer – Associate', org: 'Amazon Web Services (AWS)' },
            { name: 'AWS Certified Solutions Architect – Associate', org: 'Amazon Web Services (AWS)' },
            { name: 'LPI Linux Essentials', org: 'Linux Professional Institute (LPI)' },
            { name: 'ITIL Foundation Certificate in IT Service Management', org: 'AXELOS Global Best Practice' },
            { name: 'Professional Scrum Master I (PSM I)', org: 'Scrum.org' },
            { name: 'Professional Scrum Product Owner I (PSPO I)', org: 'Scrum.org' },
            { name: 'Cambridge English: Proficiency (CPE)', org: 'Cambridge University Press & Assessment English' },
            { name: 'Cambridge English: Advanced (CAE)', org: 'Cambridge University Press & Assessment English' },
            { name: 'Cambridge English: First (FCE)', org: 'Cambridge University Press & Assessment English' }
        ];

        // Split certifications into two columns
        const colWidth = (rightMargin - leftMargin) / 2 - 5;
        const col1Certs = certifications.slice(0, 6);
        const col2Certs = certifications.slice(6);

        const startY = yPos;

        // Column 1
        col1Certs.forEach(cert => {
            checkPageBreak(10);

            doc.setFontSize(9);
            doc.setTextColor(...textColor);
            doc.setFont('helvetica', 'bold');
            const lines = doc.splitTextToSize('• ' + cert.name, colWidth);
            doc.text(lines, leftMargin, yPos);
            yPos += lines.length * 4;

            doc.setFontSize(8);
            doc.setTextColor(...lightGray);
            doc.setFont('helvetica', 'normal');
            doc.text(cert.org, leftMargin + 3, yPos);
            yPos += 6;
        });

        // Column 2
        yPos = startY;
        const col2X = leftMargin + colWidth + 10;

        col2Certs.forEach(cert => {
            doc.setFontSize(9);
            doc.setTextColor(...textColor);
            doc.setFont('helvetica', 'bold');
            const lines = doc.splitTextToSize('• ' + cert.name, colWidth);
            doc.text(lines, col2X, yPos);
            yPos += lines.length * 4;

            doc.setFontSize(8);
            doc.setTextColor(...lightGray);
            doc.setFont('helvetica', 'normal');
            doc.text(cert.org, col2X + 3, yPos);
            yPos += 6;
        });

        // Save the PDF
        doc.save('Blagoj_Simonovski_Resume.pdf');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please check the console for details.');
    }
}
