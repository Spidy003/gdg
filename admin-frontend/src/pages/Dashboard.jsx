import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Trophy, Target } from 'lucide-react';

const Dashboard = () => {
    const rounds = [
        { id: 2, title: 'Round 2', desc: 'Code Evaluation', icon: <Layers size={24} /> },
        { id: 3, title: 'Round 3', desc: 'System Design', icon: <ShieldCheck size={24} /> },
        { id: 4, title: 'Round 4', desc: 'Final Pitch', icon: <Target size={24} /> },
        { id: 5, title: 'Round 5', desc: 'Championship', icon: <Trophy size={24} /> },
    ];

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Admin Judge Dashboard</h1>
                <p className="page-subtitle">Select a round below to view team submissions and provide judgments.</p>
            </div>

            <div className="grid">
                {rounds.map((r) => (
                    <Link
                        key={r.id}
                        to={`/round/${r.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card glass-panel"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className="card-header">
                            <h2 className="card-title">{r.title}</h2>
                            <div className="card-icon">{r.icon}</div>
                        </div>
                        <div className="card-body">
                            <p>{r.desc}</p>
                        </div>
                    </Link>
                ))}

                {/* Special Option for Round 4 Status */}
                <Link
                    to="/qualifier-round-5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card glass-panel"
                    style={{ textDecoration: 'none', color: 'inherit', borderColor: 'var(--success-color)' }}
                >
                    <div className="card-header">
                        <h2 className="card-title">Qualifier for Round 5</h2>
                        <div className="card-icon" style={{ color: 'var(--success-color)', background: 'rgba(46, 160, 67, 0.1)' }}>
                            <Target size={24} />
                        </div>
                    </div>
                    <div className="card-body">
                        <p>Submit round 4 status for teams</p>
                    </div>
                </Link>

                {/* Create New Problem */}
                <Link
                    to="/create-problem"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card glass-panel"
                    style={{ textDecoration: 'none', color: 'inherit', borderColor: 'var(--accent-color)' }}
                >
                    <div className="card-header">
                        <h2 className="card-title">Create New Problem</h2>
                        <div className="card-icon" style={{ color: 'var(--accent-color)', background: 'rgba(88, 166, 255, 0.1)' }}>
                            <Layers size={24} />
                        </div>
                    </div>
                    <div className="card-body">
                        <p>Add a new coding problem</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
