import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    CalendarDays,
    ClipboardList,
    Activity,
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Members", path: "/members", icon: Users },
    { name: "Trainers", path: "/trainers", icon: Dumbbell },
    { name: "Classes", path: "/classes", icon: CalendarDays },
    { name: "Bookings", path: "/bookings", icon: ClipboardList },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon">
                    <Activity size={24} />
                </div>

                <div>
                    <h2>FITZONE</h2>
                    <span>Fitness Management</span>
                </div>
            </div>

            <div className="menu-label">MAIN MENU</div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <Icon size={19} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="admin-avatar">A</div>
                <div>
                    <strong>Admin</strong>
                    <span>Administrator</span>
                </div>
            </div>
        </aside>
    );
}
