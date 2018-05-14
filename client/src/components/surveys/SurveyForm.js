// shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from "react";
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';

import SurveyField from './SurveyField';

const FIELDS = [
  { label: "Survey Title", name: "title", noValueError: "A title is required" },
  { label: "Subject Line", name: "subject", noValueError: "Please enter a subject, don't be that person" },
  { label: "Email Body", name: "body", noValueError: "The whole purpose is to write a survey here, please do" },
  { label: "Recipient List", name: "emails", noValueError: "Invalid email" }
];

class SurveyForm extends Component {

    renderFields(){
        return _.map(FIELDS, ({label, name}) => {
            return <Field key={name} component={SurveyField} type="text" label={label} name={name} />
        });
    };

  render() {
    return (
        <div>
            <form onSubmit={this.props.handleSubmit(values => console.log(values))}>
                {this.renderFields()}
                <Link to="/surveys" className="red btn-flat white-text">
                Cancel
                </Link>
                <button className="teal btn-flat right white-text" type="submit">
                Next
                <i className="material-icons right">done</i>
                </button>
            </form>
        </div>
        );
        
  }
}

function validate(values){
    const errors = {};
    //forEach loop: for each field in the FIELDS, run arrow function
    _.each(FIELDS, ({name, noValueError})=> {
        if(!values[name]){
            errors[name] = noValueError;
        }
    })
      
    return errors;
}

export default reduxForm({
    validate: validate,
    form: 'surveyForm'
})(SurveyForm);
