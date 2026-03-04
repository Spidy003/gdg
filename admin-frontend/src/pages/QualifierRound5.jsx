import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import api from '../api/client';

const QualifierRound5 = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                // We need all round 4 teams so the admin can set their status
                const data = await api.getRoundSubmissions(4);
                setTeams(data?.Teams || []);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch teams. Please ensure backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Qualifier for Round 5</h1>
                <p className="page-subtitle">Select a team to submit their Round 4 status.</p>
            </div>

            {loading ? (
                <div className="central-loader"><div className="loader"></div></div>
            ) : error ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error-color)' }}>
                    <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
                    <p>{error}</p>
                </div>
            ) : teams.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>No teams found for Round 4.</p>
                </div>
            ) : (
                <div className="grid">
                    {teams.map((teamName, idx) => (
                        <Link
                            key={`${teamName}-${idx}`}
                            to={`/qualifier-round-5/team/${encodeURIComponent(teamName)}`}
                            className="card glass-panel"
                            style={{ borderLeft: '4px solid var(--success-color)' }}
                        >
                            <div className="card-header">
                                <h2 className="card-title">{teamName}</h2>
                                <div className="card-icon" style={{ color: 'var(--success-color)', background: 'rgba(46, 160, 67, 0.1)' }}>
                                    <Users size={20} />
                                </div>
                            </div>
                            <div className="card-body">
                                <p>Submit Qualifier Status →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QualifierRound5;
