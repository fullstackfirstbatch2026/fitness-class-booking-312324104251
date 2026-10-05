import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Topbar />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
