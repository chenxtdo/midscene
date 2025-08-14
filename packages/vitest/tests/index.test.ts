import { chromium, Browser } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';
import { add } from '../src/com';

import 'dotenv/config';


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('测试启动', async () => {

  let browser: Browser
  let agent: PlaywrightAgent

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

    agent = new PlaywrightAgent(page);
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

 


  it('测试 1', async () => {
    await agent.aiTap('点击同意网易会议的隐私政策的复选框');
  })


  it('测试 2', async () => {
    await agent.aiTap('点击前往体验版');
  })
});
