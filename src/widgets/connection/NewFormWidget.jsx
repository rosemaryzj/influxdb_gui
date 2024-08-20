import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Typography, Space } from 'antd';
import Database from 'tauri-plugin-sql-api';

const { Title } = Typography;

const NewConnectionFormWidget = ({ visible, onCancel, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    }


    const handleSubmit = async () => {
        let values = await form.validateFields();
        const db = await Database.load("sqlite:evil.db");
        if (!initialValues) {
            await db.execute("INSERT INTO connection_info(name,addr,username,password,database) VALUES($1,$2,$3,$4,$5)",
                [values.name, values.addr, values.username, values.password,values.database]
            );
        } else {
            await db.execute("UPDATE connection_info SET name = $1, username = $2, password = $3, addr = $4 WHERE id = $5",
                [values.name, values.username, values.password, values.addr, initialValues.key])
        }
        form.resetFields();
        onSubmit();
    }


    return (
        <Modal
            forceRender
            open={visible}
            title={<Title level={4}>{initialValues ? '编辑 InfluxDB 连接' : '新建 InfluxDB 连接'}</Title>}
            onCancel={onCancel}
            footer={null}
            closable={false}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={initialValues}
                style={{ maxWidth: '100%' }}
            >
                <Form.Item
                    name="name"
                    label="连接名"
                    rules={[{ required: true, message: '请输入连接名称!' }]}
                >
                    <Input placeholder="admin" />
                </Form.Item>
                <Form.Item
                    name="addr"
                    label="地址"
                    rules={[{ required: true, message: '请输入连接地址!' }]}
                >
                    <Input placeholder="http://10.64.48.7:8086" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input placeholder="admin" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input.Password placeholder="123" />
                </Form.Item>

                <Form.Item
                    name="database"
                    label="数据库"
                    rules={[{ required: true, message: '请输入数据库!' }]}
                >
                    <Input placeholder="netops" />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button onClick={handleCancel}>取消</Button>
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>保存</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewConnectionFormWidget;
