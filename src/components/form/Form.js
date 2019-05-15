import React, { Fragment } from 'react';

const PriorityOptions = [
    { value: '1', label: '사소' },
    { value: '2', label: '여유' },
    { value: '3', label: '평범' },
    { value: '4', label: '긴급' },
    { value: '5', label: '위급' }
];

const Form = ({ change_action, todo_form, save_action }) => (
    <Fragment>
        <div id="todo__form">
            <h1 className="text-center">할 일 { todo_form.id === 0 ? '등록' : '수정' }</h1>
            <div id="todo__form__title">
                <label>
                    제목
                    <input type="text" name="title" placeholder="제목을 입력하세요." value={ todo_form.title } onChange={ change_action } />
                </label>
            </div>
            <div id="todo__form__description">
                <label>
                    내용
                    <textarea name="description" placeholder="내용을 입력하세요." value={ todo_form.description } onChange={ change_action } />
                </label>
            </div>
            <div id="todo__form__priority">
                <label>
                    중요도
                    <select name="priority" value={ todo_form.priority } onChange={ change_action }>
                        <option value="0">-- 선택 --</option>
                        { PriorityOptions.map(priority => <option key={priority.value} value={priority.value}>{ priority.label }</option>)}
                    </select>
                </label>
            </div>
            <div id="todo__form__deadline">
                <label>
                    제한 날짜
                    <input type="datetime-local" name="deadline" value={ todo_form.deadline } onChange={ change_action } />
                </label>
            </div>
            <button className="button success expanded" onClick={ () => save_action(todo_form) }>
                <i className="fas fa-save" /> 저장
            </button>
        </div>
    </Fragment>
);

export default Form;