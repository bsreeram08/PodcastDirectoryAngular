const puppeteer = require('puppeteer');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://podcast-directory-15d07.firebaseio.com"
});
const dayInMilliseconds = 1000 * 60 * 60 * 24;
const db = admin.firestore();
async function scrapeMetatags(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let episodeLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a.title')).map((item) => ({
            url: item.getAttribute('href'),
            text: item.innerText
        }));
    });
    let dateTime = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("span.datetime")).map((item) => ({
            date: item.innerText
        }));
    });
    browser.close();
    return ({ episodeLinks, dateTime });
}
async function main() {
    let linkDate, links, date, iter;
    let allLinks = [];
    const collectionRef = db.collection("PodcastLinks");
    for (iter = 1; iter <= 46; iter++) {
        linkDate = await scrapeMetatags("https://www.podbean.com/podcast-detail/d4un8-57595/ajax/yw0/JavaScript-Jabber-Podcast//page/" + iter);
        links = linkDate.episodeLinks;
        date = linkDate.dateTime;
        links = links.map((item, index) => {
            item["date"] = date[index].date;
            return item;
        });
        allLinks = allLinks.concat(links);
        console.log("iter:" + iter);
    }
    //const dbSnapshotData = await db.collection("PodcastLinks").doc("Links").get();
    //const dbData = dbSnapshotData.data().allLinks;
    //console.log(dbData);

    collectionRef.doc("Links").set({ allLinks }).then(() => {
        console.log(`Page : ${iter} links added successfully.`);
    }).catch((err) => {
        console.error(`${err} on Page : ${iter}`);
    });

}
setInterval(() => main(), dayInMilliseconds);