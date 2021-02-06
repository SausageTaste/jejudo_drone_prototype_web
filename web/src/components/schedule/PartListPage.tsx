import * as React from 'react';
import { Container, Button, Comment, List, ListItem } from 'semantic-ui-react';
import { match } from 'react-router-dom';
import {student, fetchStudentsList } from './client';

interface keyMatch {
    date: string;
}
interface ScheculeProps {
    match: match<keyMatch>;
}
interface ScheduleStats {
    selected?: string,
    studentsList?: student[]
}

export class PartListPage extends React.Component<ScheculeProps, ScheduleStats> {
    constructor(props: ScheculeProps) {
        super(props);
        this.state = {
            selected: '',
            studentsList: null
        }
        this.fetchStudentsList = this.fetchStudentsList.bind(this);
    }

    public render() {
        const { date } = this.props.match.params;
        console.log("date: ", date);
        return (
            <div>
                <h2>{date}</h2>
                <Container>
                    <Container>
                        <Button onClick = {() => this.fetchStudentsList('morning')}>오전</Button>
                    </Container> <br/>
                    <Container> 
                        <Button onClick = {() => this.fetchStudentsList('noon')}>점심시간</Button>  
                    </Container> <br/>
                    <Container>
                        <Button onClick = {() => this.fetchStudentsList('afternoon')}>오후</Button>
                    </Container>
                </Container>
                {
                    this.state.selected !== '' ?
                    <div>
                        <h2>{this.state.selected}</h2>
                        {
                            this.state.studentsList.length > 0 ?
                            <List items = {this.state.studentsList.map(element => <ListItem>
                                {element.name}
                            </ListItem>)}/>  :
                            <span>신청자가 없습니다.</span>
                        }
                    </div>:
                    <span>시간대를 선택하세요.</span>
                }
            </div>
    )};
    componentDidMount() {

    }
    fetchStudentsList(part: string) {
        let { date } = this.props.match.params;
        fetchStudentsList(date, part).then(response => {
            this.setState({
                selected: part,
                studentsList: response.data.list
            });
        }).catch(err => {
            console.log(err);
        })
    }

}