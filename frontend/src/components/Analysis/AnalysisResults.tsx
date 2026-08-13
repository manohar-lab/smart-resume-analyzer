import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { CheckCircle, Warning, Info, Cancel } from '@mui/icons-material';
import { AnalysisDetail } from '@/types';
import { formatPercentage, getStatusColor, getStatusLabel } from '@/utils/formatters';

interface AnalysisResultsProps {
  analysis: AnalysisDetail;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'SUPPORTED':
        return <Info sx={{ color: '#2196F3' }} />;
      case 'CLAIMED':
        return <Warning sx={{ color: '#FF9800' }} />;
      case 'UNCERTAIN':
        return <Cancel sx={{ color: '#9E9E9E' }} />;
      default:
        return null;
    }
  };

  const matchPercentageColor = analysis.skillMatchPercentage
    ? analysis.skillMatchPercentage >= 70
      ? '#4CAF50'
      : analysis.skillMatchPercentage >= 40
      ? '#FF9800'
      : '#F44336'
    : '#9E9E9E';

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Analysis Results
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Skill Match
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: matchPercentageColor, fontWeight: 'bold' }}
              >
                {formatPercentage(analysis.skillMatchPercentage || 0)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={analysis.skillMatchPercentage || 0}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#eee',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: matchPercentageColor,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Evidence Coverage
              </Typography>
              <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                {formatPercentage(analysis.evidenceCoverageScore || 0)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                of job requirements
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Interview Readiness
              </Typography>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                {(analysis.interviewReadinessScore || 0).toFixed(1)}/10
              </Typography>
              <Typography variant="caption" color="textSecondary">
                preparedness score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Skills Matched
              </Typography>
              <Typography variant="h4" sx={{ color: '#764ba2', fontWeight: 'bold' }}>
                {analysis.matchedSkills}/{analysis.totalSkillsInJob}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                of required skills
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Missing Skills Alert */}
      {analysis.missingSkills && analysis.missingSkills.length > 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <strong>Missing Skills:</strong> {analysis.missingSkills.join(', ')}
        </Alert>
      )}

      {/* Skills Table */}
      <Paper sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Skill Name</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Confidence</TableCell>
                <TableCell align="center">Level</TableCell>
                <TableCell>Evidence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analysis.skillsDetected && analysis.skillsDetected.map((skill) => (
                <TableRow key={skill.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{skill.skillName}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {getStatusIcon(skill.status)}
                      <Chip
                        label={getStatusLabel(skill.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(skill.status),
                          color: '#fff',
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <LinearProgress
                      variant="determinate"
                      value={skill.confidenceScore * 100}
                      sx={{ width: 80, mx: 'auto' }}
                    />
                    <Typography variant="caption">
                      {formatPercentage(skill.confidenceScore * 100)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={skill.depthLevel || 'Unknown'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {skill.evidenceText ? skill.evidenceText.substring(0, 100) + '...' : 'No evidence found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary */}
      <Card sx={{ backgroundColor: '#f9f9f9' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Summary
          </Typography>
          <Typography variant="body2" paragraph>
            Based on the analysis of your resume against the job description:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                You have <strong>{formatPercentage(analysis.skillMatchPercentage || 0)}</strong> of the required skills
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Your evidence coverage is <strong>{formatPercentage(analysis.evidenceCoverageScore || 0)}</strong>, showing{' '}
                {(analysis.evidenceCoverageScore || 0) > 75 ? 'strong proof' : 'moderate proof'} of your skills
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Your interview readiness score is <strong>{(analysis.interviewReadinessScore || 0).toFixed(1)}/10</strong>
              </Typography>
            </li>
            {analysis.missingSkills && analysis.missingSkills.length > 0 && (
              <li>
                <Typography variant="body2">
                  Focus on learning: <strong>{analysis.missingSkills.slice(0, 3).join(', ')}</strong>
                </Typography>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalysisResults;
