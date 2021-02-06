import * as React from 'react';
import { List } from 'semantic-ui-react';
import { auth, Account, fetchAccount } from '../login'
import { MyScheduleElement } from './my_schedule_element';

interface ScheduleProps {

};
interface ScheduleStats {
    user?;
    account?: Account;
};

export class MyScheduleList extends React.Component<ScheduleProps, ScheduleStats> {
    constructor(props: ScheduleProps) {
        super(props);
        this.state = {
            user: null,
            account: null,
        }
    }
    public render() {
        return  (
            <div>
                <h1>나의 수업</h1>
                <h2>{   this.state.account ?
                                this.state.account.name
                            :   "로그인 하십시오." }</h2>
                <MyScheduleElement/>
            </div>
        )
    }
    componentWillUnmount() {
        
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                fetchAccount(user.uid).then(result => {
                    this.setState({
                        user: user,
                        account: result.data.account,
                    })
                })
            }
            else {
                
            }
        })
    }
}