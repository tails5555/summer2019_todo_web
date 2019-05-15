import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';

import { List } from 'components/list';

import './index.css';

class TodoListView extends PureComponent {
    constructor(props){
        super(props);
        this.state = { todos : [] };
    }

    componentDidMount() {
        axios
            .get('https://tails5555.pythonanywhere.com/api/todos/')
            .then(res => {
                if(res.status === 200){
                    const { todo_list } = res.data;
                    let tmp_todos = todo_list.map(o => ({ ...o, selected : false }));
                    this.setState({
                        todos: tmp_todos
                    });
                }
            })
            .catch(error => {
                alert(error.message);
            })       
    }

    // TODO 
    _handle_click_checked = (pk) => {
        axios
            .put(`https://tails5555.pythonanywhere.com/api/checker/${pk}/`)
            .then(res => {
                if(res.status === 200){
                    const { todos } = this.state;
                    const { todo_element } = res.data;
                    let tmp_todos = todos.map(o => o.id === pk ? todo_element : o);
                    this.setState({
                        todos: tmp_todos
                    });
                }
            })
            .catch(error => {
                const { response } = error;
                if(response.status === 404) {
                    alert(response.data.message);
                }
            });
    }

    render(){
        const { todos } = this.state;
        return (
            <Fragment>
                <div className="todos">
                    <h1>해야 할 일</h1>
                    <List todos={ todos } check_action={ this._handle_click_checked } />
                </div>
            </Fragment>
        );
    }
}

export default TodoListView;