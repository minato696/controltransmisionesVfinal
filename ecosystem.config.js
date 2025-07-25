module.exports = {
  apps: [{
    name: "exitosa-control-t",
    script: "npm",
    args: "start",
    cwd: "/home/Java_Soft/control_transmisiones_exitosa",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "500M",
    env: {
      NODE_ENV: "production",
      PORT: 5885,
      HOST: "0.0.0.0"
    },
    error_file: "/home/Java_Soft/control_transmisiones_exitosa/logs/error.log",
    out_file: "/home/Java_Soft/control_transmisiones_exitosa/logs/out.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z"
  }]
};