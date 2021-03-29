import * as sql from 'mssql';

export default class SqlConn {
    private static pool: any;

    static closePool = async () => {
        try {
            await SqlConn.pool.close();
            SqlConn.pool = null;
        }
        catch (err: any) {
            console.log(err);
        }
    };

    static getConn = async () => {
        try {
            if (SqlConn.pool) {
                return SqlConn.pool;
            }
            let config: sql.config = {
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                server: process.env.SQL_SERVER || "localhost",
                database: process.env.SQL_DATABASE,
                port: parseInt(process.env.SQL_PORT || 1430),
                options: {
                    enableArithAbort: true,
                    encrypt: true
                }
            };
            SqlConn.pool = await new sql.ConnectionPool(config, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            await SqlConn.pool.connect();

            SqlConn.pool.on("error", async (err: any) => {
                console.log(err);
                SqlConn.closePool();
            });
            return SqlConn.pool;
        }
        catch (err: any) {
            console.log(err);
            SqlConn.pool = null;
        }
    };
}