import { chromium, Browser } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';

import 'dotenv/config';

// 获取文件名称
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('测试启动', async () => {

  let browser: Browser
  let agent1: PlaywrightAgent
  let agent2: PlaywrightAgent

  beforeAll(async () => {
    browser =await chromium.launch({
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

    agent1 = new PlaywrightAgent(page, {
      groupName: 'index2-agent1',
      generateReport: false
    });
    agent2 = new PlaywrightAgent(page, {
      groupName: 'index2-agent2',
      generateReport: false
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

 


  it('测试 1', async () => {
    await agent1.aiTap('点击同意网易会议的隐私政策的复选框');
    await agent2.aiTap('点击前往体验版');
  })

});
