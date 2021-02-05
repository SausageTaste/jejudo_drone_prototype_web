import * as React from 'react';
import Calendar from 'react-calendar';
import { Container } from 'semantic-ui-react';
import { Route } from 'react-router-dom';

interface LessonProps {
    userId : string;
};
interface LessonStats {
    date;
};

export class CalendarPage extends React.Component<LessonProps,LessonStats> {
    constructor(props : LessonProps) {
        super(props);
        this.state = {
            date: new Date()
        }
    }
    public render = () =>
    <Container>
        <Route render = {({ history }) => ( 
        <Calendar
            onChange = {value => history.push(`/schedule/reservation/${value.toDateString()}`)}
        />)        
    }/>
    </Container>
}
