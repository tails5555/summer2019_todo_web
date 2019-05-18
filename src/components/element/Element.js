import React, { Fragment } from 'react';

import './Element.css';

// TODO 데이터를 렌더링할 컴포넌트.
// TODO 체크는 회색 화면을 클릭해야 진행할 수 있습니다.
const Element = ({ element, check_action, delete_action, update_action }) => (
    <Fragment>
        <li className="todos__item">
            <div className={ `todos__item__toggle ${ element.completed ? "todos__item__toggle--completed" : '' }` } onClick={ check_action }>
                <h2>{ element.title }</h2>
                <p><i className="fas fa-comment" /> { element.description }</p>
                {
                    element.deadline ? (
                        <p><i className="fas fa-calendar" /> { new Date(element.deadline).toLocaleString() }</p>
                    ) : null
                }
                <div className="todos__item__priority text-right">
                    { [...Array(Number(element.priority))].map((e, i) => <i className="fas fa-star" key={i} />) }
                </div>
            </div>

            <div className="todos__item__button button-group pull-right">
                <button className="button info" onClick={ update_action }>
                    <i className="fas fa-edit" />
                </button>
                <button className="button alert" onClick={ delete_action }>
                    <i className="fas fa-trash" />
                </button>
            </div>
        </li>
    </Fragment>
);

export default Element;