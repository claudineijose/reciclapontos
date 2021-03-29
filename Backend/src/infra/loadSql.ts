import { query } from 'express';
import fs from 'fs-extra'
import join from 'path'

const loadSqlQueries = async (folderName: string, queryName: string) => {
    const filepath = join.join(process.cwd(), "src", "data", folderName);
    const files = fs.readFileSync(join.join(filepath, `${queryName}.sql`), { encoding: 'utf-8' });

    if (files) {
        return files;
    }
    else {
        throw new Error(`O arquivo ${queryName}.sql não foi encontrado`);
    }
}

export default loadSqlQueries;
