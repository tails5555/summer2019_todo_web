import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';

import { List } from 'components/list';
import { Tab } from 'components/tab';
import { Modal } from 'components/modal';

import './index.css';

const SelectOptions = [
    { value: 0, label: '전체', cond_func: (arr) => arr },
    { value: 1, label: '미완료', cond_func: (arr) => arr.filter(todo => !todo.completed) },
    { value: 2, label: '완료', cond_func: (arr) => arr.filter(todo => todo.completed) },
    { value: 3, label: '마감기한 있는 일', cond_func: (arr) => arr.filter(todo => todo.deadline) }
];

class TodoListView extends PureComponent {
    constructor(props){
        super(props);
        this.state = { todos: [], condition: 0, selected : null };
    }

    componentDidMount() {
        axios
            .get('https://tails5555.pythonanywhere.com/api/todos/')
            .then(res => {
                if(res.status === 200){
                    const { todo_list } = res.data;
                    this.setState({
                        todos: todo_list
                    });
                }
            })
            .catch(error => {
                alert(error.message);
            })       
    }

    _handle_click_change_condition = (option) => {
        this.setState({
            condition: option.value
        });
    }

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

    _handle_click_selected = (todo) => {
        if(todo === null){
            this.setState({
                selected: {
                    id : 0, title: '', description: '', priority: '', deadline: null
                }
            });
        } else {
            this.setState({
                selected: { ...todo }
            });
        }
    }

    _handle_click_deleted = (pk) => {
        axios
            .delete(`https://tails5555.pythonanywhere.com/api/todos/${pk}/`)
            .then(res => {
                if(res.status === 200){
                    const { todos } = this.state;
                    const { message } = res.data;
                    alert(message);

                    let tmp_todos = todos.filter(o => o.id !== pk);
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
        const { todos, condition, selected } = this.state;
        return (
            <Fragment>
                <div className="todos">
                    <h1 className="text-center">해야 할 일</h1>
                    <Tab 
                        condition={ condition } 
                        options={ SelectOptions } 
                        condition_change_action={ this._handle_click_change_condition } 
                    /> 
                    <List 
                        todos={ SelectOptions[condition].cond_func(todos) } 
                        check_action={ this._handle_click_checked }
                        delete_action={ this._handle_click_deleted }
                    />
                    <Modal
                        show={ selected !== null }
                    />
                    <button 
                        className="button__fixed" 
                        onClick={() => this._handle_click_selected()}
                    >
                        <i className="fas fa-plus" />
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default TodoListView;