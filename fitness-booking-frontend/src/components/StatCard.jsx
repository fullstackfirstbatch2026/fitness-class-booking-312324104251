export default function StatCard({
    title,
    value,
    change,
    icon: Icon,
    color,
    subtitle,
}) {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <div>
                    <p className="stat-title">{title}</p>
                    <h2 className="stat-value">{value}</h2>
                </div>

                <div className={`stat-icon ${color}`}>
                    <Icon size={22} />
                </div>
            </div>

            <div className="stat-card-bottom">
                <span className="stat-change">{change}</span>
                <span className="stat-subtitle">{subtitle}</span>
            </div>
        </div>
    );
}
