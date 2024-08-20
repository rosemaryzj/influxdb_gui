// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use influxdb::Client;
use influxgui::{make_migrations, ApiRes, InfConfig, InfluxRes, QueryResult, exec_query};

#[tauri::command]
async fn test_connection(config: InfConfig) -> ApiRes {
    let client =
        Client::new(config.addr, config.database).with_auth(config.username, config.password);
    if let Ok(_) = client.ping().await {
        return ApiRes::new(0, "连接成功".to_string(), None, None);
    }
    ApiRes::new(1, "连接失败".to_string(), None, None)
}

#[tauri::command]
async fn get_measurements(config: InfConfig) -> ApiRes {
    let cmd = String::from("show measurements");
    let mut column_values: Vec<serde_json::Value> = Vec::new();
    if let Ok(res) = exec_query(config,cmd).await {
        let query_res = serde_json::from_str::<QueryResult>(&res).unwrap();
        for state in query_res.results {
            for series in state.series {
                for row in series.values {
                    let v = row.get(0).unwrap();
                    column_values.push(v.clone());
                }
            }
        }
        return ApiRes::new(
            0,
            "获取measurement成功".to_string(),
            Some(column_values),
            None,
        );
    }
    ApiRes::new(1, "获取measurement失败".to_string(), None, None)
}

#[tauri::command]
async fn execute_cmd(command:String,config: InfConfig) -> InfluxRes {
    let mut column_names: Vec<String> = Vec::new();
    let mut column_values: Vec<Vec<serde_json::Value>> = Vec::new();
    match exec_query(config,command).await {
        Ok(res) => {
            let res = serde_json::from_str::<QueryResult>(&res).unwrap();
            for st in res.results {
                for se in st.series {
                    if column_names.is_empty() {
                        column_names = se.columns;
                    }

                    for row in se.values {
                        column_values.push(row);
                    }
                }
            }
            return InfluxRes::new(
                0,
                "数据获取成功".to_string(),
                Some(column_names),
                Some(column_values),
            );
        }
        Err(err) => {
            InfluxRes::new(1, err.to_string(), None, None)
        }
    }
}

fn main() {
    let migrations = make_migrations();
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:evil.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            test_connection,
            get_measurements,
            execute_cmd,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
