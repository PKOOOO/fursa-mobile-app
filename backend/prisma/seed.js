require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();

    // Create sample jobs
    const jobs = await Promise.all([
        prisma.job.create({
            data: {
                title: "React Native Developer",
                description: "We are looking for an experienced React Native developer to join our mobile team. You will be building cross-platform mobile applications for our growing user base in Mombasa and across Kenya.",
                company: "SwahiliTech Solutions",
                contactEmail: "jobs@swahilitech.co.ke",
                location: "Mombasa",
                state: "Kenya",
                type: "Full-time",
                remote: false,
                salary: "KES 80,000 - 120,000",
                duration: "Permanent",
                employerLogo: "https://ui-avatars.com/api/?name=SwahiliTech&background=345797&color=fff&size=128",
                jobIcon: "https://ui-avatars.com/api/?name=ST&background=2c6fc3&color=fff&size=64",
                qualifications: "• 2+ years React Native experience\n• Strong JavaScript/TypeScript skills\n• Experience with Expo framework\n• Knowledge of REST APIs\n• Bachelor's degree in CS or related field",
                responsibilities: "• Develop and maintain mobile applications\n• Collaborate with design and backend teams\n• Write clean, maintainable code\n• Participate in code reviews\n• Optimize app performance",
                createdBy: "system",
            },
        }),
        prisma.job.create({
            data: {
                title: "Graphic Designer",
                description: "Creative graphic designer needed for our marketing agency. Must have a keen eye for aesthetics and experience with modern design tools.",
                company: "Pwani Creatives",
                contactEmail: "hr@pwanicreatives.com",
                location: "Mombasa",
                state: "Kenya",
                type: "Full-time",
                remote: true,
                salary: "KES 50,000 - 70,000",
                duration: "Permanent",
                employerLogo: "https://ui-avatars.com/api/?name=Pwani+Creatives&background=FF7754&color=fff&size=128",
                jobIcon: "https://ui-avatars.com/api/?name=PC&background=FF7754&color=fff&size=64",
                qualifications: "• Proficiency in Adobe Creative Suite\n• 1+ years design experience\n• Portfolio of previous work\n• Understanding of brand identity",
                responsibilities: "• Create visual content for social media\n• Design marketing materials\n• Collaborate with marketing team\n• Maintain brand consistency",
                createdBy: "system",
            },
        }),
        prisma.job.create({
            data: {
                title: "Delivery Rider",
                description: "Join our delivery team and earn daily. Flexible hours, bring your own motorcycle. We provide branded gear and phone mount.",
                company: "Fursa Deliveries",
                contactEmail: "riders@fursa.co.ke",
                location: "Mombasa",
                state: "Kenya",
                type: "Hustle",
                remote: false,
                salary: "KES 500 - 1,500 per delivery",
                duration: "Flexible",
                employerLogo: "https://ui-avatars.com/api/?name=Fursa&background=312651&color=fff&size=128",
                jobIcon: "https://ui-avatars.com/api/?name=FD&background=312651&color=fff&size=64",
                qualifications: "• Valid motorcycle license\n• Own motorcycle in good condition\n• Smartphone with data plan\n• Knowledge of Mombasa roads",
                responsibilities: "• Pick up and deliver orders\n• Maintain communication with customers\n• Keep delivery records\n• Maintain vehicle cleanliness",
                createdBy: "system",
            },
        }),
        prisma.job.create({
            data: {
                title: "Content Writer",
                description: "Looking for a talented content writer who can create compelling blog posts, social media content, and marketing copy in both English and Swahili.",
                company: "Coast Media Group",
                contactEmail: "content@coastmedia.co.ke",
                location: "Mombasa",
                state: "Kenya",
                type: "Part-time",
                remote: true,
                salary: "KES 30,000 - 45,000",
                duration: "6 months",
                employerLogo: "https://ui-avatars.com/api/?name=Coast+Media&background=444262&color=fff&size=128",
                jobIcon: "https://ui-avatars.com/api/?name=CM&background=444262&color=fff&size=64",
                qualifications: "• Excellent writing skills in English and Swahili\n• Experience with SEO\n• Portfolio of published articles\n• Social media savvy",
                responsibilities: "• Write blog posts and articles\n• Create social media content\n• Edit and proofread content\n• Research trending topics",
                createdBy: "system",
            },
        }),
        prisma.job.create({
            data: {
                title: "House Cleaning Services",
                description: "We connect professional cleaners with homeowners in Nyali, Bamburi, and surrounding areas. Set your own schedule and rates.",
                company: "CleanHome Mombasa",
                contactEmail: "info@cleanhome.co.ke",
                location: "Mombasa",
                state: "Kenya",
                type: "Home",
                remote: false,
                salary: "KES 1,000 - 3,000 per session",
                duration: "Ongoing",
                employerLogo: "https://ui-avatars.com/api/?name=CleanHome&background=83829A&color=fff&size=128",
                jobIcon: "https://ui-avatars.com/api/?name=CH&background=83829A&color=fff&size=64",
                qualifications: "• Previous cleaning experience preferred\n• Reliable and punctual\n• Own cleaning supplies a plus\n• Good communication skills",
                responsibilities: "• Clean residential properties\n• Follow client instructions\n• Maintain high standards\n• Be available on agreed schedule",
                createdBy: "system",
            },
        }),
    ]);

    console.log(`✅ Created ${jobs.length} sample jobs`);
    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("Error seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
