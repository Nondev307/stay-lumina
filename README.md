# Hotel View

ผมอยากได้ระบบ Webapp ที่ใช้สำหรับจองห้องพักในโรงแรม โดยรายละเอียดโรงแรมมี 7 ชั้น

- ชั้น 1-2 เป็น Standard Room ชั้นละ 8 ห้อง รวม 16 ห้อง ราคา 800  บาท/คืน

- ชั้น 3-4 เป็น Superior Room ชั้นละ 8 ห้อง รวม 16 ห้อง ราคา 1,400 บาท/คืน

- ชั้น 5-6 เป็น Deluxe Room ชั้นละ 6 ห้อง รวม 12 ห้อง ราคา 2,200 บาท/คืน

- ชั้น 7 เป็น Premium Room จำนวน 6 ห้อง ราคา 3,300 บาท/คืน


ต้องการ Interface แบบ Visual Dashboard
ให้แสดงห้องพักเป็นกล่อง (Card/Grid) คล้ายแผนผังห้องพักของโรงแรม
โดยแต่ละห้องต้องมีสถานะดังนี้
- สีเขียว = ว่าง (Available)
- สีแดง = ไม่ว่าง(Occupied)- สีเหลือง = จองแล้ว (Reserved) (ถ้ามี)

เมื่อผู้ใช้กดที่ห้อง

- ถ้าห้องเป็น "ว่าง" ให้เปลี่ยนเป็น "ไม่ว่าง"

- ถ้าห้องเป็น "ไม่ว่าง" ให้เปลี่ยนเป็น "ว่าง"

- อัปเดตจำนวนห้องว่างแบบ Real-time

Dashboard Summary

แสดงข้อมูลด้านบนของหน้า

- จำนวนห้องทั้งหมด

- จำนวนห้องว่าง

- จำนวนห้องไม่ว่าง

- เปอร์เซ็นต์การเข้าพัก

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://stay-lumina.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c2d30a5e-95fa-4167-8860-7d03e5505762).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
