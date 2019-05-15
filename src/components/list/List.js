import React, { Fragment } from 'react';

import { Element } from 'components/element';

import './List.css';

const List = ({ todos, check_action, delete_action }) => (
    <Fragment>
        <ul className="todos__list no-bullet">
        {
            todos.length > 0 ?
                todos.map((todo) => (
                    <Element 
                        key={ todo.id } 
                        element={ todo } 
                        check_action={ () => check_action(todo.id) }
                        delete_action={ () => delete_action(todo.id) }
                    />
                )) :
                <div className="text-center">
                    <h2><i className="fas fa-exclamation" /></h2>
                    <p>해당 조건을 만족하는 TODO 데이터가 없습니다.</p>
                </div>
        }
        </ul>
    </Fragment>
);

export default List;