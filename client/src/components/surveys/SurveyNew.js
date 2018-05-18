//SurveyNew shows survey form and survey form review
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {

    // constructor(props) {
    //     super(props);
    //this.state = { new:true};}

    state = {showFormReview: false}; // exactly the same effect as constructor function above

    //helper function to toggle visibility between two components
    renderContent(){
        if(this.state.showFormReview) {
            return (<SurveyFormReview 
            onCancel={ () => {this.setState({showFormReview: false})}}
            />)
        }
        return (
        <SurveyForm 
        onSurveySubmit={ () => this.setState({showFormReview:true})}
        />
    ); 
        // onSurveySubmit has a callback function that will update our component-level state
    }

    render() {
        return(
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

export default reduxForm({
    form: 'surveyForm'
})(SurveyNew);