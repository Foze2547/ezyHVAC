Aircal
โปรเจกต์นี้เป็นระบบคำนวณประสิทธิภาพและการใช้พลังงานของเครื่องปรับอากาศ (SEER Calculator) สำหรับเครื่องปรับอากาศแบบ Fixed Capacity และ Variable Capacity โดยรองรับข้อมูลจากหลายจังหวัดและช่วงเวลาใช้งาน

คุณสมบัติ (Features)
คำนวณค่า SEER (Seasonal Energy Efficiency Ratio)
คำนวณการใช้พลังงาน (kWh) และค่าไฟฟ้าต่อปี
รองรับการคำนวณแยกตามโหลดการทำงาน (Full load, Half load, Quarter load)
รองรับข้อมูลจากหลายจังหวัด
โครงสร้างโค้ดแบบ modular ด้วย TypeScript
เหมาะสำหรับนำไปต่อยอดทำเว็บหรือระบบ Dashboard

การติดตั้ง (Installation)
พารามิเตอร์ (Parameters) fullPowerFixed : กำลังไฟฟ้าที่ใช้เต็มโหลด (Fixed Capacity) (วัตต์)
fullPowerVariable : กำลังไฟฟ้าที่ใช้เต็มโหลด (Variable Capacity) (วัตต์)
halfPowerVariable : กำลังไฟฟ้าที่ใช้ครึ่งโหลด (Variable Capacity) (วัตต์)
powerQuarterLoad : กำลังไฟฟ้าที่ใช้ 1/4 โหลด (Variable Capacity) (วัตต์)
designCoolingLoad : โหลดความเย็นออกแบบ (วัตต์)
workingDaysPerYear : จำนวนวันทำงานต่อปี
electricityRate : อัตราค่าไฟฟ้า (บาทต่อ kWh)
workingTimeRange : ช่วงเวลาทำงานต่อวัน เช่น "6.00-18.00"
และอื่น ๆ

วิธีการคำนวณ (Calculation Logic) 1 คำนวณจำนวนชั่วโมงทำงานต่อวันจากช่วงเวลา
2 คำนวณชั่วโมงทำงานทั้งหมดในปี
3 คำนวณโหลดความเย็นรวม (LCST)
4 คำนวณการใช้พลังงานทั้งแบบ Fixed และ Variable
5 คำนวณค่าใช้จ่ายไฟฟ้าต่อปี
6 คำนวณเปอร์เซ็นต์การประหยัดพลังงานและค่าใช้จ่าย

ตัวอย่างผลลัพธ์ (Sample Output)
{ "workingDayPerYear": 250, "electricityRate": 4, "outdoorTemp": 35, "coilInletDryBulb": 27, "coilInletWetBulb": 19.4, "fullCapacity": 13443.83, "halfCapacity": 6856.89, "fullPowerFixed": 940, "fullPowerVariable": 910, "halfPowerVariable": 427, "designCoolingLoad": 13443.83, "fixed": { "fcsp": 15.1100645686158, "ccse": 2766.62444207058, "energyConsumptionByDay": 1894.94824799355, "cost": 7579.7929919742 }, "variable": { "fcsp": 18.577869334247, "ccse": 2388.33876258247, "energyConsumptionByDay": 1635.84846752224, "cost": 6543.39387008894 }, "lcst": 40639596.3361224, "savings": { "energyPercent": 0.136731850458534, "cost": 1036.39912188526 } }

การพัฒนาและทดสอบ (Development & Testing)
ใช้ TypeScript สำหรับการพัฒนา แนะนำให้ใช้ npm run build สำหรับการคอมไพล์ ถ้ามี unit test ให้รันด้วย npm test

ผู้พัฒนา (Author)
BuniDev-coding ติดต่อ: Phonlawat.chu@gmail.com
SEERCal
SEERCalculate
SEERCALCULATOR