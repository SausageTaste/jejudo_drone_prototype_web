import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Button, Table, Label, Icon } from 'semantic-ui-react';
import { Announcement, fetchAnnounceList } from './client';

interface AnnounceProps {

};
interface AnnounceStats {
    announceList : Announcement[]

    listPageSize: number;
    listCurrentPage: number;
};

export class AnnounceList extends React.Component<AnnounceProps, AnnounceStats> {
    constructor(props: AnnounceProps) {
        super(props);
        this.state = {
            announceList: [],

            listPageSize: 3,
            listCurrentPage: 0,
        };
    }

    public render() {
        const tableRows: JSX.Element[] = [];
        const begin_index = this.state.listPageSize * this.state.listCurrentPage;
        const end_index = this.state.listPageSize * (this.state.listCurrentPage + 1);
        for (let i = begin_index; i < end_index; ++i) {
            const one_element = this.state.announceList[i];
            if (undefined === one_element) {
                continue;
            }

            tableRows.push(
                <Table.Row key={`announce_row_${one_element.id}`}>
                    <Table.Cell>
                        <Label
                            key = {one_element.id}
                            as = {NavLink}
                            to = {`/announcements/page/${one_element.id}`}
                        >
                            {one_element.title}
                        </Label>
                    </Table.Cell>
                    <Table.Cell>{one_element.writer.name}</Table.Cell>
                    <Table.Cell>{one_element.date}</Table.Cell>
                </Table.Row>
            )
        }

        const paginatorBtnList: JSX.Element[] = [];
        const totalPagesCount = Math.ceil(this.state.announceList.length / this.state.listPageSize);
        for (let i = 0; i < totalPagesCount; ++i) {
            paginatorBtnList.push(
                <Menu.Item
                    as='a'
                    name={`page_btn_${i}`}
                    active={this.state.listCurrentPage === i}
                    onClick={() => this.setCurrentListPage(i)}
                >{i + 1}</Menu.Item>
            );
        }

        return  (
            <div>
                <h1>공지 사항</h1>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>제목</Table.HeaderCell>
                            <Table.HeaderCell>글쓴이</Table.HeaderCell>
                            <Table.HeaderCell>날짜</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>{tableRows}</Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>
                            <Menu floated='right' pagination>
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron left' />
                                </Menu.Item>

                                {paginatorBtnList}

                                <Menu.Item as='a' icon>
                                    <Icon name='chevron right' />
                                </Menu.Item>
                            </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>

                <input id = "search"></input>
                <button id = "searchBtn">검색</button>
                <Button
                  key = "post"
                  as = {Link}
                  to = { '/announcements/post' }
                >글쓰기</Button>
            </div>
        )
    }

    public componentDidMount() {
        this.fetchList();
        this.state.announceList.forEach(element => {
            console.log("writer: ", element.writer);
        });
    }

    private fetchList = () => {
        fetchAnnounceList()
            .then(response => {
                this.setState({ announceList: response.data.announcements });
            })
            .catch(err => {
                console.log("fetch failed!");
                console.log(err);
            });
    }

    private setCurrentListPage(pageIndex: number) {
        this.setState({
            listCurrentPage: pageIndex,
        });
    }

}
