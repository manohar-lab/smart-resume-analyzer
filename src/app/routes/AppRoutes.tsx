import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CandidateList from '../../features/candidates/CandidateList';
import CandidateDetail from '../../features/candidates/CandidateDetail';
import JobList from '../../features/jobs/JobList';
import JobDetail from '../../features/jobs/JobDetail';
import MatchDashboard from '../../features/matching/MatchDashboard';
import MatchSummary from '../../features/matching/MatchSummary';
import SkillVerificationPanel from '../dashboard/SkillVerificationPanel';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import MainLayout from '../../components/layout/MainLayout';

const AppRoutes = () => {
    return (
        <Router>
            <Header />
            <MainLayout>
                <Sidebar />
                <Switch>
                    <Route path="/candidates" exact component={CandidateList} />
                    <Route path="/candidates/:id" component={CandidateDetail} />
                    <Route path="/jobs" exact component={JobList} />
                    <Route path="/jobs/:id" component={JobDetail} />
                    <Route path="/match" exact component={MatchDashboard} />
                    <Route path="/match/summary" component={MatchSummary} />
                    <Route path="/skills" component={SkillVerificationPanel} />
                </Switch>
            </MainLayout>
        </Router>
    );
};

export default AppRoutes;