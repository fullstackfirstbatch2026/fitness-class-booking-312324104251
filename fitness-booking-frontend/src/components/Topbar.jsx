import { Search, Bell, ChevronDown, Menu } from "lucide-react";

export default function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu" aria-label="Open menu">
                    <Menu size={22} />
                </button>

                <div>
                    <h2>Overview</h2>
                    <p>Welcome back, Admin 👋</p>
                </div>
            </div>

            <div className="topbar-right">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search anything..." />
                    <span className="search-shortcut">⌘ K</span>
                </div>

                <button className="notification-btn" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>

                <div className="profile">
                    <div className="profile-avatar">A</div>

                    <div className="profile-info">
                        <strong>Admin User</strong>
                        <span>Administrator</span>
                    </div>

                    <ChevronDown size={16} />
                </div>
            </div>
        </header>
    );
}
