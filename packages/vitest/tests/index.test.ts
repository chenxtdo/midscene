import { chromium } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';

import 'dotenv/config';


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('测试启动',() => {
  it('should start browser1', async () => {
    const browser = await chromium.launch({
      headless: true, // 'true' means we can't see the browser window
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewportSize({
      width: 1280,
      height: 768,
    });
    await page.goto('https://yiyong-qa.netease.im/yiyong-static/statics/ne-meeting-test/auto/470/#/');
    await sleep(5000); // 👀 init Midscene agent

    const agent = new PlaywrightAgent(page);
    
    await agent.aiTap('点击同意网易会议的隐私政策的复选框1');



    await browser.close();
  })


});
