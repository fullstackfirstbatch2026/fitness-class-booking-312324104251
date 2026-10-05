import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    X,
    ClipboardList,
    CalendarDays,
    User,
    Dumbbell,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { bookingApi, memberApi, classApi } from "../services/api";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [members, setMembers] = useState([]);
    const [classes, setClasses] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        memberId: "",
        classId: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                bookingsResponse,
                membersResponse,
                classesResponse,
            ] = await Promise.all([
                bookingApi.getAll(),
                memberApi.getAll(),
                classApi.getAll(),
            ]);

            setBookings(bookingsResponse.data);
            setMembers(membersResponse.data);
            setClasses(classesResponse.data);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load bookings. Make sure the Spring Boot backend is running on port 8088."
            );
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setFormData({
            memberId: "",
            classId: "",
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await bookingApi.create({
                memberId: Number(formData.memberId),
                classId: Number(formData.classId),
            });

            closeModal();
            await loadData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to create booking. The member may already have a booking or the class may have no available seats."
            );
        }
    };

    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await bookingApi.cancel(id);
            await loadData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to cancel booking."
            );
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            String(booking.id).includes(searchText) ||
            String(booking.memberId).includes(searchText) ||
            String(booking.classId).includes(searchText);

        const matchesStatus =
            statusFilter === "ALL" ||
            booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "CONFIRMED"
    );

    const cancelledBookings = bookings.filter(
        (booking) => booking.status === "CANCELLED"
    );

    return (
        <div className="management-page">

            {/* HEADER */}

            <section className="management-header">
                <div>
                    <span className="section-eyebrow">
                        BOOKING MANAGEMENT
                    </span>

                    <h1>Class Bookings</h1>

                    <p>
                        Manage member bookings and class reservations.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={openModal}
                >
                    <Plus size={18} />
                    New Booking
                </button>
            </section>

            {/* SUMMARY */}

            <section className="management-summary">

                <div className="summary-card">
                    <div className="summary-icon purple">
                        <ClipboardList size={21} />
                    </div>

                    <div>
                        <span>Total Bookings</span>
                        <strong>{bookings.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <CheckCircle2 size={21} />
                    </div>

                    <div>
                        <span>Confirmed</span>
                        <strong>{confirmedBookings.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon orange">
                        <XCircle size={21} />
                    </div>

                    <div>
                        <span>Cancelled</span>
                        <strong>{cancelledBookings.length}</strong>
                    </div>
                </div>

            </section>

            {/* TABLE */}

            <section className="management-panel">

                <div className="management-toolbar">

                    <div>
                        <h2>All Bookings</h2>

                        <p>
                            {filteredBookings.length} bookings found
                        </p>
                    </div>

                    <div className="class-toolbar-right">

                        <select
                            className="status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="CONFIRMED">
                                Confirmed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </select>

                        <div className="management-search">

                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

                {error && (
                    <div className="api-error">
                        {error}

                        <button onClick={loadData}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="page-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading bookings...</p>
                    </div>
                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>BOOKING</th>
                                    <th>MEMBER</th>
                                    <th>CLASS</th>
                                    <th>BOOKING DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredBookings.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-table"
                                        >
                                            <ClipboardList size={35} />

                                            <strong>
                                                No bookings found
                                            </strong>

                                            <span>
                                                Create a new booking to get started.
                                            </span>
                                        </td>
                                    </tr>

                                ) : (

                                    filteredBookings.map((booking) => {

                                        const member = members.find(
                                            (item) =>
                                                item.id === booking.memberId
                                        );

                                        const fitnessClass = classes.find(
                                            (item) =>
                                                item.id === booking.classId
                                        );

                                        return (
                                            <tr key={booking.id}>

                                                {/* BOOKING */}

                                                <td>

                                                    <div className="table-member">

                                                        <div className="table-avatar">
                                                            <ClipboardList size={15} />
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                Booking #{booking.id}
                                                            </strong>

                                                            <span>
                                                                Class #{booking.classId}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </td>

                                                {/* MEMBER */}

                                                <td>

                                                    <div className="booking-person">

                                                        <div className="small-icon purple">
                                                            <User size={14} />
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {member?.name ||
                                                                    `Member #${booking.memberId}`}
                                                            </strong>

                                                            <span>
                                                                {member?.email ||
                                                                    "Member information"}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </td>

                                                {/* CLASS */}

                                                <td>

                                                    <div className="booking-person">

                                                        <div className="small-icon orange">
                                                            <Dumbbell size={14} />
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {fitnessClass?.className ||
                                                                    `Class #${booking.classId}`}
                                                            </strong>

                                                            <span>
                                                                {fitnessClass?.trainerName ||
                                                                    "Fitness class"}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </td>

                                                {/* DATE */}

                                                <td>

                                                    <div className="booking-date">

                                                        <CalendarDays size={14} />

                                                        <span>
                                                            {booking.bookingDate
                                                                ? new Date(
                                                                    booking.bookingDate
                                                                ).toLocaleString()
                                                                : "-"}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`status-badge ${booking.status === "CONFIRMED"
                                                                ? "confirmed"
                                                                : "pending"
                                                            }`}
                                                    >
                                                        {booking.status}
                                                    </span>

                                                </td>

                                                {/* ACTION */}

                                                <td>

                                                    {booking.status === "CONFIRMED" ? (
                                                        <button
                                                            className="cancel-booking-btn"
                                                            onClick={() =>
                                                                handleCancel(booking.id)
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <span className="cancelled-text">
                                                            Cancelled
                                                        </span>
                                                    )}

                                                </td>

                                            </tr>
                                        );
                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* CREATE BOOKING MODAL */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <div>
                                <h2>
                                    Create New Booking
                                </h2>

                                <p>
                                    Select a member and an available class.
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            className="member-form"
                            onSubmit={handleSubmit}
                        >

                            {/* MEMBER */}

                            <div className="form-group">

                                <label>
                                    Member
                                </label>

                                <select
                                    name="memberId"
                                    value={formData.memberId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select member
                                    </option>

                                    {members
                                        .filter(
                                            (member) =>
                                                member.status === "ACTIVE"
                                        )
                                        .map((member) => (
                                            <option
                                                key={member.id}
                                                value={member.id}
                                            >
                                                {member.name} —{" "}
                                                {member.membershipType}
                                            </option>
                                        ))}
                                </select>

                            </div>

                            {/* CLASS */}

                            <div className="form-group">

                                <label>
                                    Fitness Class
                                </label>

                                <select
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select class
                                    </option>

                                    {classes
                                        .filter(
                                            (fitnessClass) =>
                                                fitnessClass.status === "OPEN" &&
                                                fitnessClass.availableSeats > 0
                                        )
                                        .map((fitnessClass) => (
                                            <option
                                                key={fitnessClass.id}
                                                value={fitnessClass.id}
                                            >
                                                {fitnessClass.className} —{" "}
                                                {fitnessClass.availableSeats} seats
                                                available
                                            </option>
                                        ))}
                                </select>

                            </div>

                            <div className="booking-info-box">

                                <ClipboardList size={18} />

                                <div>
                                    <strong>
                                        Booking information
                                    </strong>

                                    <p>
                                        Creating a booking will execute the
                                        backend booking procedure. The database
                                        trigger will automatically update the
                                        class's available seats.
                                    </p>
                                </div>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Confirm Booking
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}