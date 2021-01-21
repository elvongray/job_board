import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import moment from 'moment';

function formatDateTime(time) {
  const m1 = moment(new Date(time));
  const m2 = moment();
  const duration = moment.duration(m1.diff(m2));

  return duration.humanize();
}

function JobsList({
  fetchingFailed,
  isFetechingJobs,
  currentJob,
  jobs,
  currentPage,
  selectCurrentJob,
  fetchPage,
}) {
  return (
    <Grid container classes={{ root: 'jobs-list-container' }}>
      {fetchingFailed && (
        <Grid item xs={12} classes={{ root: 'failed' }}>
          <div>No jobs found</div>
        </Grid>
      )}
      {isFetechingJobs && !fetchingFailed && (
        <Grid item xs={12} classes={{ root: 'progress-container' }}>
          <div className="loader"></div>
        </Grid>
      )}
      {!isFetechingJobs && !fetchingFailed && (
        <React.Fragment>
          <Grid item xs={5} classes={{ root: 'jobs-list' }}>
            <List>
              {jobs.map((job) => {
                const rootClass = job.id === currentJob.id ? 'current-job' : '';

                return (
                  <ListItem
                    classes={{ root: `job-list-item ${rootClass}` }}
                    key={job.id}
                    onClick={() => selectCurrentJob(job)}
                  >
                    <div className="job-cont">
                      <div className="job-title">{job.title}</div>
                      <div className="company">{job.company}</div>
                    </div>
                    <div className="location-cont">
                      <div className="location">{job.location}</div>
                      <div className="time">
                        {formatDateTime(job.created_at)}
                      </div>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid item xs={7} classes={{ root: 'job-description' }}>
            <div className="job-header">
              {currentJob.company_logo && (
                <img
                  src={currentJob.company_logo}
                  key={currentJob.company_logo}
                  alt=""
                />
              )}
              <h1>{currentJob.title}</h1>
              <a href={currentJob.company_url} rel="noreferrer" target="_blank">
                {currentJob.company}
              </a>
            </div>
            <h2>Job description</h2>
            <div dangerouslySetInnerHTML={{ __html: currentJob.description }} />
            <h2>How to apply</h2>
            <div
              dangerouslySetInnerHTML={{ __html: currentJob.how_to_apply }}
            />
          </Grid>
        </React.Fragment>
      )}
      <Grid xs={12} classes={{ root: 'pagination' }}>
        <ButtonGroup
          size="large"
          color="primary"
          aria-label="large outlined primary button group"
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => fetchPage('back')}
            disabled={currentPage === 0}
          >
            Back
          </Button>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => fetchPage('next')}
            disabled={currentPage === 4}
          >
            Next
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

JobsList.propTypes = {
  fetchingFailed: PropTypes.bool.isRequired,
  isFetechingJobs: PropTypes.bool.isRequired,
  currentJob: PropTypes.object.isRequired,
  jobs: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  selectCurrentJob: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
};

export default JobsList;
