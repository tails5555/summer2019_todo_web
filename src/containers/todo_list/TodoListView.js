import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';

import { List } from 'components/list';
import { Tab } from 'components/tab';
import { Modal } from 'components/modal';
import { Alert } from 'components/alert';
import { Form } from 'components/form';

import './index.css';

const SelectOptions = [
    { value: 0, label: '전체', cond_func: (arr) => arr },
    { value: 1, label: '미완료', cond_func: (arr) => arr.filter(todo => !todo.completed) },
    { value: 2, label: '완료', cond_func: (arr) => arr.filter(todo => todo.completed) },
    { value: 3, label: '마감기한 있는 일', cond_func: (arr) => arr.filter(todo => todo.deadline) }
];

const InitialInput = {
    id : 0, title: '', description: '', priority: '', deadline: ''
};

class TodoListView extends PureComponent {
    constructor(props){
        super(props);
        this.state = { todos: [], condition: 0, alerted : null, select_modal : false, selected : InitialInput };
    }

    componentDidMount() {
        axios
            .all([
                axios.get('https://tails5555.pythonanywhere.com/api/alerts/'),
                axios.get('https://tails5555.pythonanywhere.com/api/todos/')
            ])
            .then(
                axios
                    .spread((alerts, todos) => {
                        if(alerts.status === 200){
                            const { titles } = alerts.data;
                            if(titles.length === 0){
                                this.setState({
                                    alerted : null
                                });
                            } else {
                                this.setState({
                                    alerted : alerts.data
                                });
                            }
                        }

                        if(todos.status === 200){
                            const { todo_list } = todos.data;
                            this.setState({
                                todos: todo_list
                            });
                        }
                    })
            )
            .catch(error => {
                alert(error.message);
            });
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

    _handle_click_selected = (todo) => {
        const { selected } = this.state;
        this.setState({
            selected: (todo === null) ? selected : { ...todo, deadline: moment(todo.deadline).format('YYYY-MM-DDTHH:mm:ss') },
            select_modal: true
        });
    }

    _handle_click_close_modal = () => {
        this.setState({
            selected: InitialInput,
            alerted: null,
            select_modal: false,
        });
    }

    _handle_change_form = (event) => {
        const { selected } = this.state;
        const { name, value } = event.target;
        this.setState({
            selected : {
                ...selected,
                [ name ] : value
            }
        });
    }

    _handle_save_form = (form) => {
        if(form.id === 0){
            axios({
                method: 'post',
                data: {
                    todo_form: {
                        ...form, deadline: form.deadline === '' ? null: form.deadline
                    }
                },
                url: `https://tails5555.pythonanywhere.com/api/todos/`
            }).then(res => {
                if(res.status === 201){
                    const { message } = res.data;
                    alert(message);
                    window.location.href = '/';
                }
            }).catch(error => {
                console.log(error.response);
            });
        } else {
            axios({
                method: 'put',
                data: {
                    todo_form: {
                        ...form, deadline: form.deadline === '' ? null: form.deadline
                    }
                },
                url: `https://tails5555.pythonanywhere.com/api/todos/${form.id}/`
            }).then(res => {
                if(res.status === 200){
                    const { message } = res.data;
                    alert(message);
                    window.location.href = '/';
                }
                console.log(res);
            }).catch(error => {
                console.log(error.response);
            });
        }
    }

    render(){
        const { todos, condition, selected, alerted, select_modal } = this.state;
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
                        update_action={ this._handle_click_selected }
                    />
                    
                    <Modal 
                        show={ alerted !== null } 
                        close_action={ this._handle_click_close_modal }    
                    >
                        <Alert alert={ alerted } />
                    </Modal>

                    <Modal 
                        show={ select_modal } 
                        close_action={ this._handle_click_close_modal }    
                    >
                        <Form 
                            todo_form={ selected } 
                            change_action={ this._handle_change_form.bind(this) }    
                            save_action={ this._handle_save_form }
                        />
                    </Modal>

                    <button 
                        className="button__fixed" 
                        onClick={() => this._handle_click_selected(null)}
                    >
                        <i className="fas fa-plus" />
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default TodoListView;