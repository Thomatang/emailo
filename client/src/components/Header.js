import React, {Component} from 'react';
import { connect} from 'react-redux';
import { Link } from 'react-router-dom';

import Payments from './Payments';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null: // browser still processing, does not know yet if user is logged in
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return [
            <li key="1"><Payments /></li>,
            <li key="3" style={{margin: '0 10px'}}>
              Credits:{this.props.auth.credits}
            </li>,
            <li key="2"><a href="/api/logout">Logout</a></li>
      ];
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link 
            to={this.props.auth ? '/surveys' : '/'} // if this.props.user is truthy : link to /surveys
            className="left brand-logo"
            >
            Emailo
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);