import * as React from 'react'
import { Link, Route } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';
import { auth, provider, session, local } from './firebaseConfig'
import { Account, fetchAccount, postAccount, deleteAccount } from './client'

interface loginProps {
    
}
interface loginState {
    user;
    account: Account;
}

export class LogIn extends React.Component<loginProps, loginState> {

    constructor(props: any) {
        super(props);

        this.state = {
            user: null, //auth.currentUser,
            account: null,
        }

        this.SignInWithGoogle = this.SignInWithGoogle.bind(this);
        this.SignOut = this.SignOut.bind(this);
        this.fetchAccount = this.fetchAccount.bind(this);
    }

    SignInWithGoogle = () => <Route render = {({ history }) => (
        <Button onClick={ () => {
            auth.setPersistence('session').then(() => {
                auth.signInWithPopup(provider).then(result => {
                    this.setState({user: result.user});
                    fetchAccount(result.user.uid).then(response => {
                        if(response.data.account) {
                            this.setState({ account: response.data.account });
                            history.push('/');
                        } else {
                            alert('회원 정보가 없습니다.\n정보를 입력해 주세요.');
                            history.push('/login/create account');
                        }
                    })
                }).catch(err => {
                   console.log(err);
                });
            });
        }}>
            Sign in with Google
        </Button> )}
    />
    SignIn = () => <Route render = {({ history }) => (
        <Button onClick = {() => {
            let _id = (document.getElementById('user_email') as HTMLInputElement).value;
            let _pw = (document.getElementById('user_pw') as HTMLInputElement).value;

            auth.signInWithEmailAndPassword(_id, _pw).then(result => {
                fetchAccount(result.user.uid).then(response => {
                    this.setState({
                        user: result.user,
                        account: response.data.account,
                    });
                    history.push('/');
                });
            });
        }}>
            Log In
        </Button>)}
    />
    SignOut = () => {
        auth.signOut().then(() => {
            this.setState({user: auth.currentUser});
        });
        console.log(this.state.user);
    }

    render() {
        return (
            <div className="LogIn">
                <header>
                    {
                        this.state.account
                        ? <p>Hello, {this.state.account.name}</p>
                        : <p>Please sign in.</p>
                    }

                    {
                        this.state.user
                        ? <button onClick={this.SignOut}>Sign out</button>
                        : <this.SignInWithGoogle/>
                    }
                </header>

                {
                    this.state.user
                    ? <></>
                    :
                    <div>
                        <Container>
                            <input id = 'user_email'></input>
                            <input id = 'user_pw'></input>       
                            <this.SignIn/>
                        </Container>
                        <Container>     
                            <Button as={Link} to={'/login/create account'}>
                                회원가입
                            </Button>
                        </Container>
                    </div>
                }
            </div>
        );
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                fetchAccount(user.uid).then(result => {
                    this.setState({
                        user: user,
                        account: result.data.account,
                    });
                    this.render();
                })
            }
        }) 
    }

    private fetchAccount(keyVal: string) {
        fetchAccount(keyVal).then(response => {
            console.log(response.data.account);
            if(response.data.account) {
                console.log('login!');
                this.setState({
                    account: response.data.account
                });
            }
            else {
                console.log("no account!");
            }
        }).catch(err => {
                console.log('account fetch failed:', err);
        })
    }
    private deleteAccount(keyVal: string) {
        deleteAccount(keyVal).then(result => {
            
        })
    }
}