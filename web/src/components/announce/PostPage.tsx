import * as React from 'react';
import { Segment, Button, Form, TextArea } from 'semantic-ui-react';
import  TextareaAutosize  from 'react-textarea-autosize';
import { Announcement, postAnnouncement } from './client';
import { auth, Account, fetchAccount } from '../login';

interface PostProps {

}
interface PostState {
    title : string;
    body? : string;
    attachments? : string[]; //directory
    account? : Account;
}

export class PostForm extends React.Component<PostProps, PostState> {
    constructor(props: PostProps) {
        super(props);
        this.state = {
            title : '',
            body : '',
            attachments : [],
            account: null
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.PostContents = this.PostContents.bind(this);
    }
    public render = () =>
    <div>
        <h1>공지사항 - 글쓰기</h1>
        <Segment basic textAlign = 'center'>
            <Form onSubmit = {this.PostContents}>
                <TextArea
                    rows = {1} placeholder = '제목'
                    value = {this.state.title} onChange = {this.handleNameChange}
                />
                <Form.Field>
                    <TextareaAutosize
                        placeholder = '내용을 입력하세요'
                        value = {this.state.body}
                        onChange = {this.handleBodyChange}
                    />
                </Form.Field>
            <Button primary type = 'submit'>확인</Button>
            </Form>
        </Segment>
    </div>

    private handleNameChange(event: React.FormEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        this.setState({title: event.currentTarget.value});
    }
    private handleBodyChange(event: React.FormEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        this.setState({body: event.currentTarget.value});
    }
    public PostContents(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const payload = {
            title: this.state.title,
            writer: {
                name: this.state.account.name,
                id: auth.currentUser.uid,
            },
            body: this.state.body,
        } as Announcement;
        postAnnouncement(payload).then(()=> {
            this.setState({
                title: '',
                body: ''
            });
        }).catch(err => {
            console.log("post failed!");
            console.log(err);
        })
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                this.fetchAccount(user.uid);
            }
        })
    }
    fetchAccount(key: string) {
        fetchAccount(key).then(result => {
            this.setState({account: result.data.account});
        }).catch(err => {
            console.log(err);
        })
    }
}