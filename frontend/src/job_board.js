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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import moment from 'moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


import './job_board.scss';

const LOCATIONS = {
  'chicago': 'Chicago',
  'san+francisco': 'San Francisco',
  'phoenix': 'Phoenix',
  'london': 'London',
  'beijing': 'Beijing',
  'paris': 'Paris',
};

const LANGUAGE = {
  'javascript': 'Javascript',
  'java': 'Java',
  'python': 'Python',
  'react': 'React',
  'ruby': 'Ruby',
  'go': 'Go',
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
    }
  }

  componentDidMount() {
    this.setState({
      fetchingFailed: false,
      isFetechingJobs: true,
    }, () => {
      axios.get('/positions')
        .then((response) => {
          this.setState({
            jobs: response.data,
            isFetechingJobs: false,
            currentJob: response.data[0],
          });
        })
        .catch((error) =>  {
          this.setState({ fetchingFailed: true });
          console.log('crap', error);
        });
    })
  }

  formatDateTime(time) {
    const m1 = moment(new Date(time));
    const m2 = moment();
    const duration = moment.duration(m1.diff(m2));

    return duration.humanize();
  }

  selectCurrentJob = (currentJob) => {
    this.setState({ currentJob });
  }

  searchForJob = (e) => {
    if (e && e.keyCode !== 13) return;
    console.log(e);
    const { currentPage, location,  language,  search } = this.state

    this.setState({
      fetchingFailed: false,
      isFetechingJobs: true,
    }, () => {
      axios.get('/positions', {
        params: {
          search,
          page: currentPage,
          location,
          language,
        }
      }).then((response) => {
          this.setState({
            jobs: response.data,
            isFetechingJobs: false,
            currentJob: response.data[0],
          });
        })
        .catch((error) =>  {
          this.setState({ fetchingFailed: true });
          console.log('crap', error);
        });
    })
  }

  fetchPage = (pageDirection) => {
    const { currentPage } = this.state;
    let page = null;
    page = pageDirection === 'back' ? Math.max(0, currentPage - 1) : Math.min(4, currentPage + 1)

    this.setState({
      fetchingFailed: false,
      isFetechingJobs: true,
    }, () => {
      axios.get('/positions', {
        params: { page }
      }).then((response) => {
          this.setState({
            currentPage: page,
            jobs: response.data,
            isFetechingJobs: false,
            currentJob: response.data[0],
          });
        })
        .catch((error) =>  {
          this.setState({ fetchingFailed: true });
          console.log('crap', error);
        });
    })
  }

  render() {
    const { jobs, currentJob, currentPage, isFetechingJobs,
            location, language, fetchingFailed } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Job Search</h1>
          <p>Find your next career at some of the best companies in the world</p>
        </header>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12} classes={{root: 'input-container'}}>
              <TextField
                id="standard-basic"
                label="Enter job title or keyword and use the filters below to get best results"
                onChange={(e) => this.setState({search : e.target.value})}
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
                onClick={() => this.searchForJob()}>
                Search
              </Button>
            </Grid>
            <Grid item xs={12} classes={{root: 'select-container'}}>
              <FormControl classes={{root: 'city-select'}}>
                <InputLabel id="city-select-label">Select city</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select-label"
                  value={location}
                  onChange={(e) => this.setState({location: e.target.value})}
                >
                  <MenuItem value="">None</MenuItem>
                  {Object.entries(LOCATIONS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>{value}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl classes={{root: 'job-select'}}>
                <InputLabel id="job-select-label">Select job type</InputLabel>
                <Select
                  labelId="job-select-label"
                  id="job-select-label"
                  value={language}
                  onChange={(e) => this.setState({language: e.target.value})}
                >
                  <MenuItem value="">None</MenuItem>
                  {Object.entries(LANGUAGE).map(([key, value]) => (
                      <MenuItem key={key} value={key}>{value}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid container classes={{root: 'jobs-list-container'}}>
              {fetchingFailed &&
                <Grid item xs={12} classes={{root: 'failed'}}>
                  <div>No jobs found</div>
                </Grid>
              }
              {isFetechingJobs && !fetchingFailed &&
                <Grid item xs={12} classes={{root: 'progress-container'}}>
                  <div className="loader"></div>
                </Grid>
              }
              {!isFetechingJobs && !fetchingFailed &&
                <React.Fragment>
                  <Grid item xs={5} classes={{root: 'jobs-list'}}>
                    <List>
                      {jobs.map((job) => {
                          const rootClass = job.id === currentJob.id ? 'current-job' : '';

                          return (
                            <ListItem classes={{root: `job-list-item ${rootClass}`}} key={job.id}
                                      onClick={() => this.selectCurrentJob(job)}>
                              <div className="job-cont">
                                <div className="job-title">{ job.title }</div>
                                <div className="company">{ job.company }</div>
                              </div>
                              <div className="location-cont">
                                <div className="location">{ job.location }</div>
                                <div className="time">{this.formatDateTime(job.created_at)}</div>
                              </div>
                            </ListItem>
                          )
                        })
                      }
                    </List>
                  </Grid>
                  <Grid item xs={7} classes={{root: 'job-description'}}>
                    <div className="job-header">
                      {currentJob.company_logo &&
                        <img src={currentJob.company_logo} alt=""/>
                      }
                      <h1>{currentJob.title}</h1>
                      <a href={currentJob.company_url} rel="noreferrer" target="_blank">{ currentJob.company }</a>
                    </div>
                    <h2>Job description</h2>
                    <div dangerouslySetInnerHTML={{__html : currentJob.description}} />
                    <h2>How to apply</h2>
                    <div dangerouslySetInnerHTML={{__html : currentJob.how_to_apply}} />
                  </Grid>
                </React.Fragment>
              }
              <Grid xs={12} classes={{root: 'pagination'}}>
                <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => this.fetchPage('back')}
                    disabled={currentPage === 0}>
                    Back
                  </Button>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => this.fetchPage('next')}
                    disabled={currentPage === 4}>
                    Next
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default JobBoard;
