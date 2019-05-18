import React, { Fragment } from 'react';

import './Alert.css';

// 알림창을 렌더링할 컴포넌트.
const Alert = ({ alert }) => (
    <Fragment>
        <div className="alert__main">
            <div className="text-center">
                <i className="text-center fas fa-bell first__icon"></i>
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