import React, { useCallback, useState } from 'react';
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesSelected: (files: { resume: string; jobDescription: string }) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading = false }) => {
  const [resume, setResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [jobDescFileName, setJobDescFileName] = useState<string>('');

  const handleFileRead = (file: File, type: 'resume' | 'jobDescription') => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (type === 'resume') {
        setResume(text);
        setResumeFileName(file.name);
      } else {
        setJobDescription(text);
        setJobDescFileName(file.name);
      }
      setError(null);
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handlePasteResume = () => {
    const text = prompt('Paste your resume text here:');
    if (text) {
      setResume(text);
      setResumeFileName('pasted_resume.txt');
      setError(null);
    }
  };

  const handlePasteJobDesc = () => {
    const text = prompt('Paste job description here:');
    if (text) {
      setJobDescription(text);
      setJobDescFileName('pasted_job_description.txt');
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    if (resume.length < 50) {
      setError('Resume text is too short (minimum 50 characters)');
      return;
    }

    if (jobDescription.length < 50) {
      setError('Job description text is too short (minimum 50 characters)');
      return;
    }

    onFilesSelected({
      resume,
      jobDescription,
    });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Upload Your Resume & Job Description
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Resume Section */}
        <Paper sx={{ p: 3, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Resume
          </Typography>

          {resumeFileName && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✓ {resumeFileName} loaded ({resume.length} characters)
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileRead(e.target.files[0], 'resume');
                }
              }}
              style={{ display: 'none' }}
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button
                variant="contained"
                component="span"
                sx={{ mb: 1, mr: 1 }}
                disabled={isLoading}
              >
                Upload File
              </Button>
            </label>
            <Button
              variant="outlined"
              onClick={handlePasteResume}
              disabled={isLoading}
            >
              Paste Text
            </Button>
          </Box>
        </Paper>

        {/* Job Description Section */}
        <Paper sx={{ p: 3, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: '#764ba2', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Job Description
          </Typography>

          {jobDescFileName && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✓ {jobDescFileName} loaded ({jobDescription.length} characters)
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileRead(e.target.files[0], 'jobDescription');
                }
              }}
              style={{ display: 'none' }}
              id="jobdesc-upload"
            />
            <label htmlFor="jobdesc-upload">
              <Button
                variant="contained"
                component="span"
                sx={{ mb: 1, mr: 1 }}
                disabled={isLoading}
              >
                Upload File
              </Button>
            </label>
            <Button
              variant="outlined"
              onClick={handlePasteJobDesc}
              disabled={isLoading}
            >
              Paste Text
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Submit Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 1.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
          onClick={handleSubmit}
          disabled={isLoading || !resume || !jobDescription}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Analyzing...
            </>
          ) : (
            'Analyze Skills'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;
