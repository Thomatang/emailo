import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import formFields from "./formFields";
import {withRouter} from 'react-router-dom';

import * as actions from '../../actions';

const SurveyReview = ({onCancel, formValues, submitSurvey, history}) => {

  const reviewFields = _.map(formFields, ({name,label}) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>
            {formValues[name]}
          </div>
        </div>
      )
  })


    return <div>
        <h5>Please confirm your entries</h5>
        {reviewFields}
        <button className="yellow darken-3 btn-flat" onClick={onCancel}>
          Back
        </button>
        <button 
          onClick={()=> submitSurvey(formValues, history)}
          className="green white-text btn-flat right">
          <i className="material-icons right">email</i>
          Send Survey
          </button>
      </div>;
}


function mapStateToProps(state){

    return {
        formValues: state.form.surveyForm.values
    };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyReview));