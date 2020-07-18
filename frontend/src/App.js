import React, { useCallback, useEffect, useState } from 'react';
import { Input, Card, Table, Avatar } from 'antd';
import Column from 'antd/lib/table/Column';
import { getUsers, searchUsers } from './api/service.js';
import 'antd/dist/antd.css';
import './App.css';

const { Search } = Input;

const  App = () => {
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);

    const renderAvatar = useCallback(
        (src) => <Avatar src={src} />,
        []
    );

    const fetchUsers = useCallback(
        async () => {
            try {
                const {data} = await getUsers();
                setDataSource(data.users);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleSearch = useCallback(async (value) => {
        setLoading(true);
        try {
            const {data} = await searchUsers(value);
            setDataSource(data.users);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

  return (
    <div className="container">
        <Card className="search-user">
            <Search onSearch={handleSearch} enterButton />
        </Card>
        <Table
            dataSource={dataSource}
            rowKey="id"
            bordered
            loading={loading}
            pagination={false}
        >
            <Column dataIndex="first_name" title="Имя" />
            <Column dataIndex="last_name" title="Фамилия" />
            <Column dataIndex="email" title="Эл. почта" />
            <Column dataIndex="avatar" title="Аватар" render={renderAvatar} />
        </Table>
    </div>
  );
};

export default App;
