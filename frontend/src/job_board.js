import React, { Component } from 'react';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import JobsList from './components/jobs_list';

import './job_board.scss';

const LOCATIONS = {
  chicago: 'Chicago',
  'san+francisco': 'San Francisco',
  phoenix: 'Phoenix',
  london: 'London',
  beijing: 'Beijing',
  paris: 'Paris',
};

const LANGUAGE = {
  javascript: 'Javascript',
  java: 'Java',
  python: 'Python',
  react: 'React',
  ruby: 'Ruby',
  go: 'Go',
};

class JobBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      isFetechingJobs: false,
      fetchingFailed: false,
      currentJob: {},
      currentPage: 0,
      location: '',
      language: '',
      search: '',
    };
  }

  componentDidMount() {
    // Fetch the first page of jobs
    this.setState(
      {
        fetchingFailed: false,
        isFetechingJobs: true,
      },
      () => {
        axios
          .get('/positions')
          .then((response) => {
            this.setState({
              jobs: response.data,
              isFetechingJobs: false,
              currentJob: response.data[0],
            });
          })
          .catch((error) => {
            this.setState({ fetchingFailed: true });
          });
      }
    );
  }

  selectCurrentJob = (currentJob) => {
    this.setState({ currentJob });
  };

  // Fetch jobs using the user selected location and description
  searchForJob = (e) => {
    if (e && e.keyCode !== 13) return;
    const { location, language, search } = this.state;

    this.setState(
      {
        fetchingFailed: false,
        isFetechingJobs: true,
      },
      () => {
        axios
          .get('/positions', {
            params: {
              search,
              page: 0,
              location,
              language,
            },
          })
          .then((response) => {
            this.setState({
              jobs: response.data,
              isFetechingJobs: false,
              currentJob: response.data[0],
            });
          })
          .catch((error) => {
            this.setState({ fetchingFailed: true });
            console.log('crap', error);
          });
      }
    );
  };

  fetchPage = (pageDirection) => {
    const { currentPage, location, language, search } = this.state;
    let page = null;
    let extraParams = {};

    page =
      pageDirection === 'back'
        ? Math.max(0, currentPage - 1)
        : Math.min(4, currentPage + 1);

    if (location || language || search) {
      extraParams = { location, language, search };
    }

    this.setState(
      {
        fetchingFailed: false,
        isFetechingJobs: true,
      },
      () => {
        axios
          .get('/positions', {
            params: {
              page,
              ...extraParams,
            },
          })
          .then((response) => {
            this.setState({
              currentPage: page,
              jobs: response.data,
              isFetechingJobs: false,
              currentJob: response.data[0],
            });
          })
          .catch((error) => {
            this.setState({ fetchingFailed: true });
            console.log('crap', error);
          });
      }
    );
  };

  userClick = () => {
    let path = window.location.pathname;

    axios
      .post('/user_click/', { path: path })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      jobs,
      currentJob,
      currentPage,
      isFetechingJobs,
      location,
      language,
      fetchingFailed,
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 onClick={() => this.userClick()}>Job Search</h1>
          <p>
            Find your next career at some of the best companies in the world
          </p>
        </header>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12} classes={{ root: 'input-container' }}>
              <TextField
                id="standard-basic"
                label="Enter job title or keyword and use the filters below to get best results"
                onChange={(e) => this.setState({ search: e.target.value })}
                onKeyDown={(e) => this.searchForJob(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.searchForJob()}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} classes={{ root: 'select-container' }}>
              <FormControl classes={{ root: 'city-select' }}>
                <InputLabel id="city-select-label">Select city</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select-label"
                  value={location}
                  onChange={(e) => this.setState({ location: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {Object.entries(LOCATIONS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl classes={{ root: 'job-select' }}>
                <InputLabel id="job-select-label">Select job type</InputLabel>
                <Select
                  labelId="job-select-label"
                  id="job-select-label"
                  value={language}
                  onChange={(e) => this.setState({ language: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {Object.entries(LANGUAGE).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <JobsList
            fetchingFailed={fetchingFailed}
            isFetechingJobs={isFetechingJobs}
            currentJob={currentJob}
            jobs={jobs}
            currentPage={currentPage}
            selectCurrentJob={(job) => this.selectCurrentJob(job)}
            fetchPage={(action) => this.fetchPage(action)}
          />
        </Container>
      </div>
    );
  }
}

export default JobBoard;
