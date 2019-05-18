import React, { PureComponent, Fragment } from 'react';

import { TodoListView } from './containers/todo_list';

// Main 화면에 보여질 컴포넌트.
// 복수의 컨테이너 컴포넌트들이 있을 것을 감안하여 만들었습니다.
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