import React, { PureComponent, Fragment } from 'react';

import { TodoListView } from './containers/todo_list';

class MainContainer extends PureComponent {
    constructor(props){
        super(props);
        this.state = { }
    }

    render(){
        return (
            <Fragment>
                <TodoListView />
            </Fragment>
        )
    }
}

export default MainContainer;