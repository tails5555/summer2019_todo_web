import React, { Fragment } from 'react';

import { Element } from 'components/element';

import './List.css';

const List = ({ todos, check_action }) => (
    <Fragment>
        <ul className="todos__list no-bullet">
        {
            todos.map((todo) => <Element key={ todo.id } element={ todo } check_action={ () => check_action(todo.id) }/> )   
        }
        </ul>
    </Fragment>
);

export default List;