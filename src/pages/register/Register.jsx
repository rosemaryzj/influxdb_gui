import React from 'react';
import {Form, Input, Button, Typography, message, notification} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Database from "tauri-plugin-sql-api";

const { Title } = Typography;

const RegisterPage = () => {
    const [form] = Form.useForm();
    const nav = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const onFinish = async (values) => {
        console.log('Received values:', values);
        if(values.username ==="" || values.password===""){
            api.error({
                message: "用户名/密码不能为空",
                placement: "topRight",
                duration: 1,
            })
        }
        if(values.password!==values.confirm){
            api.error({
                message: "密码不匹配",
                placement: "topRight",
                duration: 1,
            });
            return
        }
        const db = await Database.load("sqlite:evil.db");
        await db.execute("INSERT INTO user(username, password) VALUES($1,$2)",[values.username,values.password]);

        api.success({
            message: "注册成功",
            placement: "topRight",
            duration: 1,
        });
        nav("/", {replace: true});
    };

    const handleBack = () => {
        nav("/", { replace: true });
    };

    return (
        <div style={styles.container}>
            {contextHolder}
            <div style={styles.overlay}></div>
            <div style={styles.backButtonContainer}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    style={styles.backButton}
                    onClick={handleBack}
                >
                    登陆
                </Button>
            </div>
            <div style={styles.formContainer}>
                <Title level={3} style={styles.title}>用户注册</Title>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{ remember: true }}
                    style={styles.form}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={styles.icon} />}
                            placeholder="用户名"
                            style={styles.input}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={styles.icon} />}
                            placeholder="密码"
                            style={styles.input}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '请确认您的密码!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('密码不匹配!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={styles.icon} />}
                            placeholder="确认密码"
                            style={styles.input}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={styles.submitButton}
                            onMouseEnter={e => e.target.style.boxShadow = '0 0 20px 6px rgba(255, 87, 34, 0.75)'}
                            onMouseLeave={e => e.target.style.boxShadow = '0 0 10px rgba(255, 87, 34, 0.5)'}
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle, #000000 0%, #1a1a1a 60%, #333333 100%)', // 深邃黑洞效果
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)', // 更深的遮罩层
        zIndex: -1,
        boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)', // 内发光效果
    },
    backButtonContainer: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 2, // 确保返回按钮在表单之上
    },
    backButton: {
        borderRadius: '4px',
        backgroundColor: '#1e272e',
        borderColor: '#34495e',
        color: '#ecf0f1',
        transition: 'background-color 0.3s, border-color 0.3s',
    },
    formContainer: {
        background: '#0e1217', // 更深色背景
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.8)', // 强烈阴影
        maxWidth: '400px',
        width: '100%',
        zIndex: 1,
        position: 'relative',
    },
    title: {
        textAlign: 'center',
        color: '#ecf0f1', // 标题颜色
        marginBottom: '24px',
    },
    form: {
        maxWidth: '100%',
    },
    input: {
        borderRadius: '4px',
        marginBottom: '16px',
        backgroundColor: '#1e272e',
        color: '#ecf0f1',
        border: '1px solid #34495e',
        padding: '8px',
        transition: 'box-shadow 0.3s',
    },
    icon: {
        color: '#ecf0f1',
    },
    submitButton: {
        width: '100%',
        borderRadius: '4px',
        backgroundColor: '#e67e22', // 发光按钮颜色
        borderColor: '#e67e22',
        height: '40px',
        fontSize: '16px',
        color: '#fff',
        transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: '0 0 10px rgba(255, 87, 34, 0.5)', // 发光效果
    },
};

export default RegisterPage;
