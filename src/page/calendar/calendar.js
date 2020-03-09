import React, {useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import {Button, Form, Modal} from "react-bootstrap";
import TimeKeeper from 'react-timekeeper';
import moment from 'moment'

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import './_calendar.scss'

function Calendar(props) {

    const initiateState = {
        showModal: false,
        dateModal: "",
        isEdit: false,
        timeFrom: moment().format("hh:mm A"),
        timeTo: moment().format("hh:mm A"),
        showTimeFrom: false,
        showTimeTo: false,
        color: ['#f8b400', '#66a5ad', '#2c786c' ],
        events: JSON.parse(localStorage.getItem('events') || "[]")
    }

    const [ state, setState ] = useState(initiateState)
    const [ events, setEvents ] = useState(JSON.parse(localStorage.getItem('events') || "[]"))

    useEffect(() => {
    }, [])

    function handleClick(e) {
        setState({...state, nameEvent: "", timeFrom: moment().format("hh:mm A"), timeTo: moment().format("hh:mm A"), emailEvent: "", dateModal: e.date, showModal: true, isEdit: false})
    }

    function handleInput(e) {
        setState({...state, [e.target.name]: e.target.value})
    }

    function closeModal() {
        setState({...state, showModal: false})
    }

    function deleteEvent() {
        let data = state.events.filter( e => e.id.toString() !== state.idEvent.toString())
        setState({ ...state, events: data})
        setEvents(data)
        localStorage.setItem('events', JSON.stringify(data))
        closeModal()
    }

    function addEvent() {
        const { nameEvent, emailEvent, timeFrom,  timeTo} = state
        let data = state.events;
        let color_chosen = (data.filter( e => { return e.date === moment(state.dateModal).format('YYYY-MM-DD')})).map(({color}) => color)
        let remaining_color = state.color.filter( e => {return !(color_chosen.includes(e))})
        if(state.isEdit){
            data = data.map( e => {
                let data = e
                if(e.id.toString() === state.idEvent.toString()){
                    data = {
                        id: state.idEvent,
                        title: nameEvent,
                        date: moment(state.dateModal).format('YYYY-MM-DD'),
                        color: remaining_color[Math.floor(Math.random() * remaining_color.length)],
                        emailEvent,
                        timeFrom,
                        timeTo
                    }
                }
                return data
            })
        } else {
            data.push({
                id: new Date().getTime(),
                title: nameEvent,
                date: moment(state.dateModal).format('YYYY-MM-DD'),
                color: remaining_color[Math.floor(Math.random() * remaining_color.length)],
                emailEvent,
                timeFrom,
                timeTo
            })
        }
        setState({...state, events: data })
        setEvents(data)
        localStorage.setItem('events', JSON.stringify(data))
        closeModal()
    }

    function editEvent(e) {
        let data = state.events.find(x => x.id.toString() === e.event.id.toString());
        setState({...state, isEdit: true, idEvent:  e.event.id.toString(), nameEvent: data.title, dateModal: data.date, timeFrom: data.timeFrom, timeTo: data.timeTo, emailEvent: data.emailEvent, showModal: true})
    }

    return (
        <div className="row m__r--20 m__l--20">
            <FullCalendar
                defaultView="dayGridMonth"
                dateClick={(e) => handleClick(e)}
                plugins={[ dayGridPlugin, interactionPlugin  ]}
                events={events}
                eventClick={(e) => editEvent(e)}
            />
            <Modal
                show={state.showModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                onHide={() => closeModal()}
                className="modal-login__google"
                centered>
                <Modal.Header closeButton>
                    <h4 className="f__bold f__black">{state.isEdit ? "Edit" : "Set"} Event in &nbsp;
                        {moment(state.dateModal).format('MMM D, YYYY')}
                    </h4>
                </Modal.Header>
                {
                    (state.events.filter( e => { return e.date === moment(state.dateModal).format('YYYY-MM-DD')})).length === 3 ?
                        <Modal.Body>
                            <div className="row">
                               <div className="col-md-12">
                                   <h6>Events is full. Only 3 events in a day</h6>
                               </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-12">
                                    <Button onClick={() => closeModal()} variant="secondary" className="btn btn-secondary pull__right">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                        :
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>
                                            Name:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nameEvent"
                                            value={state.nameEvent}
                                            onChange={e => handleInput(e)}
                                            className=""
                                            placeholder="ex: Night Event"
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group>
                                        <Form.Label>
                                            From:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fromEvent"
                                            readOnly
                                            value={state.timeFrom}
                                            onChange={e => handleInput(e)}
                                            onClick={() => setState({...state, showTimeFrom: true})}
                                            placeholder="ex: 19.00"
                                        />
                                        {
                                            state.showTimeFrom ?
                                                <TimeKeeper
                                                    time={state.timeFrom}
                                                    onChange={(newTime) => setState({...state, timeFrom: newTime.formatted12})}
                                                    onDoneClick={() => setState({...state, showTimeFrom: false})}
                                                    switchToMinuteOnHourSelect
                                                    doneButton={(newTime) => (
                                                        <div
                                                            style={{ textAlign: 'center', padding: '10px 0' }}
                                                            onClick={() => setState({...state, showTimeFrom: false})}
                                                        >
                                                            Done
                                                        </div>
                                                    )}
                                                /> : ''
                                        }
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group>
                                        <Form.Label>
                                            To:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="toEvent"
                                            readOnly
                                            value={state.timeTo}
                                            onChange={e => handleInput(e)}
                                            onClick={() => setState({...state, showTimeTo: true})}
                                            placeholder="ex: 23.00"
                                        />
                                        {
                                            state.showTimeTo ?
                                                <TimeKeeper
                                                    time={state.timeFrom}
                                                    onChange={(newTime) => setState({...state, timeTo: newTime.formatted12})}
                                                    onDoneClick={() => setState({...state, showTimeTo: false})}
                                                    switchToMinuteOnHourSelect
                                                    doneButton={(newTime) => (
                                                        <div
                                                            style={{ textAlign: 'center', padding: '10px 0' }}
                                                            onClick={() => setState({...state, showTimeTo: false})}
                                                        >
                                                            Done
                                                        </div>
                                                    )}
                                                /> : ''
                                        }
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>
                                            Email:
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="emailEvent"
                                            onChange={e => handleInput(e)}
                                            value={state.emailEvent}
                                            className=""
                                            placeholder="ex: jhon.due@email.com"
                                        />
                                        <Form.Text>
                                            For invite event to email.
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-12">
                                    {
                                        state.isEdit ?
                                            <Button onClick={() => deleteEvent()} variant="danger" className="btn btn-danger">
                                                Delete
                                            </Button>
                                            :
                                            ""
                                    }
                                    <Button onClick={() => addEvent()} variant="success" className="btn btn-success pull__right m__l--10">
                                        {state.isEdit ? "Update" : "Submit"}
                                    </Button>
                                    <Button onClick={() => closeModal()} variant="secondary" className="btn btn-secondary pull__right">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                }
            </Modal>
        </div>
    )
}

export default Calendar;
