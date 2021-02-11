import * as React from 'react';
import { Container, Message, Button, List } from 'semantic-ui-react';
import { schedule, fetchSchedulefromAccount,
    cancelScheduleOfAccount, deleteStudentOfSchedule } from './client';
import { auth } from '../login';

interface ScheduleElementProps {

}

interface ScheduleElementStats {
    schedule: schedule[];
}

export class MyScheduleElement extends React.Component<ScheduleElementProps,ScheduleElementStats> {
    constructor(props: ScheduleElementProps) {
        super(props);
        this.state = {
            schedule: []
        }

        this.FetchList = this.FetchList.bind(this);
    }
    
    public render = () => {
        const listItems = this.state.schedule.map(schedule =>
            <List.Item key = {schedule.id}>
                {schedule.date}
                {schedule.part}
                    <Button onClick = {() =>
                        this.CancelLesson(schedule.id, schedule.date, schedule.part)}>취소</Button>
            </List.Item>
        );
        return(    
            <div>
                {
                    this.state.schedule.length !== 0 ?  
                    <List items = {listItems}/> :
                    <span>수업이 없습니다.</span>
                }
            </div>
        )
    }
    public componentDidMount() {
        this.FetchList();
    }
    public componentDidUpdate() {
        this.render();
    }

    private FetchList() {
        auth.onAuthStateChanged(user => {
            if(user) {     
                fetchSchedulefromAccount(user.uid).then(response => {
                    this.setState({ schedule: response.data.schedule });
                    console.log(this.state.schedule);
                }).catch(err => {
                    console.log("schedule fetch error!");
                })
            }
        })
    }
    private CancelLesson(id: string, date: string, part: string) {
        auth.onAuthStateChanged(user => {
            if(user) {
                console.log("cancel schedule");
                cancelScheduleOfAccount(user.uid, id);
                deleteStudentOfSchedule(date, part, user.uid);
                this.FetchList();
            }
        });
    }
}

