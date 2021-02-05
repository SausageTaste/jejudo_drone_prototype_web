import * as React from 'react';
import { Container, Button } from 'semantic-ui-react';
import { auth } from './firebaseConfig'

interface accountProps {
    
}
interface accountState {
    user;
}

export class AccountPage extends React.Component<accountProps, accountState> {
    constructor(props: accountProps) {
        super(props);

        this.state = {
            user: null
        }
    }

    public render = () => {
        console.log(auth.currentUser);
        return(
            <div>
                <h1>계정 정보 입력</h1>
                <Container>
                    {this.state.user ? 
                        <div>
                            <h3>이메일: {this.state.user ?  auth.currentUser.email : null }</h3>
                        </div> :
                        <div>
                            <span>이메일</span><input key = 'email'></input> <br/>
                            <span>비밀번호</span><input key = 'password'></input>
                        </div>
                    }
                    <div>
                        <span>이름</span><input key = 'name'></input> <br/>
                        <span>전화번호</span><input key = 'phone'></input> <br/>
                        <span>과정</span><select key = 'curricul'>
                            <option value = 'default'>--과정을 선택하세요--</option>
                            <option value = ''>중형</option>
                            <option value = ''>소형</option>
                        </select>
                    </div>
                </Container>
                <Button>취소</Button>
                <Button onClick = {this.CreateAccount}>확인</Button>
            </div>
        )
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.setState({user: user});
        });
    }
    
    private CreateAccount = () => {
        auth.onAuthStateChanged(user => {
            if(user) {

            } else {
                
            }
        })
        
        let accountData = {
            id: auth.currentUser.uid,
            name: "default"
        }

    }
}