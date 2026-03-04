import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RoundView from './pages/RoundView';
import TeamDetail from './pages/TeamDetail';
import QualifierRound5 from './pages/QualifierRound5';
import QualifierTeamStatus from './pages/QualifierTeamStatus';
import CreateProblem from './pages/CreateProblem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/round/:roundId" element={<RoundView />} />
        <Route path="/round/:roundId/team/:teamName" element={<TeamDetail />} />

        {/* New Qualifier Routes */}
        <Route path="/qualifier-round-5" element={<QualifierRound5 />} />
        <Route path="/qualifier-round-5/team/:teamName" element={<QualifierTeamStatus />} />

        {/* Create Problem */}
        <Route path="/create-problem" element={<CreateProblem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
