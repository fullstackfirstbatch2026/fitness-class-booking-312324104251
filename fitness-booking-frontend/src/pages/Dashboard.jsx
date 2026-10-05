import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    Dumbbell,
    CalendarDays,
    ClipboardList,
    ArrowUpRight,
    Clock,
    MapPin,
} from "lucide-react";

import StatCard from "../components/StatCard";

import {
    memberApi,
    trainerApi,
    classApi,
    bookingApi,
} from "../services/api";

export default function Dashboard() {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [
                membersResponse,
                trainersResponse,
                classesResponse,
                bookingsResponse,
            ] = await Promise.all([
                memberApi.getAll(),
                trainerApi.getAll(),
                classApi.getAll(),
                bookingApi.getAll(),
            ]);

            setMembers(membersResponse.data);
            setTrainers(trainersResponse.data);
            setClasses(classesResponse.data);
            setBookings(bookingsResponse.data);
        } catch (error) {
            console.error("Dashboard loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // CALCULATED DATA
    // -----------------------------

    const activeMembers = members.filter(
        (member) => member.status === "ACTIVE"
    );

    const activeTrainers = trainers.filter(
        (trainer) => trainer.status === "ACTIVE"
    );

    const openClasses = classes.filter(
        (fitnessClass) => fitnessClass.status === "OPEN"
    );

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "CONFIRMED"
    );

    // Sort classes by date and start time
    const upcomingClasses = [...classes]
        .sort((a, b) => {
            const dateA = `${a.scheduleDate} ${a.startTime}`;
            const dateB = `${b.scheduleDate} ${b.startTime}`;

            return dateA.localeCompare(dateB);
        })
        .slice(0, 4);

    // Sort bookings newest first
    const recentBookings = [...bookings]
        .sort((a, b) => {
            return (
                new Date(b.bookingDate) -
                new Date(a.bookingDate)
            );
        })
        .slice(0, 4);

    // -----------------------------
    // HELPER FUNCTIONS
    // -----------------------------

    const getMemberName = (memberId) => {
        const member = members.find(
            (item) => item.id === memberId
        );

        return member?.name || `Member #${memberId}`;
    };

    const getClassName = (classId) => {
        const fitnessClass = classes.find(
            (item) => item.id === classId
        );

        return (
            fitnessClass?.className ||
            `Class #${classId}`
        );
    };

    // -----------------------------
    // STATISTICS
    // -----------------------------

    const stats = [
        {
            title: "Total Members",
            value: loading ? "..." : members.length,
            change: `${activeMembers.length} active`,
            subtitle: "members",
            icon: Users,
            color: "purple",
        },
        {
            title: "Active Trainers",
            value: loading ? "..." : activeTrainers.length,
            change: `${trainers.length} total`,
            subtitle: "trainers",
            icon: Dumbbell,
            color: "blue",
        },
        {
            title: "Open Classes",
            value: loading ? "..." : openClasses.length,
            change: `${classes.length} total`,
            subtitle: "classes",
            icon: CalendarDays,
            color: "orange",
        },
        {
            title: "Confirmed Bookings",
            value: loading ? "..." : confirmedBookings.length,
            change: `${bookings.length} total`,
            subtitle: "bookings",
            icon: ClipboardList,
            color: "green",
        },
    ];

    // -----------------------------
    // UI
    // -----------------------------

    return (
        <div className="dashboard">

            {/* =========================
          HEADER
      ========================= */}

            <section className="welcome-section">

                <div>
                    <span className="section-eyebrow">
                        FITNESS OVERVIEW
                    </span>

                    <h1>
                        Your Fitness Center at a Glance
                    </h1>

                    <p>
                        Monitor your members, trainers, classes,
                        and bookings from one place.
                    </p>
                </div>

                <div className="welcome-date">
                    <CalendarDays size={18} />

                    <span>
                        Live Management Data
                    </span>
                </div>

            </section>

            {/* =========================
          STATISTICS
      ========================= */}

            <section className="stats-grid">

                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        {...stat}
                    />
                ))}

            </section>

            {/* =========================
          DASHBOARD CONTENT
      ========================= */}

            <section className="dashboard-grid">

                {/* =======================
            UPCOMING CLASSES
        ======================= */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Upcoming Classes
                            </h2>

                            <p>
                                Scheduled fitness sessions
                            </p>
                        </div>

                        <button
                            className="text-action"
                            onClick={() =>
                                navigate("/classes")
                            }
                        >
                            View all

                            <ArrowUpRight size={16} />
                        </button>

                    </div>

                    <div className="class-list">

                        {upcomingClasses.length === 0 ? (

                            <div className="dashboard-empty">

                                <CalendarDays size={28} />

                                <p>
                                    No classes available
                                </p>

                            </div>

                        ) : (

                            upcomingClasses.map((item) => (

                                <div
                                    className="class-item"
                                    key={item.id}
                                >

                                    {/* CLASS ICON */}

                                    <div className="class-icon">
                                        <Dumbbell size={20} />
                                    </div>

                                    {/* CLASS INFORMATION */}

                                    <div className="class-info">

                                        <h3>
                                            {item.className}
                                        </h3>

                                        <p>
                                            {item.trainerName ||
                                                "Trainer not assigned"}
                                        </p>

                                        <div className="class-meta">

                                            <span>
                                                <Clock size={14} />

                                                {item.startTime} -{" "}
                                                {item.endTime}
                                            </span>

                                            <span>
                                                <MapPin size={14} />

                                                {item.scheduleDate}
                                            </span>

                                        </div>

                                    </div>

                                    {/* AVAILABLE SEATS */}

                                    <div className="class-seats">

                                        <strong>
                                            {item.availableSeats}
                                        </strong>

                                        <span>
                                            seats left
                                        </span>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

                {/* =======================
            RECENT BOOKINGS
        ======================= */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Recent Bookings
                            </h2>

                            <p>
                                Latest member activity
                            </p>
                        </div>

                        <button
                            className="text-action"
                            onClick={() =>
                                navigate("/bookings")
                            }
                        >
                            View all

                            <ArrowUpRight size={16} />
                        </button>

                    </div>

                    <div className="booking-list">

                        {recentBookings.length === 0 ? (

                            <div className="dashboard-empty">

                                <ClipboardList size={28} />

                                <p>
                                    No bookings yet
                                </p>

                            </div>

                        ) : (

                            recentBookings.map((booking) => {

                                const memberName =
                                    getMemberName(
                                        booking.memberId
                                    );

                                const className =
                                    getClassName(
                                        booking.classId
                                    );

                                const initials =
                                    memberName
                                        .split(" ")
                                        .map(
                                            (name) => name[0]
                                        )
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();

                                return (

                                    <div
                                        className="booking-item"
                                        key={booking.id}
                                    >

                                        {/* MEMBER AVATAR */}

                                        <div className="member-avatar">
                                            {initials}
                                        </div>

                                        {/* BOOKING INFORMATION */}

                                        <div className="booking-info">

                                            <h3>
                                                {memberName}
                                            </h3>

                                            <p>
                                                {className}
                                            </p>

                                            <span>
                                                {booking.bookingDate
                                                    ? new Date(
                                                        booking.bookingDate
                                                    ).toLocaleString()
                                                    : "-"}
                                            </span>

                                        </div>

                                        {/* STATUS */}

                                        <span
                                            className={`status-badge ${booking.status ===
                                                "CONFIRMED"
                                                ? "confirmed"
                                                : "pending"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>

                                    </div>

                                );
                            })

                        )}

                    </div>

                </div>

            </section>

        </div>
    );
}