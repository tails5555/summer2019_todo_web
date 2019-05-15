import React, { Fragment } from 'react';

import './Alert.css';

const Alert = ({ alert }) => (
    <Fragment>
        <div className="alert__main">
            <div className="text-center">
                <h1 className="text-center fas fa-bell" />
                <h3>{ alert && alert.alert_message }</h3>
            </div>
            <ul className="list__center">
            {
                alert && alert.titles ? alert.titles.map((title, idx) => <li key={idx}>{ title }</li>) : null
            }
            </ul>
        </div>
    </Fragment>
);

export default Alert;