import React from 'react';
import {Form, Input, Button, Space, Typography, notification} from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.scss';
import Database from "tauri-plugin-sql-api"; // 确保引入了 SCSS 文件

const {Title} = Typography;

const LoginPage = () => {
    const nav = useNavigate();
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const handleLogin =async () => {
        const data = form.getFieldsValue();
        if(data.username === ""||data.password===""){
            api.error({
                message: "用户名/密码不能为空",
                placement: "topRight",
                duration: 1,
            });
            return
        }
        const db = await Database.load("sqlite:evil.db");
        const res = await db.select("SELECT username, password FROM user WHERE username = $1", [data.username]);
        if(res.length === 0 ){
            api.error({
                message: "登陆失败,用户名/密码不正确",
                placement: "topRight",
                duration: 1,
            });
            return
        }
        api.success({
            message: "登陆成功",
            placement: "topRight",
            duration: 1,
        });
        nav("/home", { replace: true });
    }

    const handleRegister = () => {
        nav("/register", { replace: true });
    }

    return (
        <div id="container">
            {contextHolder}
            <Form form={form} className="login-form" name="login">
                <Title level={5} style={{color: "#1a1a1a"}}>用户登陆</Title>
                <Form.Item name="username">
                    <Input prefix={<UserOutlined />} placeholder="用户" />
                </Form.Item>
                <Form.Item name="password">
                    <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleLogin}
                            className="login-button"
                        >
                            登陆
                        </Button>
                        <Button
                            type="default"
                            htmlType="button"
                            onClick={handleRegister}
                            className="login-button"
                        >
                            注册
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;
