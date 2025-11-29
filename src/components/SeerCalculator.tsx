import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Thermometer, Zap, BarChart2 ,Activity , BadgeDollarSign,AlarmSmoke, LoaderPinwheel} from 'lucide-react';
import LanguageToggle from "../contexts/LanguageToggle"; 
import { useLanguage } from "../contexts/LanguageContext"; 
import Header from './Header';


import { provinceDataMap, getAllProvinces } from '../services/provinceData'; 

const SeerCalculator = () => {
  const { lang, toggleLang } = useLanguage();


  const text = {
    en: {
      seerCalculationTitle: "SEER Calculation (Thailand)",
      inputsSystemType: "Inputs System Type",
      compressorType: "Type",
      selectType: "Select Type",
      fixedType: "Fixed Type❄️​",
      variableType: "Variable Type☃️",
      initialInformation: "Initial Information",
      province: "Province",
      dailyOperationTime: "Daily Operation Time",
      workingDayPerYear: "Working Day Per Year",
      electricityRate: "Electricity Rate (kWh)",
      airConditionerSpecifications: "Air Conditioner Specifications",
      airConditionerTemperature: "Air conditioner temperature",
      outdoorTemperature: "Outdoor Temperature (°C)",
      indoorCoilInletDBT: "Coil Inlet Dry Bulb (°C)",
      indoorCoilInletWBT: "Coil Inlet Wet Bulb (°C)",
      powerAndLoadInformation: "Power and load information",
      fullCapacity: "Full Capacity (Btu/hr)",
      halfCapacity: "Half Capacity (Btu/hr)",
      powerInputFullLoadFixed: "Power at Full Load (W)",
      powerInputFullLoadVariable: "Power at Full Load (W)",
      powerInputPartLoadVariable: "Power at Part Load (W)",
      designCoolingLoad: "Design Cooling Load (Btu/hr)",
      calculateSEER: "Calculate SEER",
      calculating: "Calculating...",
      clearAllFields: "Clear All Fields",
      calculationResults: "Calculation Results",
      loadingResults: "Loading results...",
      failedToLoadData: "Failed to load calculation data. Please try again or check your internet connection.",
      enterInputs: "Enter inputs and click \"Calculate SEER\" to see results.",
      result: "Result ISO 16358-1:2013",
      fcsp: "Seasonal Energy Efficiency Ratio (SEER)",
      lcst: "Load Calculation for Seasonal Total (LCST)",
      ccse: "Cooling Consumption for Seasonal Energy (CCSE)",
      energyConsumptionWorkingDay: "Energy consumption by working day",
      calculatedForDays: "(Calculated for {days} days, for comparison)",
      electricityCostAndSavings: "Electricity Cost & Savings",
      electricityCostPerYear: "Electricity cost per year ",
      savingEnergy: "Saving Energy",
      electricityCostSaving: "Electricity cost saving ",
      note: "NOTE:",
      seerDefinition: "SEER is an index used to measure the energy efficiency of an air conditioner over the entire cooling season. It is calculated by comparing the total amount of cooling provided (Btu) to the total electrical energy consumed during the same period (Wh).",
      btuDays: "(Btu/Days)",
      kwhDay: "(kWh/day)",
      bahtYear: "(Baht/year)",
      loadFactor: "Load Factor",
    },
    th: {
      seerCalculationTitle: "การคำนวณ SEER (ประเทศไทย)",
      inputsSystemType: "ข้อมูลเครื่องปรับอากาศ",
      compressorType: "ประเภทคอมเพรสเซอร์",
      selectType: "เลือกประเภท",
      fixedType: "ประเภท Fixed Speed❄️",
      variableType: "ประเภท Variable☃️",
      initialInformation: "ข้อมูลเบื้องต้น",
      province: "จังหวัด",
      dailyOperationTime: "เวลาการทำงานต่อวัน",
      workingDayPerYear: "จำนวนวันทำงานต่อปี",
      electricityRate: "อัตราค่าไฟฟ้า (Kwh)",
      airConditionerSpecifications: "ข้อมูลจำเพาะเครื่องปรับอากาศ",
      airConditionerTemperature: "อุณหภูมิเครื่องปรับอากาศ",
      outdoorTemperature: "อุณหภูมิภายนอก (°C)",
      indoorCoilInletDBT: "อุณหภูมิกระเปาะแห้งทางเข้าคอยล์ (°C)",
      indoorCoilInletWBT: "อุณหภูมิกระเปาะเปียกทางเข้าคอยล์ (°C)",
      powerAndLoadInformation: "ข้อมูลกำลังไฟฟ้าและภาระการทำความเย็น",
      fullCapacity: "ความสามารถในการทำความเย็นเต็มพิกัด (Btu/hr)",
      halfCapacity: "ความสามารถในการทำความเย็นครึ่งพิกัด (Btu/hr)",
      powerInputFullLoadFixed: "กำลังไฟฟ้าที่สภาวะทำความเย็นเต็มพิกัด (W)",
      powerInputFullLoadVariable: "กำลังไฟฟ้าที่สภาวะทำความเย็นเต็มพิกัด  (W)",
      powerInputPartLoadVariable: "กำลังไฟฟ้าที่สภาวะทำความเย็นบางส่วน  (W)",
      designCoolingLoad: "ภาระการทำความเย็นที่ออกแบบ (Btu/hr)",
      calculateSEER: "คำนวณค่า SEER",
      calculating: "กำลังคำนวณ...",
      clearAllFields: "ล้างข้อมูลทั้งหมด",
      calculationResults: "ผลการคำนวณ",
      loadingResults: "กำลังโหลดผลลัพธ์...",
      failedToLoadData: "ไม่สามารถโหลดข้อมูลการคำนวณได้ กรุณาลองอีกครั้งหรือตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
      enterInputs: "ป้อนข้อมูลและคลิก \"คำนวณค่า SEER\" เพื่อดูผลลัพธ์",
      result: "ผลลัพธ์ ISO 16358-1:2013",
      fcsp: "อัตราส่วนประสิทธิภาพพลังงานตามฤดูกาล (SEER)",
      lcst: "ผลรวมภาระการทำความเย็นตามฤดูกาล (LCST)",
      ccse: "ปริมาณการใช้พลังงานไฟฟ้าตามฤดูกาล (CCSE)",
      energyConsumptionWorkingDay: "ปริมาณการใช้พลังงานไฟฟ้าต่อวันทำงาน",
      calculatedForDays: "(คำนวณสำหรับ {days} วัน เพื่อเปรียบเทียบ)",
      electricityCostAndSavings: "ค่าไฟฟ้าและการประหยัด",
      electricityCostPerYear: "ค่าไฟฟ้าต่อปี ",
      savingEnergy: "การประหยัดพลังงาน",
      electricityCostSaving: "ค่าไฟฟ้าที่ประหยัดได้ ",
      note: "หมายเหตุ:",
      seerDefinition: "SEER คือดัชนีที่ใช้วัดประสิทธิภาพการใช้พลังงานของเครื่องปรับอากาศตลอดฤดูทำความเย็น โดยคำนวณจากปริมาณความเย็นทั้งหมดที่ให้ (Btu) เทียบกับพลังงานไฟฟ้าทั้งหมดที่ใช้ในช่วงเวลาเดียวกัน (Wh) หรือ Btu/Wh",
      btuDays: "(Btu/วัน)",
      kwhDay: "(kWh/วัน)",
      bahtYear: "(บาท/ปี)",
      loadFactor: "ตัวประกอบภาระ (Load Factor)",
    }
  };


  const initialProvince = 'Bangkok';
  const initialProvinceData = provinceDataMap[initialProvince] || getAllProvinces()[0];


  const initialFormData = {
    province: initialProvinceData.name,
    workingTimeRange: '6.00-18.00',
    workingDayPerYear: 365,
    electricityRate: 4.00,
    outdoorTemp: initialProvinceData.outdoorTemp,
    coilInletDryBulb: 27,
    coilInletWetBulb: 19.4,
    fullCapacity: initialProvinceData.fullCapacity,
    halfCapacity: initialProvinceData.halfCapacity,
    fullPowerFixed: initialProvinceData.fullPowerFixed,
    fullPowerVariable: initialProvinceData.fullPowerVariable,
    halfPowerVariable: initialProvinceData.halfPowerVariable,
    designCoolingLoad: initialProvinceData.designCoolingLoad,
    dailyFullLoadRunTime: 6,
    dailyHalfLoadRunTime: 4,
    dailyQuarterLoadRunTime: 2,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [sheetResults, setSheetResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculationType, setCalculationType] = useState('fixed'); 
  const [hasCalculated, setHasCalculated] = useState(false);

  const workingTimeRanges = [
    '6.00-12.00', '6.00-15.00', '6.00-18.00', '6.00-21.00', '6.00-24.00', '6.00-3.00', '6.00-6.00',
    '9.00-15.00', '9.00-18.00', '9.00-21.00', '9.00-24.00', '9.00-3.00', '9.00-6.00', '9.00-9.00',
    '12.00-18.00', '12.00-21.00', '12.00-24.00', '12.00-3.00', '12.00-6.00', '12.00-9.00', '12.00-12.00',
    '15.00-21.00', '15.00-24.00', '15.00-3.00', '15.00-6.00', '15.00-9.00', '15.00-12.00', '15.00-15.00',
    '18.00-24.00', '18.00-3.00', '18.00-6.00', '18.00-9.00', '18.00-12.00', '18.00-15.00', '18.00-18.00',
    '21.00-3.00', '21.00-6.00', '21.00-9.00', '21.00-12.00', '21.00-15.00', '21.00-18.00', '21.00-21.00',
    '24.00-6.00', '24.00-9.00', '24.00-12.00', '24.00-15.00', '24.00-18.00', '24.00-21.00', '24.00-24.00'
  ];

  const provinces = getAllProvinces().map(p => ({ value: p.name, label: p.name }));

  const GOOGLE_APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx3EmfOirqTOoyAhrzxULLX27NpDBvn9O_DBZkaWonAOqkuAbVRTPqshkEKmdKYaL0o/exec";

  const fetchSheetData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      province: formData.province,
      time: formData.workingTimeRange,
      workingDayPerYear: String(formData.workingDayPerYear),
      electricityRate: String(formData.electricityRate),
      outdoorTemp: String(formData.outdoorTemp),
      coilInletDryBulb: String(formData.coilInletDryBulb),
      coilInletWetBulb: String(formData.coilInletWetBulb),
      fullCapacity: String(formData.fullCapacity),
      halfCapacity: String(formData.halfCapacity),
      fullPowerFixed: String(formData.fullPowerFixed),
      fullPowerVariable: String(formData.fullPowerVariable),
      halfPowerVariable: String(formData.halfPowerVariable),
      designCoolingLoad: String(formData.designCoolingLoad),
    }).toString();

    const fullUrl = `${GOOGLE_APPS_SCRIPT_WEB_APP_URL}?${queryParams}`;
    console.log("Calling URL:", fullUrl);

    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Data from Apps Script:", data);

      setFormData(prev => ({
        ...prev,
        electricityRate: data.electricityRate !== undefined ? parseFloat(data.electricityRate) : prev.electricityRate,
        workingDayPerYear: data.workingDayPerYear !== undefined ? parseFloat(data.workingDayPerYear) : prev.workingDayPerYear,
        outdoorTemp: data.outdoorTemp !== undefined ? parseFloat(data.outdoorTemp) : prev.outdoorTemp,
        coilInletDryBulb: data.coilInletDryBulb !== undefined ? parseFloat(data.coilInletDryBulb) : prev.coilInletDryBulb,
        coilInletWetBulb: data.coilInletWetBulb !== undefined ? parseFloat(data.coilInletWetBulb) : prev.coilInletWetBulb,
        fullCapacity: data.fullCapacity !== undefined ? parseFloat(data.fullCapacity) : prev.fullCapacity,
        halfCapacity: data.halfCapacity !== undefined ? parseFloat(data.halfCapacity) : prev.halfCapacity,
        fullPowerFixed: data.fullPowerFixed !== undefined ? parseFloat(data.fullPowerFixed) : prev.fullPowerFixed,
        fullPowerVariable: data.fullPowerVariable !== undefined ? parseFloat(data.fullPowerVariable) : prev.fullPowerVariable,
        halfPowerVariable: data.halfPowerVariable !== undefined ? parseFloat(data.halfPowerVariable) : prev.halfPowerVariable,
        designCoolingLoad: data.designCoolingLoad !== undefined ? parseFloat(data.designCoolingLoad) : prev.designCoolingLoad,
      }));

      setSheetResults(data);
    } catch (err) {
      console.error("Error fetching sheet data:", err);
      setError(text[lang].failedToLoadData);
      setSheetResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    formData.province, formData.workingTimeRange, formData.workingDayPerYear, formData.electricityRate,
    formData.outdoorTemp, formData.coilInletDryBulb, formData.coilInletWetBulb,
    formData.fullCapacity, formData.halfCapacity, formData.fullPowerFixed,
    formData.fullPowerVariable, formData.halfPowerVariable, formData.designCoolingLoad,
    lang,
  ]);

  const handleInputChange = (field, value) => {
  setFormData(prev => {

    let newFormData = { ...prev, [field]: value };
    if (field === 'fullCapacity') {
      const fullCapacityValue = parseFloat(value);
      if (!isNaN(fullCapacityValue)) {
        newFormData = {
          ...newFormData,
          halfCapacity: fullCapacityValue / 2,
        };
      } else {
        newFormData = {
          ...newFormData,
          halfCapacity: 0,
        };
      }
    }
    
    return newFormData;
  });
  setHasCalculated(false); 
  setSheetResults(null);   
  setError(null);
};

  const handleProvinceChange = (selectedProvinceName) => {
    const data = provinceDataMap[selectedProvinceName];
    if (data) {
      setFormData(prev => ({
        ...prev,
        province: selectedProvinceName,
        outdoorTemp: data.outdoorTemp,
        fullCapacity: data.fullCapacity,
        halfCapacity: data.halfCapacity,
        fullPowerFixed: data.fullPowerFixed,
        fullPowerVariable: data.fullPowerVariable,
        halfPowerVariable: data.halfPowerVariable,
        designCoolingLoad: data.designCoolingLoad,
      }));
      setHasCalculated(false);
      setSheetResults(null);
      setError(null);
    }
  };

  const handleCalculate = () => {
    setHasCalculated(true);
    fetchSheetData();
  };

  const handleClearResults = () => {
    setFormData(initialFormData); 
    setSheetResults(null); 
    setError(null); 
    setIsLoading(false); 
    setCalculationType('fixed'); 
    setHasCalculated(false);
  };

  const calculateDailyOperationHours = (timeRangeStr: string): number => {
    if (!timeRangeStr || !timeRangeStr.includes('-') || !timeRangeStr.includes('.')) return 0;
    const parts = timeRangeStr.split('-');
    if (parts.length !== 2) return 0;

    const [startStr, endStr] = parts;
    const [startHourStr, startMinuteStr] = startStr.split('.');
    const [endHourStr, endMinuteStr] = endStr.split('.');

    const startHour = parseInt(startHourStr, 10);
    const startMinute = parseInt(startMinuteStr, 10);
    const endHour = parseInt(endHourStr, 10);
    const endMinute = parseInt(endMinuteStr, 10);

    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) return 0;

    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;

    if (endTime > startTime) {
      return endTime - startTime;
    } else if (endTime < startTime) {
      return (24 - startTime) + endTime;
    } else { 
      return 24;
    }
  };

  return (
   
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="lg:col-span-1 ">
        <Card className='bg-gray-50 shadow-sm border border-gray-200'>
          <CardHeader className="pb-2 ">
            <CardTitle className="text-xl font-semibold text-gray-500 mt-2"> {text[lang].seerCalculationTitle}</CardTitle>
            <hr className=" my-2 border-gray-300" />
          </CardHeader>
            <CardContent className="space-y-2">
            <div>
  <div className="mb-4">
    <div className="text-base font-semibold text-gray-700 mb-3">
      {lang === 'en' ? text[lang].compressorType : text[lang].compressorType}
    </div>
  </div>
  
  <RadioGroup
    id="calculationTypeRadioGroup"
    value={calculationType}
    onValueChange={setCalculationType}
    className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
  >
    <div className="relative">
      <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 cursor-pointer group bg-white hover:bg-indigo-50">
        <RadioGroupItem 
          value="fixed" 
          id="fixedType" 
          className="w-4 h-4 text-indigo-600 border-2 border-gray-300 group-hover:border-indigo-400"
        />
        <label 
          htmlFor="fixedType" 
          className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-700 transition-colors duration-200 select-none"
        >
          {text[lang].fixedType}
        </label>
      </div>
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 transform transition-all duration-200 ${calculationType === 'fixed' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
    </div>
    <div className="relative">
      <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 cursor-pointer group bg-white hover:bg-indigo-50">
        <RadioGroupItem 
          value="variable" 
          id="variableType"
          className="w-4 h-4 text-indigo-600 border-2 border-gray-300 group-hover:border-indigo-400"
        />
        <label 
          htmlFor="variableType" 
          className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-700 transition-colors duration-200 select-none"
        >
          {text[lang].variableType}
        </label>
      </div>
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 transform transition-all duration-200 ${calculationType === 'variable' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
    </div>
  </RadioGroup>
</div>
            
            <div className="space-y-4"> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="province" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].province}</label>
                  <Select value={formData.province} onValueChange={handleProvinceChange}>
                    <SelectTrigger className="w-full rounded-sm">
                      <SelectValue placeholder={text[lang].province} />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="workingTimeRange" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"> {text[lang].dailyOperationTime}</label>
                  <Select value={formData.workingTimeRange} onValueChange={(value) => handleInputChange('workingTimeRange', value)}>
                    <SelectTrigger className="w-full rounded-sm">
                      <SelectValue placeholder={text[lang].dailyOperationTime} />
                    </SelectTrigger>
                    <SelectContent>
                      {workingTimeRanges.map(range => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="workingDayPerYear" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].workingDayPerYear}</label>
                  <Input
                    type="number"
                    value={formData.workingDayPerYear}
                    onChange={(e) => handleInputChange('workingDayPerYear', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.workingDayPerYear === initialFormData.workingDayPerYear && typeof formData.workingDayPerYear === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>

                <div>
                  <label htmlFor="electricityRate" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].electricityRate}</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.electricityRate}
                    onChange={(e) => handleInputChange('electricityRate', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.electricityRate === initialFormData.electricityRate && typeof formData.electricityRate === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>
              </div>
            </div>

            <div> 
            <h4 className="text-base font-semibold text-gray-600 mb-2 mt-3">{text[lang].airConditionerTemperature}</h4>
            <div className="space-y-1 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div>
                  <label htmlFor="outdoorTemp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].outdoorTemperature}</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.outdoorTemp}
                    onChange={(e) => handleInputChange('outdoorTemp', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.outdoorTemp === initialFormData.outdoorTemp && typeof formData.outdoorTemp === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>

                <div>
                  <label htmlFor="coilInletDryBulb" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].indoorCoilInletDBT}</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.coilInletDryBulb}
                    onChange={(e) => handleInputChange('coilInletDryBulb', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.coilInletDryBulb === initialFormData.coilInletDryBulb && typeof formData.coilInletDryBulb === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>

                <div>
                  <label htmlFor="coilInletWetBulb" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].indoorCoilInletWBT}</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.coilInletWetBulb}
                    onChange={(e) => handleInputChange('coilInletWetBulb', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.coilInletWetBulb === initialFormData.coilInletWetBulb && typeof formData.coilInletWetBulb === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>
              </div>
            </div>
            </div>

            <div> 
              <h3 className="text-base font-semibold text-gray-600 mt-3 mb-2">{text[lang].powerAndLoadInformation}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div>
                  <label htmlFor="fullCapacity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].fullCapacity}</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.fullCapacity}
                    onChange={(e) => handleInputChange('fullCapacity', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.fullCapacity === initialFormData.fullCapacity && typeof formData.fullCapacity === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>

                <div>
                  <label htmlFor="halfCapacity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].halfCapacity}</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.halfCapacity}
                    onChange={(e) => handleInputChange('halfCapacity', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.halfCapacity === initialFormData.halfCapacity && typeof formData.halfCapacity === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>

                
                {calculationType === 'fixed' && (
                  <div>
                    <label htmlFor="fullPowerFixed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"> {text[lang].powerInputFullLoadFixed}</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.fullPowerFixed}
                      onChange={(e) => handleInputChange('fullPowerFixed', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-full rounded-sm ${formData.fullPowerFixed === initialFormData.fullPowerFixed && typeof formData.fullPowerFixed === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                    />
                  </div>
                )}

                {calculationType === 'variable' && (
                  <>
                    <div>
                      <label htmlFor="Power Input at Full LoadVariable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].powerInputFullLoadVariable}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.fullPowerVariable}
                        onChange={(e) => handleInputChange('fullPowerVariable', e.target.value === '' ? '' : Number(e.target.value))}
                        className={`w-full rounded-sm ${formData.fullPowerVariable === initialFormData.fullPowerVariable && typeof formData.fullPowerVariable === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                      />
                    </div>

                    <div>
                      <label htmlFor="halfPowerVariable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].powerInputPartLoadVariable}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.halfPowerVariable}
                        onChange={(e) => handleInputChange('halfPowerVariable', e.target.value === '' ? '' : Number(e.target.value))}
                        className={`w-full rounded-sm ${formData.halfPowerVariable === initialFormData.halfPowerVariable && typeof formData.halfPowerVariable === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                      />
                    </div>
                  </>
                )}

                
                <div>
                  <label htmlFor="designCoolingLoad" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">{text[lang].designCoolingLoad}</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.designCoolingLoad}
                    onChange={(e) => handleInputChange('designCoolingLoad', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full rounded-sm ${formData.designCoolingLoad === initialFormData.designCoolingLoad && typeof formData.designCoolingLoad === 'number' ? 'text-gray-500' : 'text-gray-900'}`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2"> 
              <Button onClick={handleCalculate} disabled={isLoading} className="w-full">
                {isLoading ? text[lang].calculating : text[lang].calculateSEER}
              </Button>
              <Button variant="outline" onClick={handleClearResults} className="w-full mt-2">
                {text[lang].clearAllFields}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>


      
      <div className="lg:col-span-1">
        <Card className='bg-gray-50 rounded-md p-2 shadow-sm border border-gray-200'>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-gray-500 ">{text[lang].calculationResults}</CardTitle>
            <hr className="my-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading && <p className="text-blue-500 ">{text[lang].loadingResults}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {sheetResults && !isLoading && !error ? (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-gray-500 flex items-center gap-1">
                  {text[lang].result} ({calculationType === 'fixed' ? text[lang].fixedType : text[lang].variableType})
                </h2>

                {(() => {
                  const currentResults = calculationType === 'fixed' ? sheetResults.fixed : sheetResults.variable;
                  const currentLcst = calculationType === 'fixed' ? sheetResults.lcst.lcstfixed : sheetResults.lcst.lcstvariable;

                  
                  const dailyOpHours = calculateDailyOperationHours(formData.workingTimeRange);
                  const totalHoursInPeriod_annual = dailyOpHours * parseFloat(String(formData.workingDayPerYear));
                  
                  let maxDemandKW = 0;
                  if (calculationType === 'fixed') {
                    maxDemandKW = parseFloat(String(formData.fullPowerFixed)) / 1000;
                  } else {
                    maxDemandKW = parseFloat(String(formData.fullPowerVariable)) / 1000 ;
                  }

                  
                  const actualEnergyConsumedKWhForPeriod = (parseFloat(currentResults.ccse) * (formData.workingDayPerYear / 365)); 

                  let loadFactor = 0.0;
                  if (maxDemandKW > 0 && totalHoursInPeriod_annual > 0) {
                    const maxPossibleEnergyInPeriodKWh = maxDemandKW * totalHoursInPeriod_annual;
                   
                    loadFactor = actualEnergyConsumedKWhForPeriod / maxPossibleEnergyInPeriodKWh;
                  }

                  return (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
                          {text[lang].fcsp}
                        </h3>
                        <div className="text-lg font-bold text-blue-600">
                          {parseFloat(currentResults.fcsp).toFixed(2)}
                        </div>
                        <hr className="my-2" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                          <Thermometer className="w-3.5 h-3.5 text-purple-500" />
                          {text[lang].lcst}
                        </h3>
                        <div className="text-lg font-bold text-purple-600">
                          {parseFloat(currentLcst).toLocaleString(undefined, { maximumFractionDigits: 0 })} {text[lang].btuDays}
                        </div>
                        <hr className="my-2" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                          <AlarmSmoke className="w-3.5 h-3.5 text-orange-500" />
                          {text[lang].ccse}
                        </h3>
                        <div className="text-lg font-bold text-orange-600">
                          {parseFloat(currentResults.ccse).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {text[lang].btuDays}
                        </div>
                        
                      
                      </div>
 
                      <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-blue-500" />
                          {text[lang].energyConsumptionWorkingDay}
                        </h3>
                        <div className="text-lg font-bold text-blue-600">
                          {actualEnergyConsumedKWhForPeriod.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {text[lang].kwhDay}
                        </div>

                        <p className="text-lg front-semibold text-gray-500 mt-2 text-start">
                          {text[lang].calculatedForDays.replace('{days}', String(formData.workingDayPerYear))}
                        </p>
                        
                        <hr className="my-2" />

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                          <BadgeDollarSign className="w-3.5 h-3.5 text-yellow-600" />
                          {text[lang].electricityCostPerYear}
                        </h3>
                        <div className="text-lg font-bold text-yellow-600">
                          ฿{parseFloat(currentResults.cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {text[lang].bahtYear}
                        </div>
                        <hr className="my-2" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                          <LoaderPinwheel className="w-3.5 h-3.5 text-teal-500" />
                          {text[lang].loadFactor}
                        </h3>
                        <div className="text-lg font-bold text-teal-600">
                          {loadFactor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>

                          
                          {calculationType === 'variable' && (
                            <>
                            
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="text-gray-500">{text[lang].enterInputs}</p>
            )}
          </CardContent>
        </Card>
       
        <div className="mb-2 mt-5">
          <span className="text-base font-semibold text-gray-600 mr-1 mt-6">
            {text[lang].note} <p className='text-sm font-normal text-gray-600'>{text[lang].seerDefinition}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeerCalculator;