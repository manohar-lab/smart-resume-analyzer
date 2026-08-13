import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import AnalysisResults from '@/components/Analysis/AnalysisResults';
import { apiService } from '@/services/api';
import { getAnalysisSuccess, getAnalysisFailure } from '@/store/analysisSlice';
import { RootState, AppDispatch } from '@/store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AnalysisDetail: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAnalysis, isLoading, error } = useSelector((state: RootState) => state.analysis);
  const [tabValue, setTabValue] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;

      try {
        const analysis = await apiService.getAnalysis(analysisId);
        dispatch(getAnalysisSuccess(analysis));
      } catch (err) {
        const errorMessage = apiService.getErrorMessage(err);
        dispatch(getAnalysisFailure(errorMessage));
      }
    };

    fetchAnalysis();
  }, [analysisId, dispatch]);

  const handleLoadInterviewQuestions = async () => {
    if (!analysisId) return;

    setLoadingQuestions(true);
    try {
      const questions = await apiService.getInterviewQuestions(analysisId);
      setInterviewQuestions(questions);
    } catch (err) {
      alert(`Error loading questions: ${apiService.getErrorMessage(err)}`);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleExportPDF = () => {
    alert('PDF export will be available soon!');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentAnalysis) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Analysis not found'}
        </Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Button color="inherit" startIcon={<ArrowBack />} onClick={() => navigate('/')}>
            Back
          </Button>
          <Typography variant="h6" sx={{ flex: 1, ml: 2, fontWeight: 'bold' }}>
            Analysis Results
          </Typography>
          <Button color="inherit" startIcon={<Download />} onClick={handleExportPDF}>
            Export PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Interview Questions" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Learning Path" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <AnalysisResults analysis={currentAnalysis} />
        </TabPanel>

        {/* Interview Questions Tab */}
        <TabPanel value={tabValue} index={1}>
          {!interviewQuestions ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Generate personalized interview questions based on your skills
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleLoadInterviewQuestions}
                disabled={loadingQuestions}
              >
                {loadingQuestions ? 'Generating...' : 'Generate Interview Questions'}
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                {interviewQuestions.totalQuestions} Questions Generated
              </Typography>
              {interviewQuestions.questions?.map((question: any, idx: number) => (
                <Card key={idx} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Q{idx + 1}: {question.questionText}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Skill:</strong> {question.skillName} | <strong>Level:</strong> {question.difficultyLevel}
                    </Typography>
                    {question.expectedAnswer && (
                      <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>Expected Answer:</strong> {question.expectedAnswer}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Learning Path Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">
              Personalized learning path coming soon...
            </Typography>
          </Box>
        </TabPanel>
      </Container>
    </>
  );
};

export default AnalysisDetail;
