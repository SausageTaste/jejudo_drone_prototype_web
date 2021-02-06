import * as React from 'react';
import { Container, Button } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { Account, fetchAccount, postAccount } from './client';

interface accountProps {
    
}
interface accountState {
    user;
    email: string;
    password: string;
    account: Account;
}

export class AccountPage extends React.Component<accountProps, accountState> {
    constructor(props: accountProps) {
        super(props);

        this.state = {
            user: null,
            email: '',
            password: '',
            account: {
                name: '',
                phoneNum: '',
                curriculum: '',
                authority: 'student',
            }
        }

        this.CreateAccount = this.CreateAccount.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
    }

    public render = () => {
        return(
            <div>
                <h1>계정 정보 입력</h1>
                <Container>
                    {this.state.user ? 
                        <div>
                            <h3>이메일: {this.state.user ?  auth.currentUser.email : null }</h3>
                        </div> :
                        <div>
                            <span>이메일</span><input id = "email"></input> <br/>
                            <span>비밀번호</span><input id = "password"></input>
                        </div>
                    }
                    <div>
                        <span>이름</span><input id = "name_input"></input> <br/>
                        <span>전화번호</span><input id = "phone"></input> <br/>
                        <span>과정</span><select id = "curriculum">
                            <option value = "default">--과정을 선택하세요--</option>
                            <option value = "">중형</option>
                            <option value = "">소형</option>
                        </select>
                    </div>
                </Container>
                <this.cancelButton/>
                <this.CreateAccount/>
            </div>
        )
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.setState({user: user});
        });
    }
    
    private CreateAccount = () => <Route render = {({ history }) => 
        <Button onClick = {() => {
            let _name  = (document.getElementById("name_input") as HTMLInputElement).value;
            console.log(_name);
            let _phoneNum = (document.querySelector('#phone') as HTMLInputElement).value;
            let _curriculum = (document.querySelector('#curriculum') as HTMLInputElement).value;
            auth.onAuthStateChanged(user => {
                if(user) {
                    this.setState({
                        account : {
                            id: user.uid,
                            name: _name,
                            phoneNum: _phoneNum,
                            curriculum: _curriculum,
                        } as Account
                    });
                    postAccount(this.state.account).then(() =>{
                        alert('계정이 생성되었습니다.');
                        history.push('/');
                    })
                } else {
                    let _email = (document.querySelector('#email') as HTMLInputElement).value;
                    let _password = (document.querySelector('#password') as HTMLInputElement).value;
                    auth.createUserWithEmailAndPassword(_email, _password).then(result => {
                        this.setState({
                            account : {
                                id: result.user.uid,
                                name: _name,
                                phoneNum: _phoneNum,
                                curriculum: _curriculum,
                            } as Account
                        });
                        postAccount(this.state.account).then(() => {
                            alert('계정이 생성되었습니다.');
                            history.push('/');
                        })
                    })
                }
            });
        }}>확인
        </Button>
    }/>
    private cancelButton = () => <Route render = {({ history }) =>
        <Button onClick = {() => {
            auth.onAuthStateChanged(user => {
                if(user) {
                    //need to delete DB data
                    user.delete().then(() => {
                        history.push('/');
                    }).catch(err => {
                        console.log('delete failed');
                    });
                } else {
                    history.push('/');
                }
            })
        }}>취소
        </Button>
    }/>
}