import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    CalendarDays,
    Clock,
    Users,
    Dumbbell,
    X,
} from "lucide-react";

import { classApi, trainerApi } from "../services/api";

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [trainers, setTrainers] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const [formData, setFormData] = useState({
        className: "",
        description: "",
        trainerId: "",
        scheduleDate: "",
        startTime: "",
        endTime: "",
        capacity: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [classesResponse, trainersResponse] =
                await Promise.all([
                    classApi.getAll(),
                    trainerApi.getAll(),
                ]);

            setClasses(classesResponse.data);
            setTrainers(trainersResponse.data);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load classes. Make sure the Spring Boot backend is running on port 8088."
            );
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingClass(null);

        setFormData({
            className: "",
            description: "",
            trainerId: "",
            scheduleDate: "",
            startTime: "",
            endTime: "",
            capacity: "",
        });

        setShowModal(true);
    };

    const openEditModal = (fitnessClass) => {
        setEditingClass(fitnessClass);

        setFormData({
            className: fitnessClass.className || "",
            description: fitnessClass.description || "",
            trainerId: fitnessClass.trainerId || "",
            scheduleDate: fitnessClass.scheduleDate || "",
            startTime: fitnessClass.startTime || "",
            endTime: fitnessClass.endTime || "",
            capacity: fitnessClass.capacity || "",
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClass(null);
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

        const payload = {
            className: formData.className,
            description: formData.description,
            trainerId: Number(formData.trainerId),
            scheduleDate: formData.scheduleDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            capacity: Number(formData.capacity),
        };

        try {
            if (editingClass) {
                await classApi.update(editingClass.id, payload);
            } else {
                await classApi.create(payload);
            }

            closeModal();
            await loadData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to save class. Please check the entered details."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this class?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await classApi.delete(id);
            await loadData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to delete class."
            );
        }
    };

    const filteredClasses = classes.filter((fitnessClass) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            fitnessClass.className
                ?.toLowerCase()
                .includes(searchText) ||
            fitnessClass.trainerName
                ?.toLowerCase()
                .includes(searchText) ||
            fitnessClass.description
                ?.toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "ALL" ||
            fitnessClass.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openClasses = classes.filter(
        (fitnessClass) => fitnessClass.status === "OPEN"
    );

    const totalCapacity = classes.reduce(
        (total, fitnessClass) =>
            total + (fitnessClass.capacity || 0),
        0
    );

    const availableSeats = classes.reduce(
        (total, fitnessClass) =>
            total + (fitnessClass.availableSeats || 0),
        0
    );

    return (
        <div className="management-page">

            {/* HEADER */}

            <section className="management-header">
                <div>
                    <span className="section-eyebrow">
                        CLASS MANAGEMENT
                    </span>

                    <h1>Fitness Classes</h1>

                    <p>
                        Manage classes, trainers, schedules, and seat availability.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Class
                </button>
            </section>

            {/* SUMMARY */}

            <section className="management-summary">

                <div className="summary-card">
                    <div className="summary-icon purple">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <span>Total Classes</span>
                        <strong>{classes.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <Dumbbell size={21} />
                    </div>

                    <div>
                        <span>Open Classes</span>
                        <strong>{openClasses.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon orange">
                        <Users size={21} />
                    </div>

                    <div>
                        <span>Available Seats</span>
                        <strong>{availableSeats}</strong>
                    </div>
                </div>

            </section>

            {/* TABLE PANEL */}

            <section className="management-panel">

                <div className="management-toolbar">

                    <div>
                        <h2>All Classes</h2>

                        <p>
                            {filteredClasses.length} classes found
                            {" · "}
                            {totalCapacity} total capacity
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
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                        </select>

                        <div className="management-search">
                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search classes..."
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
                        <p>Loading classes...</p>
                    </div>
                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>CLASS</th>
                                    <th>TRAINER</th>
                                    <th>SCHEDULE</th>
                                    <th>CAPACITY</th>
                                    <th>AVAILABLE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredClasses.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-table"
                                        >
                                            <CalendarDays size={35} />

                                            <strong>
                                                No classes found
                                            </strong>

                                            <span>
                                                Try changing your search or add a new class.
                                            </span>
                                        </td>
                                    </tr>

                                ) : (

                                    filteredClasses.map((fitnessClass) => (

                                        <tr key={fitnessClass.id}>

                                            {/* CLASS */}

                                            <td>

                                                <div className="table-member">

                                                    <div className="table-avatar">
                                                        <Dumbbell size={16} />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {fitnessClass.className}
                                                        </strong>

                                                        <span>
                                                            ID #{fitnessClass.id}
                                                        </span>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* TRAINER */}

                                            <td>

                                                <div className="trainer-cell">

                                                    <strong>
                                                        {fitnessClass.trainerName ||
                                                            "Unknown"}
                                                    </strong>

                                                    <span>
                                                        {fitnessClass.description ||
                                                            "Fitness session"}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* SCHEDULE */}

                                            <td>

                                                <div className="schedule-cell">

                                                    <span>
                                                        <CalendarDays size={13} />
                                                        {fitnessClass.scheduleDate}
                                                    </span>

                                                    <span>
                                                        <Clock size={13} />
                                                        {fitnessClass.startTime} -{" "}
                                                        {fitnessClass.endTime}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* CAPACITY */}

                                            <td>

                                                <div className="capacity-cell">

                                                    <Users size={14} />

                                                    <strong>
                                                        {fitnessClass.capacity}
                                                    </strong>

                                                </div>

                                            </td>

                                            {/* AVAILABLE */}

                                            <td>

                                                <div className="seat-cell">

                                                    <strong
                                                        className={
                                                            fitnessClass.availableSeats <= 2
                                                                ? "seats-low"
                                                                : ""
                                                        }
                                                    >
                                                        {fitnessClass.availableSeats}
                                                    </strong>

                                                    <span>
                                                        seats left
                                                    </span>

                                                </div>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge ${fitnessClass.status === "OPEN"
                                                        ? "confirmed"
                                                        : "pending"
                                                        }`}
                                                >
                                                    {fitnessClass.status}
                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="table-actions">

                                                    <button
                                                        className="icon-action edit"
                                                        title="Edit class"
                                                        onClick={() =>
                                                            openEditModal(fitnessClass)
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        className="icon-action delete"
                                                        title="Delete class"
                                                        onClick={() =>
                                                            handleDelete(fitnessClass.id)
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal class-modal">

                        <div className="modal-header">

                            <div>
                                <h2>
                                    {editingClass
                                        ? "Edit Fitness Class"
                                        : "Add New Class"}
                                </h2>

                                <p>
                                    {editingClass
                                        ? "Update class information."
                                        : "Create a new fitness class."}
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

                            <div className="form-group">

                                <label>Class Name</label>

                                <input
                                    type="text"
                                    name="className"
                                    placeholder="e.g. Morning Yoga"
                                    value={formData.className}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Description</label>

                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Describe the fitness class"
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>Trainer</label>

                                <select
                                    name="trainerId"
                                    value={formData.trainerId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select trainer
                                    </option>

                                    {trainers.map((trainer) => (
                                        <option
                                            key={trainer.id}
                                            value={trainer.id}
                                        >
                                            {trainer.name} —{" "}
                                            {trainer.specialization}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>Schedule Date</label>

                                    <input
                                        type="date"
                                        name="scheduleDate"
                                        value={formData.scheduleDate}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Capacity</label>

                                    <input
                                        type="number"
                                        name="capacity"
                                        min="1"
                                        placeholder="e.g. 15"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>Start Time</label>

                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>End Time</label>

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        required
                                    />

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
                                    {editingClass
                                        ? "Update Class"
                                        : "Create Class"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}