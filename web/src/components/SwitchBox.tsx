import * as React from 'react';
import { render } from 'react-dom';
import { Switch } from 'react-router';
import * as Firebaseui from 'firebaseui'
import { BrowserRouter, Redirect, Route, Link } from 'react-router-dom';
import { AnnounceList, AnnouncePage, PostForm } from './announce';
import { Button, Container } from 'semantic-ui-react';
import { CalendarPage, PartPage, MyScheduleList } from './schedule';
import { auth, LogIn, AccountPage } from './login'

interface boxprops {

}
interface boxstate {
    user?,
}

export class SwitchBox extends React.Component<boxprops, boxstate> {
    constructor(props: boxprops) {
        super(props);

        this.state = {
            user: null,
        }
    }
    public render = () => (
        <Container>
            <Switch>
                <Route
                    exact = {true} path = '/announcements'
                    component = { AnnounceList }
                />
                <Route
                    exact = {true} path = '/announcements/page/:key'
                    component = { AnnouncePage }
                />
                <Route
                    exact = {true} path = '/announcements/post'
                    component = { PostForm }
                />
                <Route
                    exact = {true} path = '/schedule/reservation'
                    component = { CalendarPage }
                />
                <Route
                    exact = {true} path = '/schedule/reservation/:date'
                    component = { PartPage }
                />
                <Route
                    exact = {true} path = '/schedule/my schedule'
                    component = { MyScheduleList }
                />
                <Route
                    exact = {true} path = '/login'
                    component = { LogIn }
                />
                <Route
                    exact = {true} path = '/login/create account'
                    component = { AccountPage }
                />
                <Route
                    exact = {true} path = '/'
                    render = { () =>
                        <div>        
                            <h1>Main Menu</h1>
                            <div id = "firebaseui-auth-container">
                                {

                                }
                                <Button
                                    key = 'login'
                                    as = {Link}
                                    to = '/login'
                                >{
                                    this.state.user ?
                                    '회원 정보' :
                                    'log in'
                                }
                                </Button>
                            </div>
                        </div>              
                    }
                />
            </Switch>
        </Container>
    );
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                this.setState({user: user});
            } else {
                this.setState({user: null});
            }
        })
    }
};