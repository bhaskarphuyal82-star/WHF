import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import VideoSection from "@/components/VideoSection";
import LiveStreamSection from "@/components/LiveStreamSection";
import MembersSection from "@/components/MembersSection";
import PhotoGallery from "@/components/PhotoGallery";
import AffiliatedOrgsSection from "@/components/AffiliatedOrgsSection";
import { Sparkles, Users, Heart, Calendar, ArrowRight, Image as ImageIcon, MapPin } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Event from "@/models/Event";
import VideoModel from "@/models/Video";
import LiveStream from "@/models/LiveStream";
import User from "@/models/User";
import Representative from "@/models/Representative";
import Heritage from "@/models/Heritage";
import Gallery from "@/models/Gallery";
import AffiliatedOrg from "@/models/AffiliatedOrg";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

async function getData() {
  await connectDB();

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);

  const [
    posts,
    events,
    videos,
    liveStreams,
    members,
    representatives,
    galleries,
    heritages,
    affiliatedOrgs,
    membersCount,
    eventsCount,
    annualEventsCount
  ] = await Promise.all([
    Post.find({ published: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    Event.find({ published: true, status: 'Upcoming' }).sort({ startDate: 1 }).limit(3).lean(),
    VideoModel.find({ published: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    LiveStream.find({ isActive: true, status: { $in: ['Live', 'Scheduled'] } }).sort({ status: 1, scheduledAt: -1 }).lean(),
    User.find({ role: 'member' }).select('-password').sort({ createdAt: -1 }).limit(12).lean(),
    Representative.find().sort({ order: 1 }).lean(),
    Gallery.find({ published: true }).sort({ createdAt: -1 }).limit(4).lean(),
    Heritage.find({ status: 'Active' }).sort({ order: 1 }).limit(4).lean(),
    AffiliatedOrg.find({ status: 'Active' }).sort({ order: 1, createdAt: -1 }).lean(),
    User.countDocuments({ role: 'member' }),
    Event.countDocuments({}),
    Event.countDocuments({ startDate: { $gte: startOfYear } })
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    events: JSON.parse(JSON.stringify(events)),
    videos: JSON.parse(JSON.stringify(videos)),
    liveStreams: JSON.parse(JSON.stringify(liveStreams)),
    members: JSON.parse(JSON.stringify(members)),
    representatives: JSON.parse(JSON.stringify(representatives)),
    galleries: JSON.parse(JSON.stringify(galleries)),
    heritages: JSON.parse(JSON.stringify(heritages)),
    affiliatedOrgs: JSON.parse(JSON.stringify(affiliatedOrgs)),
    stats: {
      membersCount,
      eventsCount,
      annualEventsCount,
      yearsOfService: new Date().getFullYear() - 1999
    }
  };
}

export default async function Home() {
  const {
    posts,
    events,
    videos,
    liveStreams,
    representatives,
    galleries,
    heritages,
    affiliatedOrgs,
    stats
  } = await getData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="relative py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "सक्रिय सदस्यहरू", value: `${stats.membersCount}+` },
              { icon: Heart, label: "कार्यक्रमहरू", value: `${stats.eventsCount}+` },
              { icon: Calendar, label: "वार्षिक कार्यक्रमहरू", value: `${stats.annualEventsCount}+` },
              { icon: Sparkles, label: "सेवाका वर्षहरू", value: `${stats.yearsOfService}+` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Streams Section */}
      {liveStreams && liveStreams.length > 0 && (
        <LiveStreamSection liveStreams={liveStreams} />
      )}

      {/* About Section */}
      <section id="about" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
                हाम्रो बारेमा
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                सम्पदा संरक्षण,
                <br />
                समुदाय निर्माण
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                विश्व हिन्दु महासंघ नेपाल हिन्दु आध्यात्मिक मूल्यहरू, सांस्कृतिक परम्पराहरू, र नेपालभरि सामुदायिक कल्याणको संरक्षण र प्रवर्द्धन गर्न प्रतिबद्ध छ।
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                हाम्रा विभिन्न कार्यक्रमहरू र पहलहरू मार्फत, हामी सामुदायिक बन्धनहरू बलियो बनाउन, सांस्कृतिक शिक्षालाई समर्थन गर्न, र हिन्दु समुदायहरूको अधिकार र कल्याणको वकालत गर्न काम गर्छौं।
              </p>
              <Link href="/about" className="inline-flex items-center px-6 py-3 text-orange-400 font-semibold border-2 border-orange-500/30 hover:bg-orange-500/10 rounded-lg transition-all duration-300">
                हाम्रो कथा पढ्नुहोस् <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-foreground" />
                  </div>
                  <p className="text-foreground text-xl font-semibold">
                    समुदायको सेवामा
                  </p>
                  <p className="text-muted-foreground mt-2">सन् १९९९ देखि</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="heritages" className="relative py-24 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
              हाम्रो सम्पदा
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              मौलिक धरोहरहरू
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              नेपालका अमूल्य सांस्कृतिक र ऐतिहासिक सम्पदाहरूको संरक्षण र संवर्धन
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {heritages && heritages.length > 0 ? (
              heritages.map((heritage: any) => (
                <div key={heritage._id} className="group bg-background/40 border border-border rounded-xl overflow-hidden hover:border-orange-500/30 transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                    {heritage.image ? (
                      <Image
                        src={heritage.image}
                        alt={heritage.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-700" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {heritage.location && (
                        <span className="px-2 py-1 bg-background/60 backdrop-blur-md rounded text-xs font-medium text-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-400" />
                          {heritage.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-400 transition-colors line-clamp-1">
                      {heritage.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {heritage.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                कुनै सम्पदा भेटिएन।
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="relative py-24 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
              हाम्रा कार्यक्रमहरू
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              परिवर्तन ल्याउँदै
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              समुदायलाई सुदृढ गर्न र सांस्कृतिक सम्पदाको संरक्षण गर्न हाम्रा पहलहरू पत्ता लगाउनुहोस्।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "सांस्कृतिक शिक्षा",
                description:
                  "युवा पुस्तालाई हिन्दु दर्शन, संस्कृत, र सांस्कृतिक अभ्यासहरू सिकाउन केन्द्रित कार्यक्रमहरू।",
              },
              {
                title: "सामुदाय सहयोग",
                description:
                  "विभिन्न सहयोग सेवाहरू मार्फत खाँचोमा परेका समुदायका सदस्यहरूलाई सहायता प्रदान गर्ने कल्याणकारी कार्यक्रमहरू।",
              },
              {
                title: "सम्पदा संरक्षण",
                description:
                  "नेपालभरि हिन्दु मन्दिर, स्मारक, र सांस्कृतिक कलाकृतिहरूको संरक्षण र पुनःस्थापना गर्ने पहलहरू।",
              },
            ].map((program) => (
              <div
                key={program.title}
                className="p-8 bg-accent border border-border rounded-xl backdrop-blur-sm hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {program.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {events && events.length > 0 && (
        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-4">
                  आगामी कार्यक्रमहरू
                </span>
                <h2 className="text-3xl font-bold text-foreground">हामीसँग जोडिइनुहोस्</h2>
              </div>
              <Link href="/events" className="text-orange-400 hover:text-orange-300 flex items-center gap-2 transition-colors">
                सबै हेर्नुहोस् <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {events.map((event: any) => (
                <div key={event._id} className="group bg-accent border border-border rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    {event.featuredImage ? (
                      <Image
                        src={event.featuredImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-orange-600 text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      {formatDate(event.startDate)}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <Link href={`/events/${event.slug}`} className="inline-block text-foreground font-medium border-b border-orange-500 pb-0.5 hover:text-orange-400 transition-colors">
                      कार्यक्रम विवरण
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts Section */}
      {posts && posts.length > 0 && (
        <section className="relative py-24 bg-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-4">
                  ताजा समाचार
                </span>
                <h2 className="text-3xl font-bold text-foreground">अपडेट र कथाहरू</h2>
              </div>
              <Link href="/posts" className="text-orange-400 hover:text-orange-300 flex items-center gap-2 transition-colors">
                थप पढ्नुहोस् <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <div key={post._id} className="group bg-background/50 border border-border rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-orange-400 mb-3">
                      <span className="uppercase tracking-wider text-xs font-bold">{post.category}</span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <Link
                      href={post.slug ? `/posts/${post.slug}` : '#'}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-2 mt-4 text-sm font-medium transition-colors"
                    >
                      पूरा पढ्नुहोस् <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos && videos.length > 0 && (
        <VideoSection videos={videos} />
      )}

      {/* Members Section - Hidden
      {members && members.length > 0 && (
        <MembersSection members={members} />
      )}
      */}

      {/* Gallery Section */}
      {galleries && galleries.length > 0 && (
        <PhotoGallery galleries={galleries} />
      )}

      {/* Representatives Section */}
      {representatives && representatives.length > 0 && (
        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
                हाम्रो टोली
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                नेतृत्व
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                हाम्रो अभियानको नेतृत्व गर्ने समर्पित व्यक्तिहरू
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {representatives.slice(0, 4).map((rep: any) => (
                <div key={rep._id} className="group text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors duration-300">
                    {rep.image ? (
                      <Image
                        src={rep.image}
                        alt={rep.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Users className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-orange-400 transition-colors">{rep.name}</h3>
                  <p className="text-orange-500/80 text-sm font-medium">{rep.position}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/representatives" className="inline-flex items-center gap-2 text-foreground hover:text-orange-400 transition-colors font-medium">
                सबै सदस्यहरू भेट्नुहोस् <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Affiliated Orgs Section */}
      {affiliatedOrgs && affiliatedOrgs.length > 0 && (
        <AffiliatedOrgsSection orgs={affiliatedOrgs} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
