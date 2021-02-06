import * as React from 'react';
import { Button, Form, Dropdown, DropdownProps, InputOnChangeData } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { Account, fetchAccount, postAccount } from './client';


const INPUT_FIELD_EMAIL  = "input_email";
const INPUT_FIELD_NAME   = "input_name";
const INPUT_FIELD_PASSWD = "input_passwd";
const INPUT_FIELD_PHONE  = "input_phone";

const DROPDOWN_COURSE_VALUE_SMALL = 1;
const DROPDOWN_COURSE_VALUE_MIDDLE = 2;


interface accountProps {

}

interface accountState {
    user;
    email: string;
    password: string;
    account: Account;

    [INPUT_FIELD_EMAIL]  : string;
    [INPUT_FIELD_NAME]   : string;
    [INPUT_FIELD_PASSWD] : string;
    [INPUT_FIELD_PHONE ] : string;

    selectedDropdownCourseValue: number;
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
            },

            [INPUT_FIELD_EMAIL]  : "",
            [INPUT_FIELD_NAME]   : "",
            [INPUT_FIELD_PASSWD] : "",
            [INPUT_FIELD_PHONE]  : "",

            selectedDropdownCourseValue: 0,
        }

        this.CreateAccount = this.CreateAccount.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.onDropdownCourseChanges = this.onDropdownCourseChanges.bind(this);
        this.onInputChanges = this.onInputChanges.bind(this);
    }

    public render = () => {
        return(
            <div>
                <h1>계정 정보 입력</h1>

                <Form>
                    <Form.Field>
                        <label>이메일 주소</label>
                        <Form.Input
                            name={INPUT_FIELD_EMAIL}
                            placeholder='xxxx@email.com'
                            value={this.state[INPUT_FIELD_EMAIL]}
                            onChange={this.onInputChanges}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>비밀번호</label>
                        <Form.Input
                            name={INPUT_FIELD_PASSWD}
                            type="password"
                            placeholder='********'
                            value={this.state[INPUT_FIELD_PASSWD]}
                            onChange={this.onInputChanges}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>이름</label>
                        <Form.Input
                            name={INPUT_FIELD_NAME}
                            placeholder='홍길동'
                            value={this.state[INPUT_FIELD_NAME]}
                            onChange={this.onInputChanges}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>전화번호</label>
                        <Form.Input
                            name={INPUT_FIELD_PHONE}
                            placeholder='010XXXXXXXX'
                            value={this.state[INPUT_FIELD_PHONE]}
                            onChange={this.onInputChanges}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>과정</label>
                        <Dropdown
                            placeholder="과정을 선택하세요"
                            fluid
                            selection
                            options={[
                                {
                                    key: "dropdown_item_course_small",
                                    text: "소형",
                                    value: DROPDOWN_COURSE_VALUE_SMALL,
                                },
                                {
                                    key: "dropdown_item_course_middle",
                                    text: "중형",
                                    value: DROPDOWN_COURSE_VALUE_MIDDLE,
                                },
                            ]}
                            onChange={this.onDropdownCourseChanges}
                        />
                    </Form.Field>

                    <this.cancelButton />
                    <this.CreateAccount />
                </Form>
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
            // Get user input values
            // -----------------------------------------------------------------------

            const _name: string = this.state[INPUT_FIELD_NAME];
            const _phoneNum: string = this.state[INPUT_FIELD_PHONE];

            let _curriculum: string = "";
            switch (this.state.selectedDropdownCourseValue) {
                case DROPDOWN_COURSE_VALUE_SMALL:
                    _curriculum = "소형";
                    break;
                case DROPDOWN_COURSE_VALUE_MIDDLE:
                    _curriculum = "중형";
                    break;
                case 0:
                    alert("과정을 선택해 주세요!");
                    return;
                default:
                    alert(`Unkown value for curriculum: ${this.state.selectedDropdownCourseValue}`);
                    return;
            }

            // Request
            // -----------------------------------------------------------------------

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
                    const _email: string = this.state[INPUT_FIELD_EMAIL];
                    const _password: string = this.state[INPUT_FIELD_PASSWD];

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

    private onDropdownCourseChanges(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
        this.setState({ selectedDropdownCourseValue: Number(data.value) });
    }

    private onInputChanges(event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) {
        const a = this.state;
        a[data.name] = data.value;
        this.setState(a);
    }

}
