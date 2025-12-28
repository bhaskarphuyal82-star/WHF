"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Calendar,
    Video,
    Users,
    UsersRound,
    Images,
    Settings,
    LogOut,
    Landmark,
    Radio,
    Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Videos", href: "/admin/videos", icon: Video },
    { name: "Live Streams", href: "/admin/livestreams", icon: Radio },
    { name: "Members", href: "/admin/members", icon: UsersRound },
    { name: "Representatives", href: "/admin/representatives", icon: Users },
    { name: "Affiliated Orgs", href: "/admin/affiliated-orgs", icon: Building2 },
    { name: "Gallery", href: "/admin/gallery", icon: Images },
    { name: "Heritages", href: "/admin/heritages", icon: Landmark },
    { name: "Sliders", href: "/admin/sliders", icon: Images },
    { name: "Donation Settings", href: "/admin/donation-settings", icon: Settings },
    { name: "General Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-gradient-to-b from-gray-900 to-black border-r border-white/10">
            {/* Logo */}
            <div className="flex h-20 items-center px-6 border-b border-white/10">
                <h1 className="text-xl font-bold text-white">WHF Nepal</h1>
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 rounded">
                    Admin
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                                isActive
                                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
