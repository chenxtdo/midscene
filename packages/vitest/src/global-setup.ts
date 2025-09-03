import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __DEV_REPORT_PATH__ = path.resolve(__dirname, '../../../apps/report/dist/index.html')

const midscene_run_dump_path = path.join(__dirname, '../midscene_run/dump');
const midscene_run_report_path = path.join(__dirname, '../midscene_run/report');


function getReportTpl() {
    if (typeof __DEV_REPORT_PATH__ === 'string' && __DEV_REPORT_PATH__) {
      return fs.readFileSync(__DEV_REPORT_PATH__, 'utf-8');
    }
    const reportTpl = 'REPLACE_ME_WITH_REPORT_HTML';
  
    return reportTpl;
}

// Global setup function - runs once before all tests
export async function setup() {
  console.log('🚀 Global setup started');

  if (fs.existsSync(midscene_run_dump_path)) {
    fs.rmSync(midscene_run_dump_path, { recursive: true });
  }

}

// Global teardown function - runs once after all tests
export async function teardown() {
  console.log('🧹 Global teardown started');
  if (!fs.existsSync(midscene_run_report_path)) {
    fs.mkdirSync(midscene_run_report_path, { recursive: true });
  }
  if (fs.existsSync(midscene_run_dump_path)) {
    const jsonFiles = fs.readdirSync(midscene_run_dump_path).filter((file) => file.endsWith('.json'));
    let tpl = getReportTpl();
        jsonFiles.map((file) => {
            const filePath = path.join(midscene_run_dump_path, file);
            const dumpData = fs.readFileSync(filePath, 'utf-8');
            const dumpContent =
          // biome-ignore lint/style/useTemplate: <explanation>
          '<script type="midscene_web_dump" type="application/json">\n' +
          dumpData +
          '\n</script>';
          tpl = tpl + dumpContent;
          });
        const reportFileName = Date.now() + '.html';
        // create the report directory if it doesn't exist
        if (!fs.existsSync(path.join(__dirname, '../midscene_run/report/'))) {
            fs.mkdirSync(path.join(__dirname, '../midscene_run/report/'), { recursive: true });
        }

        fs.writeFileSync(path.join(__dirname, '../midscene_run/report/', reportFileName), tpl);
    }
}

