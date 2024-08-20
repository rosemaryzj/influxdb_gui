import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, Space, Tooltip, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.scss'; // 确保样式被正确引入
import NewConnectionFormWidget from '../../widgets/connection/NewFormWidget';
import Database from 'tauri-plugin-sql-api';
import { DeleteOutlined1, EditOutlined1, EnterOutlined1, TestOutlined } from '../../tools/icon/custom';
import { useNavigate } from 'react-router-dom';
import { invoke } from "@tauri-apps/api/tauri";

const { Title } = Typography;


const initialConnections = [];

const HomePage = () => {
    const nav = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentConnection, setCurrentConnection] = useState(null);
    const [connections, setConnections] = useState(initialConnections);

    const getConnections = async () => {
        const db = await Database.load("sqlite:evil.db");
        const result = await db.select("select name, addr, username, password,database, id AS key FROM connection_info");
        setConnections(result);
    }

    useEffect(() => {
        async function fetchConnection() {
            await getConnections();
        }
        fetchConnection();
    }, [])

    const test_connection = async (record) => {
        const res = await invoke("test_connection", {
            "config": {
                "addr": record.addr,
                "username": record.username,
                "password": record.password,
                "database": record.database,
            }
        });
        openNotification(res.code, res.message);
    }

    const onCancel = () => {
        setCurrentConnection(null);
        setIsModalVisible(false);
    }

    const onSubmit = async () => {
        await getConnections();
        setCurrentConnection(null);
        setIsModalVisible(false);
    }

    const showModal = (connection = null) => {
        if (connection !== null) {
            setCurrentConnection(connection);
        } else {
            setCurrentConnection(null);
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (key) => {
        const db = await Database.load("sqlite:evil.db");
        await db.execute("DELETE FROM connection_info WHERE id = ?", [key]);
        await getConnections();
    };


    const openNotification = (code, message) => {
        if (code === 0) {
            api.success({
                message: message,
                placement: "topRight",
                duration: 1,
            })
        } else {
            api.error({
                message: message,
                placement: "topRight",
                duration: 1,
            })
        }
    }

    const pushQuery = (record) => {
        nav("/query", { replace: true, state: { config: record } });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Addr',
            dataIndex: 'addr',
            key: 'addr',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: 'Database',
            dataIndex: 'database',
            key: 'database',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined1 />} onClick={() => showModal(record)}
                        style={{
                            color: 'orange',
                        }} />
                    <Button icon={<DeleteOutlined1 />} onClick={() => handleDelete(record.key)}
                        style={{
                            color: 'red',
                        }}
                    />
                    <Tooltip title="test connection" color="geekblue" key="geekblue" placement="topRight">
                        <Button icon={<TestOutlined />} style={{
                            color: 'green',
                        }} onClick={() => test_connection(record)} />
                    </Tooltip>
                    <Button icon={<EnterOutlined1 />} onClick={() => pushQuery(record)}
                        style={{
                            color: 'red',
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="home-container">
            {contextHolder}
            <div className="header">
                <Title className="page-title">InfluxDB Manager</Title>
                <Button
                    type="error"
                    icon={<PlusOutlined />}
                    onClick={() => showModal(null)}
                    className="new-connection-button"
                >
                    NewConnection
                </Button>
            </div>
            <Table
                bordered
                columns={columns}
                dataSource={connections}
                pagination={false}
                className="connections-table"
            />
            <NewConnectionFormWidget
                visible={isModalVisible}
                initialValues={currentConnection}
                onCancel={onCancel}
                onSubmit={onSubmit}>
            </NewConnectionFormWidget>
        </div>
    );
};

export default HomePage;
