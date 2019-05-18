import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';

import { ALERT_VIEW_API } from 'actions/api/alert_api';
import { TODO_LIST_API, TODO_CREATE_API, TODO_UPDATE_API, TODO_CHECK_API, TODO_DELETE_API } from 'actions/api/todo_api';

import { List } from 'components/list';
import { Tab } from 'components/tab';
import { Modal } from 'components/modal';
import { Alert } from 'components/alert';
import { Form } from 'components/form';

import './index.css';

// TODO 속성에 따른 목록을 필터링하는 기능을 위한 Tab 버튼 요소.
const SelectOptions = [
    { value: 0, label: '전체', cond_func: (arr) => arr },
    { value: 1, label: '미완료', cond_func: (arr) => arr.filter(todo => !todo.completed) },
    { value: 2, label: '완료', cond_func: (arr) => arr.filter(todo => todo.completed) },
    { value: 3, label: '마감기한 있는 일', cond_func: (arr) => arr.filter(todo => todo.deadline) }
];

// 데이터를 추가할 때 FORM 에서 사용할 Input Field 값 초기화 객체.
const InitialInput = {
    id : 0, title: '', description: '', priority: '', deadline: ''
};

class TodoListView extends PureComponent {
    // todos 는 TODO 데이터, condition 은 Tab 에서 선택한 번호입니다.
    // alerted 는 알림창에 나올 데이터, select_modal 는 TODO 수정 시 Modal 표시 여부, selected 는 수정에서 사용할 Input Field 데이터입니다..
    // alerted 는 null 이면 Modal 를 안 띄어도 되는데, selected 는 InitialInput 로 설정하여 null 이 아닌 값이어서 select_modal Boolean 데이터를 추가했습니다.
    constructor(props){
        super(props);
        this.state = { todos: [], condition: 0, alerted : null, select_modal : false, selected : InitialInput };
    }

    // Todo List View 를 브라우저 화면에 렌더링하면 TODO 목록과 알림창을 불러옵니다.
    // 분산 AJAX 를 사용하여 한 번에 가져옵니다. 서버 측 에러는 catch 에서 처리합니다.
    componentDidMount() {
        axios
            .all([ ALERT_VIEW_API, TODO_LIST_API ])
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
    
    // 각 TODO 완료 여부를 체크하고, 서버 측에서 통신한 결과에 따라 리-렌더링을 진행합니다.
    _handle_click_checked = (pk) => {
        TODO_CHECK_API(pk)
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

    // TODO 데이터를 추가하거나 수정합니다. FORM 데이터의 유효성 확인은 FORM 컴포넌트에서 진행합니다.
    _handle_save_form = (form) => {
        if(form.id === 0){ // form 의 id 가 0번인 경우는 삽입.
            TODO_CREATE_API(form)
                .then(res => {
                    if(res.status === 201){
                        const { message } = res.data;
                        alert(message);
                        window.location.href = '/';
                    }
                }).catch(error => {
                    alert('서버 측에서 데이터 오류가 있습니다. 다시 시도 바랍니다.');
                });
        } else { // form 의 id 가 이미 있으면 수정.
            TODO_UPDATE_API(form)
                .then(res => {
                    if(res.status === 200){
                        const { message } = res.data;
                        alert(message);
                        window.location.href = '/';
                    }
                }).catch(error => {
                    alert('서버 측에서 데이터 오류가 있습니다. 다시 시도 바랍니다.');
                });
        }
    }

    // TODO 데이터를 삭제하고, 서버 측에서 통신한 결과에 따라 리-렌더링을 진행합니다.
    _handle_click_deleted = (pk) => {
        TODO_DELETE_API
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

    // Tab 버튼을 클릭하면 condition 값을 바꿔 TODO 속성에 따라 렌더링합니다.
    _handle_click_change_condition = (option) => {
        this.setState({
            condition: option.value
        });
    }

    // TODO 데이터를 수정할 때 Field 값들을 이에 맞게 초기화합니다.
    _handle_click_selected = (todo) => {
        const { selected } = this.state;
        this.setState({
            selected: (todo === null) ? selected : { ...todo, deadline: todo.deadline ? moment(todo.deadline).format('YYYY-MM-DDTHH:mm:ss') : '' },
            select_modal: true
        });
    }

    // Field 별 onChange 메소드입니다.
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

    // 알림창, 수정, 삽입 등의 작업에서 나오는 Modal 을 닫을 때 실행되는 메소드입니다.
    _handle_click_close_modal = () => {
        this.setState({
            selected: InitialInput,
            alerted: null,
            select_modal: false,
        });
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