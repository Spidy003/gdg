import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, Target } from 'lucide-react';
import api from '../api/client';

const QualifierTeamStatus = () => {
    const { teamName } = useParams();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Backend endpoint expects score_4 to be 0 for this specific status-only endpoint or whatever payload is valid
    const [status, setStatus] = useState('Pending');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setError('');

        try {
            setSubmitting(true);

            // Based on backend requirements for /submit_status_round_4, schema Admin_4_Submit
            const payload = {
                Team_Name: teamName,
                status_4: status, // Submitting the status mapping
                // Sending defaults to fulfill Admin_4_Submit. The backend `submit_status_round_4` endpoint only cares about status_4 and Team_Name based on main.py lines
                score_4: 0,
                feedback_4: ""
            };

            await api.submitRound4Status(payload);
            setSuccessMsg(`Status updated to ${status} successfully!`);
        } catch (err) {
            console.error(err);
            setError('Failed to update status.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', alignSelf: 'center', marginTop: '10vh' }}>
            <button
                className="btn"
                style={{ background: 'transparent', padding: '0', marginBottom: '2rem' }}
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={18} /> Back to Teams
            </button>

            <div className="page-header" style={{ textAlign: 'left' }}>
                <h1 className="page-title">{teamName}</h1>
                <p className="page-subtitle">Round 5 Qualification Status</p>
            </div>

            {error && <div className="glass-panel" style={{ padding: '1rem', color: 'var(--error-color)', marginBottom: '1.5rem', borderColor: 'rgba(248, 81, 73, 0.4)' }}>{error}</div>}
            {successMsg && <div className="glass-panel" style={{ padding: '1rem', color: 'var(--success-color)', marginBottom: '1.5rem', borderColor: 'rgba(46, 160, 67, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> {successMsg}</div>}

            <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--success-color)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Target size={24} style={{ color: 'var(--success-color)' }} />
                    Submit Qualification
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Qualification Status</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Passed">Qualified for Round 5</option>
                            <option value="Failed">Not Qualified</option>
                        </select>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Updating this status modifies exactly the <b>status_4</b> field in the backend via the <code>/submit_status_round_4</code> route.
                        </p>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ background: 'var(--success-color)' }}>
                        {submitting ? <span className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'white' }}></span> : <Save size={18} />}
                        {submitting ? 'Updating...' : 'Save Status'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QualifierTeamStatus;
