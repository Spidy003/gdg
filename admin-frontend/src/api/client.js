import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // Round Submissions
    getRoundSubmissions: async (roundId) => {
        const response = await client.get(`/round_${roundId}_submissions`);
        return response.data;
    },

    getTeamSubmission: async (roundId, teamName) => {
        const response = await client.get(`/round_${roundId}_submissions/${encodeURIComponent(teamName)}`);
        return response.data;
    },

    // Judge Endpoints
    judgeRound: async (roundId, payload) => {
        const response = await client.post(`/judge_round_${roundId}`, payload);
        return response.data;
    },

    // Status Round 4 Specific
    submitRound4Status: async (payload) => {
        const response = await client.post(`/submit_status_round_4`, payload);
        return response.data;
    },

    // Create Problem Endpoint
    createProblem: async (payload) => {
        const response = await client.post(`/problem`, payload);
        return response.data;
    }
};

export default api;
