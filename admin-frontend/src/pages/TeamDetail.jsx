import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, ExternalLink, Code } from 'lucide-react';
import api from '../api/client';

const TeamDetail = () => {
    const { roundId, teamName } = useParams();
    const navigate = useNavigate();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Form State
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('Pending'); // e.g., Passed, Failed, Pending

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setLoading(true);
                const data = await api.getTeamSubmission(roundId, teamName);
                setSubmission(data);
                // Pre-fill if already judged
                if (data) {
                    setScore(data[`score_${roundId}`] || '');
                    setFeedback(data[`feedback_${roundId}`] || '');
                    setStatus(data[`status_${roundId}`] || data.status || 'Pending');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch team submission details.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmission();
    }, [roundId, teamName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setError('');

        try {
            setSubmitting(true);

            const payloadId = parseInt(roundId);
            let payload = {
                Team_Name: teamName,
                [`score_${payloadId}`]: parseInt(score) || 0,
            };

            // Depending on the round, the schema might vary slightly, but we generally include status and feedback
            if (payloadId === 2 || payloadId === 3 || payloadId === 4) {
                payload[`feedback_${payloadId}`] = feedback;
                if (payloadId === 2) {
                    payload.status = status;
                } else if (payloadId === 3) {
                    payload[`status_${payloadId}`] = status;
                }
            }

            await api.judgeRound(payloadId, payload);
            setSuccessMsg('Judgement saved successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to save judgement.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="central-loader"><div className="loader"></div></div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <button
                className="btn"
                style={{ background: 'transparent', padding: '0', marginBottom: '2rem' }}
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={18} /> Back to Round {roundId} Teams
            </button>

            <div className="page-header" style={{ textAlign: 'left' }}>
                <h1 className="page-title">{teamName}</h1>
                <p className="page-subtitle">Round {roundId} Submission Details & Evaluation</p>
            </div>

            {error && <div className="glass-panel" style={{ padding: '1rem', color: 'var(--error-color)', marginBottom: '1.5rem', borderColor: 'rgba(248, 81, 73, 0.4)' }}>{error}</div>}
            {successMsg && <div className="glass-panel" style={{ padding: '1rem', color: 'var(--success-color)', marginBottom: '1.5rem', borderColor: 'rgba(46, 160, 67, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> {successMsg}</div>}

            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Submission Resources Card */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Code size={24} style={{ color: 'var(--accent-color)' }} />
                        Team Resources
                    </h2>

                    {submission ? (
                        <div>
                            {submission.cloudinary_url && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <span className="form-label">Cloudinary Resource URL</span>
                                    <a href={submission.cloudinary_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 1rem', background: 'rgba(88, 166, 255, 0.1)', borderRadius: '8px', wordBreak: 'break-all' }}>
                                        {submission.cloudinary_url} <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}

                            {/* Display submission fields dynamically in a user-friendly format */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {Object.entries(submission).filter(([key]) => key !== 'cloudinary_url').map(([key, value]) => {
                                    // Handle cases where multiple links are joined by comma
                                    let valuesToRender = [];
                                    if (typeof value === 'string' && value.includes(',')) {
                                        valuesToRender = value.split(',').map(s => s.trim());
                                    } else {
                                        valuesToRender = [value];
                                    }

                                    return (
                                        <div key={key} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-color)' }}>
                                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {valuesToRender.map((val, idx) => {
                                                    const isUrl = typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'));
                                                    return isUrl ? (
                                                        <a key={idx} href={val} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', wordBreak: 'break-all', color: 'var(--accent-color)', fontWeight: '500' }}>
                                                            {val} <ExternalLink size={14} />
                                                        </a>
                                                    ) : (
                                                        <span key={idx} style={{ fontSize: '1rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                                                            {val === null || val === undefined ? <span style={{ color: 'var(--error-color)', fontStyle: 'italic', fontSize: '0.9rem' }}>Not Provided</span> : String(val)}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p>No submission details found for this team.</p>
                    )}
                </div>

                {/* Judging Form Card */}
                <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--accent-color)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Evaluation Form</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label className="form-label">Score</label>
                            <input
                                type="number"
                                className="form-control"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                placeholder="0 - 100"
                                required
                            />
                        </div>

                        {roundId !== '5' && roundId !== '4' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-control"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Passed">Passed</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Feedback</label>
                                    <textarea
                                        className="form-control"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Provide constructive feedback..."
                                        rows={4}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {roundId === '4' && (
                            <div className="form-group">
                                <label className="form-label">Feedback</label>
                                <textarea
                                    className="form-control"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide constructive feedback..."
                                    rows={4}
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                            {submitting ? <span className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : <Save size={18} />}
                            {submitting ? 'Saving...' : 'Submit Evaluation'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamDetail;
