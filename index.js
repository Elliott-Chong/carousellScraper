const puppeteer = require("puppeteer");
// const card_ids = require("./data.js");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { spawn } = require("child_process");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");

const launchBrowser = async () => {
  const file_data = fs.readFileSync("data.json", "utf8");
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  await db.exec(
    "CREATE TABLE IF NOT EXISTS listings (id INTEGER PRIMARY KEY, seller_name TEXT, listing_id TEXT, listing_name TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
  const listings = JSON.parse(file_data);
  const browser = await puppeteer.launch({
    headless: false,
  });
  let page = await browser.newPage();
  await page.goto("https://www.carousell.sg/login/");
  await page.click("button:nth-child(3)");
  await page.type("input:nth-child(2)", "chongz.22@ichat.sp.edu.sg");
  await page.type('input[type="password"]', "elle1412");

  await page.click("button[type='submit']");
  page.setDefaultNavigationTimeout(0);
  await page.waitForNavigation();

  for (let card of listings) {
    const { id, seller_name, listing_name } = card;
    const does_exist = await db.get(
      "SELECT * FROM listings WHERE listing_id = ?",
      [id]
    );
    if (does_exist) {
      console.log("Already sent message to this listing");
      continue;
    } else {
      await db.run(
        "INSERT INTO listings (seller_name, listing_id, listing_name) VALUES (?, ?, ?)",
        [seller_name, id, listing_name]
      );
    }
    await page.goto(`https://www.carousell.sg/inbox/new/${id}/`);
    await page.type(
      "textarea",
      "Hi, I am interested in your tuition services."
    );
    await page.keyboard.press("Enter");
    await sleep(300);
  }
};

async function main() {
  const python = spawn("python", ["main.py"]);
  python.stdout.on("data", function (data) {
    console.log(data.toString());
    launchBrowser();
  });
}
main();
