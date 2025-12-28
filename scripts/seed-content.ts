
import connectDB from "../lib/mongodb";
import Post from "../models/Post";
import Event from "../models/Event";
import Video from "../models/Video";
import Representative from "../models/Representative";
import Gallery from "../models/Gallery";
import User from "../models/User";
import mongoose from "mongoose";

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

const samplePosts = [
    {
        title: "World Hindu Federation Nepal Launches New Community Initiative",
        content: "We are proud to announce the launch of our new community support program aimed at providing educational resources and healthcare assistance to remote villages across Nepal. This initiative represents a significant step forward in our mission to serve the people and preserve our cultural values.",
        excerpt: "New community support program providing education and healthcare to remote villages.",
        category: "News",
        published: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        tags: ["Community", "Education", "Healthcare"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1688567890/cld-sample-2.jpg",
    },
    {
        title: "Understanding the Significance of Vedic Traditions",
        content: "Vedic traditions offer a profound framework for living a balanced and meaningful life. In this article, we explore the core principles of Vedic philosophy and how they remain relevant in the modern world. From daily rituals to deep meditation practices, the wisdom of the Vedas provides guidance for all.",
        excerpt: "Exploring the core principles of Vedic philosophy and their relevance today.",
        category: "Blog",
        published: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        tags: ["Vedas", "Culture", "Philosophy"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1688567891/cld-sample-4.jpg",
    },
    {
        title: "Upcoming Grand Yagyashala Announcement",
        content: "Join us for the Grand Yagyashala event next month! We invite all community members to participate in this sacred ceremony. It will be a time of prayer, community bonding, and spiritual renewal. Preparations are already underway to make this a memorable event for everyone involved.",
        excerpt: "Join us for the Grand Yagyashala event next month.",
        category: "Announcement",
        published: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        tags: ["Event", "Ceremony", "Yagya"],
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1688567889/cld-sample.jpg",
    },
];

const sampleEvents = [
    {
        title: "Annual Cultural Festival 2025",
        description: "A grand celebration of our rich cultural heritage with music, dance, and traditional performances. This annual event brings together artists and community leaders from across the country to showcase the diversity and beauty of our traditions.",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
        location: "Kathmandu, Nepal",
        category: "Festival",
        status: "Upcoming",
        published: true,
        registrationRequired: true,
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1688567891/cld-sample-3.jpg",
    },
    {
        title: "Sanskrit Workshop for Youth",
        description: "An interactive workshop designed to introduce young minds to the beauty of the Sanskrit language. Participants will learn basic conversation, reading, and chanting. The goal is to keep this ancient language alive for future generations.",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
        location: "Patan, Nepal",
        category: "Workshop",
        status: "Upcoming",
        published: true,
        registrationRequired: true,
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1688567892/cld-sample-5.jpg",
    },
    {
        title: "Community Prayer Meeting",
        description: "Monthly community prayer meeting for peace and prosperity. All are welcome to join us for a session of bhajans and spiritual discourse. It is an opportunity to connect with fellow community members and find inner peace.",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
        location: "Bhaktapur, Nepal",
        category: "Meeting",
        status: "Upcoming",
        published: true,
        registrationRequired: false,
        featuredImage: "https://res.cloudinary.com/demo/image/upload/v1688567889/cld-sample.jpg",
    },
];

const sampleVideos = [
    {
        title: "Documentary: Temples of Nepal",
        description: "A journey through the ancient temples of Kathmandu Valley.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
        category: "Documentary",
        published: true,
        publishedAt: new Date(),
        thumbnail: "https://res.cloudinary.com/demo/image/upload/v1688567892/cld-sample-5.jpg",
    },
    {
        title: "Highlights: Festival 2024",
        description: "Best moments from last year's cultural festival.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
        category: "Event",
        published: true,
        publishedAt: new Date(),
        thumbnail: "https://res.cloudinary.com/demo/image/upload/v1688567890/cld-sample-2.jpg",
    },
    {
        title: "Interview with Chairman",
        description: "Discussing the future vision of World Hindu Federation Nepal.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
        category: "Interview",
        published: true,
        publishedAt: new Date(),
        thumbnail: "https://res.cloudinary.com/demo/image/upload/v1688567891/cld-sample-4.jpg",
    },
];

const sampleReps = [
    {
        name: "Dr. Ram Sharma",
        position: "President",
        bio: "Dedicated leader with 20 years of experience in community service.",
        status: "Active",
        order: 1,
        image: "https://res.cloudinary.com/demo/image/upload/v1688567891/cld-sample-4.jpg",
    },
    {
        name: "Sita Devi",
        position: "Vice President",
        bio: "Advocate for women's empowerment and cultural preservation.",
        status: "Active",
        order: 2,
        image: "https://res.cloudinary.com/demo/image/upload/v1688567890/cld-sample-2.jpg",
    },
    {
        name: "Hari Prasad",
        position: "General Secretary",
        bio: "Organizer of major youth engagement programs.",
        status: "Active",
        order: 3,
        image: "https://res.cloudinary.com/demo/image/upload/v1688567892/cld-sample-5.jpg",
    },
    {
        name: "Gita Thapa",
        position: "Treasurer",
        bio: "Financial expert ensuring transparency and accountability.",
        status: "Active",
        order: 4,
        image: "https://res.cloudinary.com/demo/image/upload/v1688567889/cld-sample.jpg",
    },
];

const sampleGalleries = [
    {
        title: "Holi Celebration 2024",
        description: "Colors of joy and unity.",
        category: "Festival",
        published: true,
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1688567890/cld-sample-2.jpg",
        images: [{ url: "https://res.cloudinary.com/demo/image/upload/v1688567890/cld-sample-2.jpg" }],
    },
    {
        title: "Charity Drive",
        description: "Distributing essentials to the needy.",
        category: "Charity",
        published: true,
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1688567889/cld-sample.jpg",
        images: [{ url: "https://res.cloudinary.com/demo/image/upload/v1688567889/cld-sample.jpg" }],
    },
    {
        title: "Temple Restoration",
        description: "Restoring our heritage sites.",
        category: "Heritage",
        published: true,
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1688567892/cld-sample-5.jpg",
        images: [{ url: "https://res.cloudinary.com/demo/image/upload/v1688567892/cld-sample-5.jpg" }],
    },
    {
        title: "Youth Camp",
        description: "Engaging the next generation.",
        category: "Youth",
        published: true,
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1688567891/cld-sample-3.jpg",
        images: [{ url: "https://res.cloudinary.com/demo/image/upload/v1688567891/cld-sample-3.jpg" }],
    },
];

async function seedData() {
    try {
        const conn = await connectDB();
        console.log("Connected to MongoDB");

        // Get an admin user to assign as author
        let authorId;
        try {
            const admin = await User.findOne({ role: 'admin' });
            authorId = admin ? admin._id : new mongoose.Types.ObjectId();
            if (!admin) console.log("No admin found, using generated ID for author");
        } catch (e) {
            console.log("Error finding user, using generated ID");
            authorId = new mongoose.Types.ObjectId();
        }


        console.log("Seeding Posts...");
        for (const post of samplePosts) {
            await Post.findOneAndUpdate(
                { title: post.title },
                { ...post, slug: slugify(post.title), author: authorId },
                { upsert: true, new: true }
            );
        }

        console.log("Seeding Events...");
        for (const event of sampleEvents) {
            await Event.findOneAndUpdate(
                { title: event.title },
                { ...event, slug: slugify(event.title) },
                { upsert: true, new: true }
            );
        }

        console.log("Seeding Videos...");
        for (const video of sampleVideos) {
            await Video.findOneAndUpdate(
                { title: video.title },
                video,
                { upsert: true, new: true }
            );
        }

        console.log("Seeding Representatives...");
        for (const rep of sampleReps) {
            await Representative.findOneAndUpdate(
                { name: rep.name },
                rep,
                { upsert: true, new: true }
            );
        }

        console.log("Seeding Galleries...");
        for (const gallery of sampleGalleries) {
            await Gallery.findOneAndUpdate(
                { title: gallery.title },
                gallery,
                { upsert: true, new: true }
            );
        }

        console.log("✅ Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seedData();

