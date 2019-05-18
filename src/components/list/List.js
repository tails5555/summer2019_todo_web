import React, { Fragment } from 'react';

import { Element } from 'components/element';

import './List.css';

// TODO 데이터들을 렌더링할 컴포넌트.
const List = ({ todos, check_action, delete_action, update_action }) => (
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
                        update_action={ () => update_action(todo) }
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