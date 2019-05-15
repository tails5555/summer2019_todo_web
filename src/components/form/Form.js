import React, { PureComponent, Fragment } from 'react';

import moment from 'moment';
import SimpleReactValidator from 'simple-react-validator';

const PriorityOptions = [
    { value: '1', label: '사소' },
    { value: '2', label: '여유' },
    { value: '3', label: '평범' },
    { value: '4', label: '긴급' },
    { value: '5', label: '위급' }
];

class Form extends PureComponent {
    constructor(props){
        super(props);
        this.validator = new SimpleReactValidator();
    }

    _handle_submit = () => {
        const { save_action, todo_form } = this.props; 
        if(this.validator.allValid()){
            const { deadline } = todo_form;
            let has_error = false;
            if(deadline){
                if(moment(deadline).isBefore(moment())){
                    alert(`제한 날짜는 지금 시간 이후로 입력하세요. 지금 시각은 ${new Date().toLocaleString()} 입니다.`);
                    has_error = true;
                }
            }
            if(!has_error) save_action(todo_form);
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render(){
        const { change_action, todo_form } = this.props;
        return (
            <Fragment>
                <div id="todo__form">
                    <h1 className="text-center">할 일 { todo_form.id === 0 ? '등록' : '수정' }</h1>
                    <div id="todo__form__title">
                        <label>
                            제목
                            <input type="text" name="title" placeholder="제목을 입력하세요." value={ todo_form.title } onChange={ change_action } />
                            { this.validator.message('title', todo_form.title, 'required|max:127') }
                        </label>
                    </div>
                    <div id="todo__form__description">
                        <label>
                            내용
                            <textarea name="description" placeholder="내용을 입력하세요." value={ todo_form.description } onChange={ change_action } />
                            { this.validator.message('description', todo_form.description, 'required') }
                        </label>
                    </div>
                    <div id="todo__form__priority">
                        <label>
                            중요도
                            <select name="priority" value={ todo_form.priority } onChange={ change_action }>
                                <option value="0">-- 선택 --</option>
                                { PriorityOptions.map(priority => <option key={priority.value} value={priority.value}>{ priority.label }</option>)}
                            </select>
                            { this.validator.message('priority', todo_form.priority, 'required|in:1,2,3,4,5') }
                        </label>
                    </div>
                    <div id="todo__form__deadline">
                        <label>
                            제한 날짜
                            <input type="datetime-local" name="deadline" value={ todo_form.deadline } onChange={ change_action } />
                        </label>
                    </div>
                    <button className="button success expanded" onClick={ this._handle_submit }>
                        <i className="fas fa-save" /> 저장
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default Form;