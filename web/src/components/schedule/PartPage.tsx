import * as React from 'react';
import { Container, Button, Comment } from 'semantic-ui-react';
import { match } from 'react-router-dom';
import { schedule, student, postScheduletoAccount, postStudentToList } from './client';
import { auth, Account, fetchAccount } from '../login'

interface keyMatch {
    date: string;
}
interface ScheculeProps {
    match: match<keyMatch>;
}
interface ScheduleStats {
    user?;
    account?: Account;
    keyVal?: string;
}

export class PartPage extends React.Component<ScheculeProps, ScheduleStats> {
    constructor(props: ScheculeProps) {
        super(props);
        this.state = {
            user: null,
            account: null,
            keyVal : ''
        }
        this.Reserve = this.Reserve.bind(this);
    }

    public render() {
        const { date } = this.props.match.params;
        console.log("date: ", date);
        return (
            <div>
                <h2>{date}</h2>
                <h3>{this.state.account ? this.state.account.name : null }</h3>
                <Container>
                    <Container>
                        <Button onClick = {() => this.Reserve('morning')}>오전</Button>
                    </Container> <br/>
                    <Container> 
                        <Button onClick = {() => this.Reserve('noon')}>점심시간</Button>                            
                        <Comment>수강생이 적은 경우 수업하지 않습니다.</Comment>
                    </Container> <br/>
                    <Container>
                        <Button onClick = {() => this.Reserve('afternoon')}>오후</Button>
                    </Container>
                </Container>
            </div>
    )};
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.setState({user: user});
            fetchAccount(user.uid).then(response => {
                this.setState({account: response.data.account});
            })
        })
    }

    private Reserve(part: string) {
        const { date } = this.props.match.params;
        let _id = this.state.user.uid;
        
        let content = {
            date: date,
            part: part,
        } as schedule;
        postScheduletoAccount(_id, content).then(result => {
            if(result.data.result === "already exist") {
                alert("이미 신청되어 있습니다.");
            } else {
                let student = {
                    key: _id,
                    name: this.state.account.name,
                } as student;
                postStudentToList(date, part, student);
                alert("신청되었습니다.");
            }
        })
    }
}