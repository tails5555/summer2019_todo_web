import React, { Fragment } from 'react';

import './Modal.css';

const Modal = ({ show, children, close_action }) => (
    <Fragment>
        <div className={ `modal ${ show ? 'display-block' : 'display-none' }` }>
            <section className="modal__main">
                { children }
                <button className="button alert expanded" onClick={ close_action }>
                    <i className="fas fa-times" /> 닫기
                </button>
            </section>
        </div>
    </Fragment>
);

export default Modal;