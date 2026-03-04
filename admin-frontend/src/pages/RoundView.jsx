import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import api from '../api/client';

const RoundView = () => {
    const { roundId } = useParams();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const data = await api.getRoundSubmissions(roundId);
                // data.Teams is an array of strings (team names) based on recent backend updates
                setTeams(data?.Teams || []);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch teams. Please ensure backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, [roundId]);

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Round {roundId} Submissions</h1>
                <p className="page-subtitle">Click on a team to view their resources and evaluate.</p>
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
                    <p>No teams have submitted for this round yet.</p>
                </div>
            ) : (
                <div className="grid">
                    {teams.map((teamName, idx) => (
                        <Link
                            key={`${teamName}-${idx}`}
                            to={`/round/${roundId}/team/${encodeURIComponent(teamName)}`}
                            className="card glass-panel"
                        >
                            <div className="card-header">
                                <h2 className="card-title">{teamName}</h2>
                                <div className="card-icon"><Users size={20} /></div>
                            </div>
                            <div className="card-body">
                                <p>View Submissions & Judge →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoundView;
