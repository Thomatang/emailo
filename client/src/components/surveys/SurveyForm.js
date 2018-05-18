// shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from "react";
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails'
import formFields from './formFields';

import SurveyField from './SurveyField';



class SurveyForm extends Component {

    renderFields(){
        return _.map(formFields, ({label, name}) => {
            return <Field key={name} component={SurveyField} type="text" label={label} name={name} />
        });
    };

  render() {
    return (
        <div>
            <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
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
        )
        
  }
}

function validate(values){
    const errors = {};

    errors.recipients = validateEmails(values.recipients || "");

    //forEach loop: for each field in the FIELDS, run arrow function
    _.each(formFields, ({name, noValueError})=> {
        if(!values[name]){
            errors[name] = noValueError;
        }
    });

    return errors;
}

export default reduxForm({
    validate: validate,
    form: 'surveyForm',
    destroyOnUnmount: false // don't dump the form whenver we navigate away from this component
})(SurveyForm);
