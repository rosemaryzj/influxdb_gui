import React, { useEffect, useState } from 'react';
import { Input, Button, Card, Typography, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';

const { Title, Text } = Typography;

const QueryPage = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [measurements, setMeasurements] = useState([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState('');
    const [query, setQuery] = useState('');
    const [columnNames, setColumnNames] = useState([]);
    const [columnValues, setColumnValues] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        let app = async () => {
            await showMeasurements();
        };
        app();
    }, []);


    const handleSelectMeasurement = (measurement)=>{
        setSelectedMeasurement(measurement);
        setQuery("SELECT * FROM " + measurement + " LIMIT 5;");
    }
    const showMeasurements = async () => {
        let config = location.state.config;
        let res = await invoke('get_measurements', {
            config: config,
        });
        if (res.code === 0) {
            setMeasurements(res.data);
        } else {
            openNotification(res.code, res.message);
        }
    };

    const executeQuery = async () => {
        if (query === '') {
            openNotification(1, 'Query condition is empty');
            return;
        }
        let config = location.state.config;

        try {
            let res = await invoke('execute_cmd', {
                command: query,
                config: config,
            });
            if (res.code === 0) {
                setColumnNames(res.column_names);
                setColumnValues(res.column_values);
            } else {
                setColumnNames([]);
                setColumnValues([]);
                openNotification(res.code, res.message);
            }
        } catch (err) {
            setColumnNames([]);
            setColumnValues([]);
            openNotification(1, 'An error occurred');
        }
    };

    const openNotification = (code, message) => {
        if (code === 0) {
            api.success({
                message: message,
                placement: 'topRight',
                duration: 1,
            });
        } else {
            api.error({
                message: message,
                placement: 'topRight',
                duration: 1,
            });
        }
    };

    const handleBack = () => {
        nav('/home', { replace: true });
    };

    const renderTableHeader = () => {
        if (columnNames.length > 0) {
            return (
                <div className="table-header">
                    {columnNames.map((item, key) => (
                        <div key={key} className="header-cell">
                            <strong>{item}</strong>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderTableRows = () => {
        return columnValues.map((result, index) => (
            <div key={index} className="table-row">
                {result.map((value, idx) => (
                    <div key={idx} className="row-cell">
                        {value}
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className="query-page">
            {contextHolder}
            <div className="content">
                <div className="measurements">
                    <Button
                        type="default"
                        onClick={handleBack}
                        className="back-button"
                    >
                        Back
                    </Button>
                    <Title level={4} style={{ color: 'white' }}>Measurements</Title>
                    <div className="measurements-list">
                        {measurements.map((measurement, index) => (
                            <Button
                                key={index}
                                type={measurement === selectedMeasurement ? 'primary' : 'default'}
                                onClick={() => handleSelectMeasurement(measurement)}
                                className="measurement-button"
                            >
                                {measurement}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="query-section">
                    <Card bordered={false} className="query-card">
                        <Title level={4}>SQL Query</Title>
                        <Input.TextArea
                            rows={4}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your SQL query here, Only Select is supported"
                            className="query-input"
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={executeQuery}
                            className="query-button"
                            disabled={!selectedMeasurement}
                        >
                            Execute Query
                        </Button>
                    </Card>
                    <Card bordered={false} className="results-card">
                        <Title level={4}>Query Results</Title>
                        {columnNames.length > 0 ? (
                            <div className="results-table-wrapper">
                                <div className="results-table">
                                    {renderTableHeader()}
                                    {renderTableRows()}
                                </div>
                            </div>
                        ) : (
                            <Text type="secondary">No results to display.</Text>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QueryPage;
