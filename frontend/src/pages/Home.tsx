import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { LogOut } from '@mui/icons-material';
import { logout } from '@/store/authSlice';
import FileUpload from '@/components/Upload/FileUpload';
import { apiService } from '@/services/api';
import { createAnalysisSuccess, createAnalysisFailure } from '@/store/analysisSlice';
import { RootState, AppDispatch } from '@/store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFilesSelected = async (files: { resume: string; jobDescription: string }) => {
    setIsLoading(true);
    try {
      const analysis = await apiService.createAnalysis({
        resumeText: files.resume,
        jobDescriptionText: files.jobDescription,
      });
      dispatch(createAnalysisSuccess(analysis));
      navigate(`/analysis/${analysis.id}`);
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      dispatch(createAnalysisFailure(errorMessage));
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
            EviMatch
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">{user.name}</Typography>
              <Button color="inherit" startIcon={<LogOut />} onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <FileUpload onFilesSelected={handleFilesSelected} isLoading={isLoading} />
      </Container>
    </>
  );
};

export default Home;
