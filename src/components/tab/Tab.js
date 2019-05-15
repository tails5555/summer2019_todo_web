import React, { Fragment } from 'react';

import './Tab.css';

const Tab = ({ options, condition, condition_change_action }) => (
    <Fragment>
        <div className="tab__group">
        {
            options.map(option => (
                <button 
                    key={option.value} 
                    className={ condition === option.value ? "button small" : "button warning small" } 
                    onClick={ () => condition_change_action(option) }
                >
                    { condition === option.value ? <i className="fas fa-check" /> : null } { option.label }
                </button>
            ))
        }
        </div>
    </Fragment>
);

export default Tab;