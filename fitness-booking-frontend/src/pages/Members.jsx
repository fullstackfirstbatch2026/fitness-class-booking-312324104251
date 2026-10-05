import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Users,
    X,
    Mail,
    Phone,
} from "lucide-react";

import { memberApi } from "../services/api";

export default function Members() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        membershipType: "STANDARD",
    });

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await memberApi.getAll();
            setMembers(response.data);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load members. Make sure the Spring Boot backend is running on port 8088."
            );
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingMember(null);

        setFormData({
            name: "",
            email: "",
            phone: "",
            membershipType: "STANDARD",
        });

        setShowModal(true);
    };

    const openEditModal = (member) => {
        setEditingMember(member);

        setFormData({
            name: member.name,
            email: member.email,
            phone: member.phone,
            membershipType: member.membershipType,
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMember(null);
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
            if (editingMember) {
                await memberApi.update(editingMember.id, formData);
            } else {
                await memberApi.create(formData);
            }

            closeModal();
            await loadMembers();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to save member. Please check the entered details."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this member?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await memberApi.delete(id);
            await loadMembers();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to delete member."
            );
        }
    };

    const filteredMembers = members.filter((member) => {
        const searchText = search.toLowerCase();

        return (
            member.name?.toLowerCase().includes(searchText) ||
            member.email?.toLowerCase().includes(searchText) ||
            member.phone?.toLowerCase().includes(searchText) ||
            member.membershipType?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="management-page">

            {/* HEADER */}

            <section className="management-header">
                <div>
                    <span className="section-eyebrow">MEMBER MANAGEMENT</span>

                    <h1>Members</h1>

                    <p>
                        Manage your fitness center members and membership details.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Member
                </button>
            </section>

            {/* SUMMARY */}

            <section className="management-summary">

                <div className="summary-card">
                    <div className="summary-icon purple">
                        <Users size={21} />
                    </div>

                    <div>
                        <span>Total Members</span>
                        <strong>{members.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <Users size={21} />
                    </div>

                    <div>
                        <span>Active Members</span>

                        <strong>
                            {
                                members.filter(
                                    (member) => member.status === "ACTIVE"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon orange">
                        <Users size={21} />
                    </div>

                    <div>
                        <span>Premium Members</span>

                        <strong>
                            {
                                members.filter(
                                    (member) =>
                                        member.membershipType === "PREMIUM"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

            </section>

            {/* TABLE PANEL */}

            <section className="management-panel">

                <div className="management-toolbar">

                    <div>
                        <h2>All Members</h2>
                        <p>{filteredMembers.length} members found</p>
                    </div>

                    <div className="management-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="api-error">
                        {error}
                        <button onClick={loadMembers}>
                            Retry
                        </button>
                    </div>
                )}

                {/* LOADING */}

                {loading ? (
                    <div className="page-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading members...</p>
                    </div>
                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>
                                <tr>
                                    <th>MEMBER</th>
                                    <th>CONTACT</th>
                                    <th>MEMBERSHIP</th>
                                    <th>JOIN DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredMembers.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-table"
                                        >
                                            <Users size={35} />
                                            <strong>No members found</strong>
                                            <span>
                                                Try changing your search or add a new member.
                                            </span>
                                        </td>
                                    </tr>

                                ) : (

                                    filteredMembers.map((member) => (

                                        <tr key={member.id}>

                                            <td>

                                                <div className="table-member">

                                                    <div className="table-avatar">
                                                        {member.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {member.name}
                                                        </strong>

                                                        <span>
                                                            ID #{member.id}
                                                        </span>
                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="contact-info">

                                                    <span>
                                                        <Mail size={13} />
                                                        {member.email}
                                                    </span>

                                                    <span>
                                                        <Phone size={13} />
                                                        {member.phone}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <span
                                                    className={`membership-badge ${member.membershipType?.toLowerCase()
                                                        }`}
                                                >
                                                    {member.membershipType}
                                                </span>

                                            </td>

                                            <td>
                                                {member.joinDate || "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${member.status === "ACTIVE"
                                                            ? "confirmed"
                                                            : "pending"
                                                        }`}
                                                >
                                                    {member.status}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="table-actions">

                                                    <button
                                                        className="icon-action edit"
                                                        title="Edit member"
                                                        onClick={() =>
                                                            openEditModal(member)
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        className="icon-action delete"
                                                        title="Delete member"
                                                        onClick={() =>
                                                            handleDelete(member.id)
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

                    <div className="modal">

                        <div className="modal-header">

                            <div>
                                <h2>
                                    {editingMember
                                        ? "Edit Member"
                                        : "Add New Member"}
                                </h2>

                                <p>
                                    {editingMember
                                        ? "Update member information."
                                        : "Enter the member's details."}
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
                                    placeholder="Enter full name"
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
                                        placeholder="member@email.com"
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

                            <div className="form-group">

                                <label>Membership Type</label>

                                <select
                                    name="membershipType"
                                    value={formData.membershipType}
                                    onChange={handleChange}
                                >
                                    <option value="STANDARD">
                                        STANDARD
                                    </option>

                                    <option value="PREMIUM">
                                        PREMIUM
                                    </option>
                                </select>

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
                                    {editingMember
                                        ? "Update Member"
                                        : "Create Member"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}