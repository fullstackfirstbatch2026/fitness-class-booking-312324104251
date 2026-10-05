import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Dumbbell,
    Mail,
    Phone,
    Award,
    X,
} from "lucide-react";

import { trainerApi } from "../services/api";

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experienceYears: "",
    });

    useEffect(() => {
        loadTrainers();
    }, []);

    const loadTrainers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await trainerApi.getAll();
            setTrainers(response.data);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load trainers. Make sure the Spring Boot backend is running on port 8088."
            );
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingTrainer(null);

        setFormData({
            name: "",
            email: "",
            phone: "",
            specialization: "",
            experienceYears: "",
        });

        setShowModal(true);
    };

    const openEditModal = (trainer) => {
        setEditingTrainer(trainer);

        setFormData({
            name: trainer.name,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            experienceYears: trainer.experienceYears,
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTrainer(null);
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
            ...formData,
            experienceYears: Number(formData.experienceYears),
        };

        try {
            if (editingTrainer) {
                await trainerApi.update(editingTrainer.id, payload);
            } else {
                await trainerApi.create(payload);
            }

            closeModal();
            await loadTrainers();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to save trainer. Please check the entered details."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trainer?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await trainerApi.delete(id);
            await loadTrainers();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to delete trainer."
            );
        }
    };

    const filteredTrainers = trainers.filter((trainer) => {
        const searchText = search.toLowerCase();

        return (
            trainer.name?.toLowerCase().includes(searchText) ||
            trainer.email?.toLowerCase().includes(searchText) ||
            trainer.phone?.toLowerCase().includes(searchText) ||
            trainer.specialization?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="management-page">

            {/* HEADER */}

            <section className="management-header">
                <div>
                    <span className="section-eyebrow">
                        TRAINER MANAGEMENT
                    </span>

                    <h1>Trainers</h1>

                    <p>
                        Manage your fitness trainers and their professional details.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Trainer
                </button>
            </section>

            {/* SUMMARY */}

            <section className="management-summary">

                <div className="summary-card">
                    <div className="summary-icon purple">
                        <Dumbbell size={21} />
                    </div>

                    <div>
                        <span>Total Trainers</span>
                        <strong>{trainers.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <Award size={21} />
                    </div>

                    <div>
                        <span>Active Trainers</span>

                        <strong>
                            {
                                trainers.filter(
                                    (trainer) => trainer.status === "ACTIVE"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon orange">
                        <Award size={21} />
                    </div>

                    <div>
                        <span>Specializations</span>

                        <strong>
                            {
                                new Set(
                                    trainers.map(
                                        (trainer) => trainer.specialization
                                    )
                                ).size
                            }
                        </strong>
                    </div>
                </div>

            </section>

            {/* TABLE */}

            <section className="management-panel">

                <div className="management-toolbar">

                    <div>
                        <h2>All Trainers</h2>
                        <p>
                            {filteredTrainers.length} trainers found
                        </p>
                    </div>

                    <div className="management-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search trainers..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                </div>

                {error && (
                    <div className="api-error">
                        {error}

                        <button onClick={loadTrainers}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="page-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading trainers...</p>
                    </div>
                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>TRAINER</th>
                                    <th>CONTACT</th>
                                    <th>SPECIALIZATION</th>
                                    <th>EXPERIENCE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredTrainers.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-table"
                                        >
                                            <Dumbbell size={35} />

                                            <strong>
                                                No trainers found
                                            </strong>

                                            <span>
                                                Try changing your search or add a new trainer.
                                            </span>
                                        </td>
                                    </tr>

                                ) : (

                                    filteredTrainers.map((trainer) => (

                                        <tr key={trainer.id}>

                                            {/* TRAINER */}

                                            <td>

                                                <div className="table-member">

                                                    <div className="table-avatar">
                                                        {trainer.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {trainer.name}
                                                        </strong>

                                                        <span>
                                                            ID #{trainer.id}
                                                        </span>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* CONTACT */}

                                            <td>

                                                <div className="contact-info">

                                                    <span>
                                                        <Mail size={13} />
                                                        {trainer.email}
                                                    </span>

                                                    <span>
                                                        <Phone size={13} />
                                                        {trainer.phone}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* SPECIALIZATION */}

                                            <td>

                                                <span className="membership-badge premium">
                                                    {trainer.specialization}
                                                </span>

                                            </td>

                                            {/* EXPERIENCE */}

                                            <td>

                                                <div className="experience-cell">
                                                    <strong>
                                                        {trainer.experienceYears}
                                                    </strong>

                                                    <span>years</span>
                                                </div>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge ${trainer.status === "ACTIVE"
                                                            ? "confirmed"
                                                            : "pending"
                                                        }`}
                                                >
                                                    {trainer.status}
                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="table-actions">

                                                    <button
                                                        className="icon-action edit"
                                                        title="Edit trainer"
                                                        onClick={() =>
                                                            openEditModal(trainer)
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        className="icon-action delete"
                                                        title="Delete trainer"
                                                        onClick={() =>
                                                            handleDelete(trainer.id)
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

            {/* MODAL */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <div>
                                <h2>
                                    {editingTrainer
                                        ? "Edit Trainer"
                                        : "Add New Trainer"}
                                </h2>

                                <p>
                                    {editingTrainer
                                        ? "Update trainer information."
                                        : "Enter the trainer's professional details."}
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

                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter trainer name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="trainer@gym.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Phone</label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>Specialization</label>

                                    <input
                                        type="text"
                                        name="specialization"
                                        placeholder="e.g. Yoga"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Experience Years</label>

                                    <input
                                        type="number"
                                        name="experienceYears"
                                        min="0"
                                        placeholder="e.g. 5"
                                        value={formData.experienceYears}
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
                                    {editingTrainer
                                        ? "Update Trainer"
                                        : "Create Trainer"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}