import { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel,
  TablePagination
} from '@mui/material';

// Helper function to calculate aggregate stats
const calculateAggregateStats = (results) => {
  if (!results || results.length === 0) return {};

  const metrics = {};
  
  // Initialize metrics with the first result's keys
  if (results[0]?.metrics) {
    Object.keys(results[0].metrics).forEach(key => {
      metrics[key] = {
        sum: 0,
        avg: 0,
        min: Infinity,
        max: -Infinity
      };
    });
  }
  
  // Calculate sums, min, max for each metric
  results.forEach(result => {
    if (!result.metrics) return;
    
    Object.entries(result.metrics).forEach(([key, value]) => {
      if (metrics[key]) {
        metrics[key].sum += value;
        metrics[key].min = Math.min(metrics[key].min, value);
        metrics[key].max = Math.max(metrics[key].max, value);
      }
    });
  });
  
  // Calculate averages
  Object.keys(metrics).forEach(key => {
    metrics[key].avg = metrics[key].sum / results.length;
  });
  
  return { metrics };
};

const ResultsTable = ({ results, loading, error }) => {
  const [filterValue, setFilterValue] = useState('');
  const [filterMetric, setFilterMetric] = useState('all');
  const [filterOperator, setFilterOperator] = useState('gt');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const aggregateStats = useMemo(() => calculateAggregateStats(results), [results]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get available metrics for filtering
  const availableMetrics = useMemo(() => {
    const metrics = new Set();
    metrics.add('all');
    results.forEach(result => {
      if (result.metrics) {
        Object.keys(result.metrics).forEach(key => metrics.add(key));
      }
    });
    return Array.from(metrics);
  }, [results]);

  // Apply filtering
  const filteredResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    
    return results.filter(result => {
      // If no filter is set
      if (!filterValue || filterMetric === 'all') return true;
      
      const numericFilterValue = parseFloat(filterValue);
      if (isNaN(numericFilterValue)) return true;
      
      // Apply the filter to the specific metric
      const metricValue = result.metrics?.[filterMetric];
      if (metricValue === undefined) return false;
      
      switch (filterOperator) {
        case 'gt': return metricValue > numericFilterValue;
        case 'lt': return metricValue < numericFilterValue;
        case 'eq': return metricValue === numericFilterValue;
        case 'gte': return metricValue >= numericFilterValue;
        case 'lte': return metricValue <= numericFilterValue;
        default: return true;
      }
    });
  }, [results, filterValue, filterMetric, filterOperator]);

  // Apply sorting
  const sortedResults = useMemo(() => {
    if (!orderBy) return filteredResults;
    
    return [...filteredResults].sort((a, b) => {
      let aValue, bValue;
      
      if (orderBy === 'url') {
        aValue = a.url || '';
        bValue = b.url || '';
      } else {
        aValue = a.metrics?.[orderBy] ?? 0;
        bValue = b.metrics?.[orderBy] ?? 0;
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [filteredResults, order, orderBy]);

  // Paginate results
  const displayedResults = useMemo(() => {
    return sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedResults, page, rowsPerPage]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!results || results.length === 0) {
    return null;
  }

  // Get all metric names from all results
  const allMetricNames = new Set();
  results.forEach(result => {
    if (result.metrics) {
      Object.keys(result.metrics).forEach(key => allMetricNames.add(key));
    }
  });
  const metricNames = Array.from(allMetricNames);

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 4, minWidth: 650 }}>
        <Typography variant="h6" gutterBottom>
          Filter Results
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Metric</InputLabel>
            <Select
              value={filterMetric}
              onChange={(e) => setFilterMetric(e.target.value)}
              label="Metric"
            >
              {availableMetrics.map(metric => (
                <MenuItem key={metric} value={metric}>
                  {metric}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Operator</InputLabel>
            <Select
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value)}
              label="Operator"
              disabled={filterMetric === 'all'}
            >
              <MenuItem value="gt">&gt;</MenuItem>
              <MenuItem value="lt">&lt;</MenuItem>
              <MenuItem value="eq">=</MenuItem>
              <MenuItem value="gte">&gt;=</MenuItem>
              <MenuItem value="lte">&lt;=</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Value"
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={filterMetric === 'all'}
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          CRUX Data
        </Typography>
        
        {results.length > 1 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Aggregate Statistics
            </Typography>
            <TableContainer sx={{ minWidth: 650 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Average</TableCell>
                    <TableCell align="right">Sum</TableCell>
                    <TableCell align="right">Min</TableCell>
                    <TableCell align="right">Max</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(aggregateStats.metrics || {}).map(([metric, stats]) => (
                    <TableRow key={metric}>
                      <TableCell component="th" scope="row">
                        {metric}
                      </TableCell>
                      <TableCell align="right">{stats.avg.toFixed(2)}</TableCell>
                      <TableCell align="right">{stats.sum.toFixed(2)}</TableCell>
                      <TableCell align="right">{stats.min.toFixed(2)}</TableCell>
                      <TableCell align="right">{stats.max.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        <TableContainer sx={{ minWidth: 650 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'url'}
                    direction={orderBy === 'url' ? order : 'asc'}
                    onClick={() => handleRequestSort('url')}
                  >
                    URL
                  </TableSortLabel>
                </TableCell>
                {metricNames.map(metric => (
                  <TableCell key={metric} align="right">
                    <TableSortLabel
                      active={orderBy === metric}
                      direction={orderBy === metric ? order : 'asc'}
                      onClick={() => handleRequestSort(metric)}
                    >
                      {metric}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {result.url}
                  </TableCell>
                  {metricNames.map(metric => (
                    <TableCell key={metric} align="right">
                      {result.metrics[metric].toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={sortedResults.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </>
  );
};

export default ResultsTable; 