const axios = require('axios')

const fs = require("fs");
const TelegramBot = require('node-telegram-bot-api');
const token = '5468715488:AAGVuv2nEAVe6cXF02V2qfC5YqRPFQyZIpY';

const bot = new TelegramBot(token, { polling: false });
const MY_TIM_NHA_ID = '-711901782'


let listQuan = [
    { ten: 'Gò Vấp', prefix: 'thue-nha-dat-quan-go-vap-tp-ho-chi-minh' },
    { ten: 'Quận 10', prefix: 'thue-nha-dat-quan-10-tp-ho-chi-minh' },
    { ten: 'Quận 11', prefix: 'thue-nha-dat-quan-11-tp-ho-chi-minh' },
    { ten: 'Bình Thạnh', prefix: 'thue-nha-dat-quan-binh-thanh-tp-ho-chi-minh' },
    { ten: 'Tân Phú', prefix: 'thue-nha-dat-quan-tan-phu-tp-ho-chi-minh' },
    { ten: 'Tân Bình', prefix: 'thue-nha-dat-quan-tan-binh-tp-ho-chi-minh' },
    { ten: 'Phú Nhuận', prefix: 'thue-nha-dat-quan-phu-nhuan-tp-ho-chi-minh' },
]

let axiosGet = async (rootUrl) => {
    console.log(rootUrl)
    let res = await axios.get(rootUrl)
    try {
        let oldLink = fs.readFileSync('data.txt', 'utf-8')
        const listNha = res.data.split('<div role="button" tabindex="0">')
        listNha.shift();
        listNha.pop()
        let msg = ''
        listNha.forEach(element => {
            let href = element.split('a href="')[1].split('" class="AdItem_adItem__2O28x')[0]
            if (href.slice(-3) !== 'htm') return false
            let sotien = element.split('AdBody_adPriceNormal__2_jeN">')[1].split('triệu/tháng</p>')[0]
            let soPN = element.split('<span class="AdBody_adItemCondition')[1].split('PN</span>')[0].split('-').slice(-1)[0]
            if (parseInt(soPN) > 2) {
                if (oldLink.includes(href)) return
                msg = `${msg}\nhttps://nha.chotot.com${href}`
            }
        });
        if(msg) {
            bot.sendMessage(MY_TIM_NHA_ID, `${msg}
            ======================================
            `);
            fs.writeFileSync('data.txt', oldLink + '\n' + msg, 'utf-8')
        }
        
    } catch (error) {
        console.log(error)
    }

}

const getAsyncList = async () => {
    console.log('Chay lenh ', new Date())
   await axiosGet(`https://nha.chotot.com/${listQuan[0].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
   await axiosGet(`https://nha.chotot.com/${listQuan[1].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
   await axiosGet(`https://nha.chotot.com/${listQuan[2].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
   await axiosGet(`https://nha.chotot.com/${listQuan[3].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
   await axiosGet(`https://nha.chotot.com/${listQuan[4].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
   await axiosGet(`https://nha.chotot.com/${listQuan[5].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
   await axiosGet(`https://nha.chotot.com/${listQuan[6].prefix}?price=0-9000000&rooms=3,4,5&page=1`)
}



var cron = require('node-cron');

cron.schedule('*/15 * * * *', () => {
    getAsyncList()
});