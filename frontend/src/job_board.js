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
import CircularProgress from '@material-ui/core/CircularProgress';


import './job_board.scss';


class JobBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      isFetechingJobs: false,
      fetchingFailed: false,
      currentJob: {},
      currentPage: 0
    }
  }

  componentDidMount() {
    this.setState({
      isFetechingJobs: true,
    }, () => {
      axios.get('/positions')
        .then((response) => {
          this.setState({
            jobs: response.data,
            isFetechingJobs: false,
            currentJob: response.data[0],
          });
          console.log(response);
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

  fetchPage = (pageDirection) => {
    const { currentPage } = this.state;
    let page = null;
    page = pageDirection === 'back' ? Math.max(0, currentPage - 1) : Math.min(4, currentPage + 1)

    this.setState({
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
          console.log(response);
        })
        .catch((error) =>  {
          this.setState({ fetchingFailed: true });
          console.log('crap', error);
        });
    })
  }

  render() {
    const { jobs, currentJob, currentPage, isFetechingJobs } = this.state;

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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained">Search</Button>
            </Grid>
            <Grid item xs={12} classes={{root: 'select-container'}}>
              <FormControl classes={{root: 'city-select'}}>
                <InputLabel id="city-select-label">Select city</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select-label"
                  value=""
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value={'chicago'}>Chicago</MenuItem>
                  <MenuItem value={'san-francisco'}>San Francisco</MenuItem>
                  <MenuItem value={'phoenix'}>Phoenix</MenuItem>
                  <MenuItem value={'london'}>London</MenuItem>
                  <MenuItem value={'beijing'}>Beijing</MenuItem>
                  <MenuItem value={'paris'}>Paris</MenuItem>
                </Select>
              </FormControl>
              <FormControl classes={{root: 'job-select'}}>
                <InputLabel id="job-select-label">Select job type</InputLabel>
                <Select
                  labelId="job-select-label"
                  id="job-select-label"
                  value=""
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value={'javascript'}>Javascript</MenuItem>
                  <MenuItem value={'java'}>Java</MenuItem>
                  <MenuItem value={'python'}>Python</MenuItem>
                  <MenuItem value={'react'}>React</MenuItem>
                  <MenuItem value={'ruby'}>Ruby</MenuItem>
                  <MenuItem value={'go'}>Go</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container classes={{root: 'jobs-list-container'}}>
              {isFetechingJobs &&
                <Grid item xs={12} classes={{root: 'progress-container'}}>
                  <div className="loader"></div>
                </Grid>
              }
              {!isFetechingJobs &&
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
