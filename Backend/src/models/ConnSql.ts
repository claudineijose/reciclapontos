class ConnSql {
    static config = {
        user: 'sa',
        password: '8k3W2C2BVzAW9p',
        server: 'localhost',
        database: 'RECICLAPONTOS',
        port: 1420,
        enableArithAbort: true
    }

    static Connect(): any {
        const sql = require('mssql');
        try {
            return sql.connect(this.config);
        } catch (err) {
            //Gravação de Log
            console.log(err);
        }
    }    
}

export default ConnSql;