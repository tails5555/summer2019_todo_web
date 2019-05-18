import React, { Fragment } from 'react';

import './Tab.css';

// TODO 의 검색 조건 별로 보여주기 위해 체크하는 Tab 컴포넌트.
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