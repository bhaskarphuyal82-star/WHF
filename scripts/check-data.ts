
import connectDB from "../lib/mongodb";
import Post from "../models/Post";
import Event from "../models/Event";
import Video from "../models/Video";
import Representative from "../models/Representative";
import Gallery from "../models/Gallery";

async function checkData() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        const postsCount = await Post.countDocuments({});
        const publishedPostsCount = await Post.countDocuments({ published: true });
        console.log(`Posts: Total=${postsCount}, Published=${publishedPostsCount}`);

        const eventsCount = await Event.countDocuments({});
        const publishedUpcomingEventsCount = await Event.countDocuments({ published: true, status: 'Upcoming' });
        const publishedEventsCount = await Event.countDocuments({ published: true });
        console.log(`Events: Total=${eventsCount}, Published=${publishedEventsCount}, Published & Upcoming=${publishedUpcomingEventsCount}`);

        const videosCount = await Video.countDocuments({});
        const publishedVideosCount = await Video.countDocuments({ published: true });
        console.log(`Videos: Total=${videosCount}, Published=${publishedVideosCount}`);

        const repsCount = await Representative.countDocuments({});
        const activeRepsCount = await Representative.countDocuments({ status: 'Active' });
        console.log(`Representatives: Total=${repsCount}, Active=${activeRepsCount}`);

        const galleryCount = await Gallery.countDocuments({});
        const publishedGalleryCount = await Gallery.countDocuments({ published: true });
        console.log(`Galleries: Total=${galleryCount}, Published=${publishedGalleryCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Error checking data:", error);
        process.exit(1);
    }
}

checkData();
