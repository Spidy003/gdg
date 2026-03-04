import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const CreateProblem = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        contest_id: '',
        title: '',
        description: '',
        score: 0,
    });

    const [testCases, setTestCases] = useState([
        { input: '', output: '', hidden: false }
    ]);

    const initialCodeBlocks = { java: '', c: '', cpp: '', python: '', javascript: '' };

    const [postCode, setPostCode] = useState([{ ...initialCodeBlocks }]);
    const [preCode, setPreCode] = useState([{
        ...initialCodeBlocks,
        Boiler_code: [{ ...initialCodeBlocks }]
    }]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', output: '', hidden: false }]);
    };

    const removeTestCase = (index) => {
        if (testCases.length > 1) {
            setTestCases(testCases.filter((_, i) => i !== index));
        }
    };

    const updateTestCase = (index, field, value) => {
        const newCases = [...testCases];
        newCases[index][field] = value;
        setTestCases(newCases);
    };

    const updatePostCode = (lang, value) => {
        const newPost = [...postCode];
        newPost[0][lang] = value;
        setPostCode(newPost);
    };

    const updatePreCode = (lang, value) => {
        const newPre = [...preCode];
        newPre[0][lang] = value;
        setPreCode(newPre);
    };

    const updateBoilerCode = (lang, value) => {
        const newPre = [...preCode];
        newPre[0].Boiler_code[0][lang] = value;
        setPreCode(newPre);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setError('');
        setSubmitting(true);

        const payload = {
            contest_id: formData.contest_id,
            title: formData.title,
            description: formData.description,
            score: parseInt(formData.score) || 0,
            test_cases: testCases,
            post_code: postCode,
            pre_code: preCode
        };

        try {
            await api.createProblem(payload);
            setSuccessMsg('Problem successfully created!');
            // Optional: reset form or redirect mapping here
            setFormData({ contest_id: '', title: '', description: '', score: 0 });
            setTestCases([{ input: '', output: '', hidden: false }]);
            setPostCode([{ ...initialCodeBlocks }]);
            setPreCode([{ ...initialCodeBlocks, Boiler_code: [{ ...initialCodeBlocks }] }]);
        } catch (err) {
            console.error(err);
            setError('Failed to create problem. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const languages = ['java', 'python', 'javascript', 'c', 'cpp'];

    const renderCodeInputs = (objOrArray, updateHandler, title) => {
        return (
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-color)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{title}</h3>
                <div className="grid">
                    {languages.map(lang => (
                        <div key={lang} className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ textTransform: 'capitalize' }}>{lang}</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={objOrArray[0][lang] || ''}
                                onChange={(e) => updateHandler(lang, e.target.value)}
                                placeholder={`Enter ${lang} code...`}
                                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <button
                className="btn"
                style={{ background: 'transparent', padding: '0', marginBottom: '2rem' }}
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="page-header" style={{ textAlign: 'left' }}>
                <h1 className="page-title">Create New Problem</h1>
                <p className="page-subtitle">Add a new coding challenge for the participants.</p>
            </div>

            {error && <div className="glass-panel" style={{ padding: '1rem', color: 'var(--error-color)', marginBottom: '1.5rem', borderColor: 'rgba(248, 81, 73, 0.4)' }}>{error}</div>}
            {successMsg && <div className="glass-panel" style={{ padding: '1rem', color: 'var(--success-color)', marginBottom: '1.5rem', borderColor: 'rgba(46, 160, 67, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> {successMsg}</div>}

            <form onSubmit={handleSubmit}>
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>General Information</h2>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group">
                            <label className="form-label">Contest ID</label>
                            <input type="text" className="form-control" name="contest_id" value={formData.contest_id} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Score</label>
                            <input type="number" className="form-control" name="score" value={formData.score} onChange={handleFormChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Description</label>
                        <textarea className="form-control" name="description" value={formData.description} onChange={handleFormChange} rows={5} required />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Test Cases</h2>
                        <button type="button" className="btn btn-primary" onClick={addTestCase} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                            <Plus size={16} /> Add Test Case
                        </button>
                    </div>

                    {testCases.map((tc, idx) => (
                        <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
                            {testCases.length > 1 && (
                                <button type="button" onClick={() => removeTestCase(idx)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Case #{idx + 1}</h4>
                            <div className="grid">
                                <div className="form-group">
                                    <label className="form-label">Input</label>
                                    <textarea className="form-control" rows={2} value={tc.input} onChange={(e) => updateTestCase(idx, 'input', e.target.value)} required style={{ fontFamily: 'monospace' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Output</label>
                                    <textarea className="form-control" rows={2} value={tc.output} onChange={(e) => updateTestCase(idx, 'output', e.target.value)} required style={{ fontFamily: 'monospace' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <input type="checkbox" id={`hidden-${idx}`} checked={tc.hidden} onChange={(e) => updateTestCase(idx, 'hidden', e.target.checked)} style={{ cursor: 'pointer' }} />
                                <label htmlFor={`hidden-${idx}`} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Hidden Test Case</label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Code Setup</h2>
                    {renderCodeInputs(postCode, updatePostCode, "Post Code (Hidden append code)")}
                    {renderCodeInputs(preCode, updatePreCode, "Pre Code (Hidden prepend code)")}
                    {renderCodeInputs(preCode[0].Boiler_code, updateBoilerCode, "Boilerplate Code (Initial code shown to user)")}
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ padding: '1rem', fontSize: '1.1rem' }}>
                    {submitting ? <span className="loader" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></span> : <Save size={20} />}
                    {submitting ? 'Creating Problem...' : 'Create Problem'}
                </button>
            </form>
        </div>
    );
};

export default CreateProblem;
