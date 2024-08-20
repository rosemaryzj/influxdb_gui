use influxdb::{Client, ReadQuery};
use serde::{Deserialize, Serialize};
use tauri_plugin_sql::{Migration, MigrationKind};

pub fn make_migrations() -> Vec<Migration> {
    let migrations = vec![
        Migration {
            version: 5,
            description: "连接信息表",
            sql: "CREATE TABLE connection_info(id INTEGER PRIMARY KEY, name TEXT, addr TEXT, username TEXT, password TEXT, database TEXT);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "用户表",
            sql: "CREATE TABLE user(id INTEGER PRIMARY KEY, username TEXT, password TEXT);",
            kind: MigrationKind::Up,
        },
    ];
    migrations
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct ApiRes {
    pub code: i32,
    pub message: String,
    pub total: Option<i64>,
    pub data: Option<Vec<serde_json::Value>>,
}

impl ApiRes {
    pub fn new(
        code: i32,
        message: String,
        data: Option<Vec<serde_json::Value>>,
        total: Option<i64>,
    ) -> ApiRes {
        ApiRes {
            code,
            message,
            data,
            total,
        }
    }
}

#[derive(Deserialize, Debug, Clone, Serialize, Default)]
pub struct InfConfig {
    #[serde(rename = "addr")]
    pub addr: String,
    #[serde(rename = "username")]
    pub username: String,
    #[serde(rename = "password")]
    pub password: String,
    #[serde(rename = "database")]
    pub database: String,
}


#[derive(Debug, Deserialize, Clone, Default)]
pub struct QueryResult {
    pub results: Vec<Statement>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Series {
    pub name: String,
    pub columns: Vec<String>,
    pub values: Vec<Vec<serde_json::Value>>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Statement {
    pub statement_id: u32,
    pub series: Vec<Series>,
}


#[derive(Serialize, Debug, Deserialize, Clone, Default)]
pub struct InfluxRes {
    pub code: i32,
    pub message: String,
    pub column_names: Option<Vec<String>>,
    pub column_values: Option<Vec<Vec<serde_json::Value>>>,
}

impl InfluxRes {
    pub fn new(code: i32, message: String, column_names: Option<Vec<String>>, column_values: Option<Vec<Vec<serde_json::Value>>>) -> Self {
        InfluxRes {
            code,
            message,
            column_names,
            column_values,
        }
    }
}

pub async fn exec_query(config: InfConfig, cmd: String) -> Result<String, influxdb::Error> {
    let client =
        Client::new(config.addr, config.database).with_auth(config.username, config.password);
    let query = ReadQuery::new(&cmd);
    client.query(query).await
}