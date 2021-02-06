import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from './login'

interface MainMenuState {
    user?,
    lesson?: boolean;
}

export class MainMenu extends React.Component<{}, MainMenuState> {

    constructor(props:{} ,state: MainMenuState) {
        super(props);
        this.state = {
            user: null,
            lesson: false
        }
    }

    public OpenOrCloseLessonMenu() {
        if(!this.state.lesson)
        {
            this.setState({lesson: true});
            document.getElementById("lesson").style.display = "block";
        }
        else
        {
            this.setState({lesson: false});
            document.getElementById("lesson").style.display = "none";
        }
    }

    public render() {
        const lessonMenu = [
            'reservation',
            'my schedule'
        ];
        const lessonMenu_kr = new Map([
            ['reservation', '예약' ],
            ['my schedule', '나의 수업']
        ]);

        return(
            <Menu inverted vertical fixed = {'left'}>
                <Menu.Item as={Link} to={'/'}>
                    Home
                    <Icon name = 'home'/>
                </Menu.Item>
                <Menu.Item>
                    Menu
                    <Icon name = 'list'/>
                    <Menu.Menu>
                        <Menu.Item
                        key = "announcements"
                        as = {NavLink}
                        to = {
                            { pathname: `/announcements`}
                        }>
                            공지사항
                        </Menu.Item>
                        <Menu.Item>
                            수업
                            <div id = "schedule">  
                                <Menu.Menu>
                                    <Menu.Menu>
                                        { lessonMenu.map(item =>
                                        <Menu.Item
                                        key = {item}
                                        as = {NavLink}
                                        to = {
                                            { pathname: `/schedule/${item}`}
                                        }>
                                            {lessonMenu_kr.get(item)}
                                        </Menu.Item>
                                        )}
                                    </Menu.Menu>
                                </Menu.Menu> 
                            </div>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
        );
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                this.setState({user: user});
            }
        })
    }
}