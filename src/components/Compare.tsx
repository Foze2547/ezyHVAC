import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { DollarSign, Thermometer, Zap, BarChart2, PlusCircle, X, ChevronUp, ChevronDown } from 'lucide-react'; 
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


import { provinceDataMap, getAllProvinces } from '../services/provinceData';
import { useLanguage } from "../contexts/LanguageContext"; 

const GOOGLE_APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwZka68o6D8J1S9MW6H8xr-0Ok1QvhGFfeuafhiJXfh2skDVkyXJhTJCKXC3__zqrt5/exec";

const Compare = () => {
  const { lang } = useLanguage(); 

  const text = {
    en: {
      pageTitle: "Calculator Comparison (Thailand)",
      pageDesc: "Calculate the Seasonal Energy Efficiency Ratio (SEER) and electricity cost for air conditioning units under various conditions.",
      inputSpecs: "Unit ",
      selectCalcType: "Type",
      fixedType: "Fixed Type❄️",
      variableType: "Variable Type☃️",
      initialInfo: "Initial Information",
      province: "Province",
      selectProvince: "Select a province",
      workingTimeRange: "Working Time Range",
      selectTimeRange: "Select time range",
      workingDayPerYear: "Working Day Per Year",
      electricityRate: "Electricity Rate (Baht/kWh)",
      acSpecs: "Air Conditioner Specifications",
      airConditionerTemperature: "Air conditioner temperature",
      outdoorTemp: "Outdoor Temperature (°C)",
      coilInletDryBulb: "Coil Inlet Dry Bulb (°C)",
      coilInletWetBulb: "Coil Inlet Wet Bulb (°C)",
      powerLoadInfo: "Power and Load Information",
      fullCapacity: "Full Capacity (BTU/hr)",
      halfCapacity: "Half Capacity (BTU/hr)",
      fullPowerFixed: "Full Power (W)",
      fullPowerVariable: "Full Power (W)",
      halfPowerVariable: "Half Power (W)",
      designCoolingLoad: "Design Cooling Load (BTU/hr)",
      addUnit: "Add New Inputs Specs",
      calculateAll: "Calculate All SEERs",
      calculatingAll: "Calculating All...",
      clearAll: "Clear All Fields",
      resultsTitle: "Calculation Results ",
      loadingResults: "Loading results for units...",
      calculationFailed: "Some calculations failed. Please check inputs and try again.",
      enterInputs: "Enter inputs and click \"Calculate All SEERs\" to see results.",
      fcsp: "Fractional Cooling Seasonal Performance (FCSP: ISO 16358-1:2013)",
      lcst: "Load Calculation for Seasonal Total [LCST (Btu/Days)]",
      ccse: "Cooling Consumption for Seasonal Energy [CCSE (Btu/Days)]",
      energyConsumptionDaily: "Energy consumption by working day (kWh/day)",
      calculatedFor: "(Calculated for {days} days)",
      electricityCostAnnual: "Electricity Cost (Baht/year)",
      savingEnergy: "Saving Energy",
      electricityCostSaving: "Electricity cost saving (Baht/year)",
      comparisonSpecs: "Comparison Specs",
      selectUnit1: "Select Unit for Comparison",
      selectUnit2: "Select Unit for Comparison",
      costComparison: "Cost Comparison: {unit1} vs. {unit2}",
      comparisonConnector: "to",
      lowerCost: "Lower Annual Cost:",
      higherCost: "Higher Annual Cost:",
      costDifference: "Annual Cost Difference:",
      investmentCostLabel: "Investment Cost (Baht)",
      paybackPeriod: "Payback Period (Years)",
      comparisonTip1: "Calculate at least two units to enable comparison.",
      comparisonTip2: "Please select two different units for comparison.",
      comparisonTip3: "Select two units above to see their cost comparison.",
      annualCost: "Annual Electricity Cost",
      comparisonSavingsText: "Choosing the **{unitWithLowerCost}** could save you **฿{costDifference}** per year compared to the **{unitWithHigherCost}**.",
      noteTitle: "NOTE:",
      noteContent: "SEER is an index used to measure the energy efficiency of an air conditioner over the entire cooling season. It is calculated by comparing the total amount of cooling provided (BTU) to the total electrical energy consumed during the same period (Wh).",
      remove: "Remove",
      maxUnitsAlert: "You can add up to 3 Inputs Specs for comparison.",
      minUnitsAlert: "You must have at least one AC unit.",
      minimize: "Minimize",
      expand: "Expand",
    },
    th: {
      pageTitle: "เปรียบเทียบการคำนวณ (ประเทศไทย)",
      pageDesc: "คำนวณอัตราส่วนประสิทธิภาพพลังงานตามฤดูกาล (SEER) และค่าไฟฟ้าสำหรับเครื่องปรับอากาศภายใต้เงื่อนไขต่างๆ",
      inputSpecs: "ข้อมูลเครื่องปรับอากาศ",
      selectCalcType: "ประเภทคอมเพรสเซอร์",
      fixedType: "ประเภท Fixed Speed❄️",
      variableType: "ประเภท Variable☃️",
      initialInfo: "ข้อมูลเบื้องต้น",
      province: "จังหวัด",
      selectProvince: "เลือกจังหวัด",
      workingTimeRange: "ช่วงเวลาทำงาน",
      selectTimeRange: "เลือกช่วงเวลา",
      workingDayPerYear: "จำนวนวันทำงานต่อปี",
      electricityRate: "อัตราค่าไฟฟ้า (บาท/kWh)",
      acSpecs: "ข้อมูลจำเพาะเครื่องปรับอากาศ",
      airConditionerTemperature: "อุณหภูมิเครื่องปรับอากาศ",
      outdoorTemp: "อุณหภูมิภายนอก (°C)",
      coilInletDryBulb: "อุณหภูมิกระเปาะแห้งทางเข้าคอยล์ (°C)",
      coilInletWetBulb: "อุณหภูมิกระเปาะเปียกทางเข้าคอยล์ (°C)",
      powerLoadInfo: "ข้อมูลกำลังและโหลด",
      fullCapacity: "ความสามารถเต็มที่ (BTU/hr)",
      halfCapacity: "ความสามารถครึ่งหนึ่ง (BTU/hr)",
      fullPowerFixed: "กำลังไฟฟ้าเต็มที่ (W)",
      fullPowerVariable: "กำลังไฟฟ้าเต็มที่ (W)",
      halfPowerVariable: "กำลังไฟฟ้าครึ่งหนึ่ง (W)",
      designCoolingLoad: "ภาระการทำความเย็นที่ออกแบบ (BTU/hr)",
      addUnit: "เพิ่มข้อมูลใหม่",
      calculateAll: "คำนวณ SEER ทั้งหมด",
      calculatingAll: "กำลังคำนวณทั้งหมด...",
      clearAll: "ล้างข้อมูลทั้งหมด",
      resultsTitle: "ผลการคำนวณ SEER",
      loadingResults: "กำลังโหลดผลลัพธ์สำหรับหน่วย...",
      calculationFailed: "การคำนวณบางรายการล้มเหลว กรุณาตรวจสอบข้อมูลและลองอีกครั้ง",
      enterInputs: "ป้อนข้อมูลและคลิก 'คำนวณ SEER ทั้งหมด' เพื่อดูผลลัพธ์",
      fcsp: "ผลรวมของประสิทธิภาพการทำความเย็นตามฤดูกาล (FCSP: ISO 16358-1:2013) ",
      lcst: "ผลรวมภาระการทำความเย็นตามฤดูกาล [LCST (Btu/Days)]",
      ccse: "ปริมาณการใช้พลังงานไฟฟ้าตามฤดูกาล [CCSE (Btu/Days)]",
      energyConsumptionDaily: "ปริมาณการใช้พลังงานตามวันทำงาน (kWh/วัน)",
      calculatedFor: "(คำนวณสำหรับ {days} วัน)",
      electricityCostAnnual: "ค่าไฟฟ้า (บาท/ปี)",
      savingEnergy: "ประหยัดพลังงาน",
      electricityCostSaving: "ประหยัดค่าไฟฟ้า (บาท/ปี)",
      comparisonSpecs: "ข้อมูลการเปรียบเทียบ",
      selectUnit1: "เลือกหน่วย สำหรับเปรียบเทียบ",
      selectUnit2: "เลือกหน่วย สำหรับเปรียบเทียบ",
      costComparison: "เปรียบเทียบค่าใช้จ่าย: {unit1} เทียบกับ {unit2}",
      comparisonConnector: "กับ",
      lowerCost: "ค่าใช้จ่ายต่อปีที่ต่ำกว่า:",
      higherCost: "ค่าใช้จ่ายต่อปีที่สูงกว่า:",
      costDifference: "ส่วนต่างค่าใช้จ่ายต่อปี:",
      investmentCostLabel: "เงินลงทุน (บาท)",
      paybackPeriod: "ระยะเวลาคืนทุน (ปี)",
      comparisonTip1: "คำนวณอย่างน้อยสองหน่วยเพื่อเปิดใช้งานการเปรียบเทียบ",
      comparisonTip2: "กรุณาเลือกสองหน่วยที่แตกต่างกันสำหรับการเปรียบเทียบ",
      comparisonTip3: "เลือกสองหน่วยด้านบนเพื่อดูการเปรียบเทียบค่าใช้จ่าย",
      annualCost: "ค่าไฟฟ้าต่อปี",
      comparisonSavingsText: "การเลือก **{unitWithLowerCost}** สามารถช่วยให้คุณประหยัดเงินได้ **฿{costDifference}** ต่อปี เมื่อเทียบกับ **{unitWithHigherCost}**",
      noteTitle: "หมายเหตุ:",
      noteContent: "SEER เป็นดัชนีที่ใช้วัดประสิทธิภาพการใช้พลังงานของเครื่องปรับอากาศตลอดทั้งฤดูทำความเย็น โดยคำนวณจากการเปรียบเทียบปริมาณความเย็นทั้งหมดที่ให้ (BTU) กับพลังงานไฟฟ้าทั้งหมดที่ใช้ในช่วงเวลาเดียวกัน (Wh)",
      remove: "ลบ",
      maxUnitsAlert: "คุณสามารถเพิ่มข้อมูลสำหรับเปรียบเทียบได้สูงสุด 3 รายการ",
      minUnitsAlert: "คุณต้องมีข้อมูลเครื่องปรับอากาศอย่างน้อยหนึ่งรายการ",
      minimize: "ย่อ",
      expand: "ขยาย",
    },
  };

  const initialProvince = 'Bangkok';
  const initialProvinceData = provinceDataMap[initialProvince] || getAllProvinces()[0];

  
  const INITIAL_WORKING_DAY_PER_YEAR = 365;
  const INITIAL_ELECTRICITY_RATE = 4.00;
  const INITIAL_COIL_INLET_DRY_BULB = 27;
  const INITIAL_COIL_INLET_WET_BULB = 19.4;

  
  const generateUnitId = (index) => `unit-${index + 1}`;

  
  const createinputspecs = (index, namePrefix = text[lang].inputSpecs) => ({
    id: generateUnitId(index),
    name: `${namePrefix} ${index + 1}`,
    province: initialProvinceData.name,
    workingTimeRange: '6.00-18.00',
    workingDayPerYear: INITIAL_WORKING_DAY_PER_YEAR,
    electricityRate: INITIAL_ELECTRICITY_RATE,
    outdoorTemp: initialProvinceData.outdoorTemp,
    coilInletDryBulb: INITIAL_COIL_INLET_DRY_BULB,
    coilInletWetBulb: INITIAL_COIL_INLET_WET_BULB,
    fullCapacity: initialProvinceData.fullCapacity,
    halfCapacity: initialProvinceData.halfCapacity,
    fullPowerFixed: initialProvinceData.fullPowerFixed,
    fullPowerVariable: initialProvinceData.fullPowerVariable,
    halfPowerVariable: initialProvinceData.halfPowerVariable,
    designCoolingLoad: initialProvinceData.designCoolingLoad,
    calculationType: 'fixed',
    investmentCost: 0, 
    results: null,
    isMinimized: false,
    isLoading: false,
    error: null,
  });

  const [acUnits, setAcUnits] = useState([createinputspecs(0, text[lang].inputSpecs)]);

  
  const [comparedUnitIds, setComparedUnitIds] = useState(
    ['', ''] 
  );

  useEffect(() => {
    setComparedUnitIds(prev => {
      const newIds = [...prev];
      const availableUnits = acUnits.filter(unit => unit.results);

      
      if (newIds[0] && !availableUnits.some(unit => unit.id === newIds[0])) {
        newIds[0] = '';
      }
      if (newIds[1] && (!availableUnits.some(unit => unit.id === newIds[1]) || newIds[1] === newIds[0])) {
        newIds[1] = '';
      }
      return newIds;
    });
  }, [acUnits, lang]);


  useEffect(() => {
    setAcUnits(prevUnits =>
      prevUnits.map((unit, idx) => ({
        ...unit,
        name: `${text[lang].inputSpecs} ${idx + 1}`,
      }))
    );
  }, [lang]);

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

  
  const fetchUnitData = useCallback(async (unitData, unitId) => {
    setAcUnits(prevUnits => prevUnits.map(unit =>
      unit.id === unitId ? { ...unit, isLoading: true, error: null } : unit
    ));

    const queryParams = new URLSearchParams({
      province: unitData.province,
      time: unitData.workingTimeRange,
      workingDayPerYear: String(unitData.workingDayPerYear),
      electricityRate: String(unitData.electricityRate),
      outdoorTemp: String(unitData.outdoorTemp),
      coilInletDryBulb: String(unitData.coilInletDryBulb),
      coilInletWetBulb: String(unitData.coilInletWetBulb),
      fullCapacity: String(unitData.fullCapacity),
      halfCapacity: String(unitData.halfCapacity),
      fullPowerFixed: String(unitData.fullPowerFixed),
      fullPowerVariable: String(unitData.fullPowerVariable),
      halfPowerVariable: String(unitData.halfPowerVariable),
      designCoolingLoad: String(unitData.designCoolingLoad),
    }).toString();

    const fullUrl = `${GOOGLE_APPS_SCRIPT_WEB_APP_URL}?${queryParams}`;
    console.log(`Calling URL for ${unitId}:`, fullUrl);

    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log(`Data from Apps Script for ${unitId}:`, data);

      setAcUnits(prevUnits => prevUnits.map(unit =>
        unit.id === unitId ? {
          ...unit,
          results: data,
          isLoading: false,
        } : unit
      ));
    } catch (err) {
      console.error(`Error fetching sheet data for ${unitId}:`, err);
      setAcUnits(prevUnits => prevUnits.map(unit =>
        unit.id === unitId ? { ...unit, error: text[lang].calculationFailed, isLoading: false, results: null } : unit
      ));
    }
  }, [lang]); 


  const handleInputChange = (unitId, field, value) => {
  setAcUnits(prevUnits => {
    let newUnits = prevUnits.map(unit =>
      unit.id === unitId
        ? { ...unit, [field]: value, results: null, error: null }
        : unit
    );

    const changedUnit = newUnits.find(unit => unit.id === unitId);

    if (changedUnit && field === 'fullCapacity') {
      const fullCapacityValue = parseFloat(value);
      if (!isNaN(fullCapacityValue) && typeof fullCapacityValue === 'number') {
        const changedUnitIndex = newUnits.findIndex(u => u.id === unitId);
        if (changedUnitIndex !== -1) {
          const updatedUnits = [...newUnits];
          updatedUnits[changedUnitIndex] = {
            ...updatedUnits[changedUnitIndex],
            halfCapacity: fullCapacityValue / 2,
          };
          newUnits = updatedUnits;
        }
      } else {
        const changedUnitIndex = newUnits.findIndex(u => u.id === unitId);
        if (changedUnitIndex !== -1) {
          const updatedUnits = [...newUnits];
          updatedUnits[changedUnitIndex] = {
            ...updatedUnits[changedUnitIndex],
            halfCapacity: 0, 
          };
          newUnits = updatedUnits;
        }
      }
    }
    
    const changedUnitIndex = newUnits.findIndex(u => u.id === unitId);
    if (changedUnitIndex === 0) { 
      const unit1 = newUnits[0];
      const fieldsToSyncFromUnit1 = [
        'workingTimeRange', 'workingDayPerYear',
        'electricityRate', 'outdoorTemp', 'coilInletDryBulb', 'coilInletWetBulb'
      ];
      if (fieldsToSyncFromUnit1.includes(field)) {
        newUnits = newUnits.map((unit, index) => {
          if (index > 0) { 
            return { ...unit, [field]: unit1[field], results: null, error: null };
          }
          return unit;
        });
      }
    }

    return newUnits;
  });
};

  
  const handleProvinceChange = (unitId, selectedProvinceName) => {
    const data = provinceDataMap[selectedProvinceName];
    if (data) {
      setAcUnits(prevUnits => {
        let newUnits = [...prevUnits];
        const unitIndex = newUnits.findIndex(u => u.id === unitId);

        if (unitIndex === -1) return prevUnits;

        
        newUnits[unitIndex] = {
          ...newUnits[unitIndex],
          province: selectedProvinceName,
          outdoorTemp: data.outdoorTemp,
          fullCapacity: data.fullCapacity, 
          halfCapacity: data.halfCapacity,
          fullPowerFixed: data.fullPowerFixed,
          fullPowerVariable: data.fullPowerVariable,
          halfPowerVariable: data.halfPowerVariable,
          designCoolingLoad: data.designCoolingLoad,
          results: null,
          error: null,
        };

        
        if (unitIndex === 0) {
          const unit1 = newUnits[0];
          newUnits = newUnits.map((unit, index) => {
            if (index > 0) { 
              return {
                ...unit,
                province: unit1.province,
                outdoorTemp: unit1.outdoorTemp,
                results: null,
                error: null,
              };
            }
            return unit;
          });
        }
        return newUnits;
      });
    }
  };

  
  const handleCalculateAll = async () => {

    setAcUnits(prevUnits =>
      prevUnits.map(unit =>
        unit.results === null
          ? { ...unit, error: null, isLoading: true }
          : unit
      )
    );

    
    const fetchAll = acUnits
      .filter(unit => unit.results === null)
      .map(unit => fetchUnitData(unit, unit.id));
    await Promise.all(fetchAll);

   
    setAcUnits(prevUnits =>
      prevUnits.map(unit => ({
        ...unit,
        isLoading: false,
      }))
    );
  };

  
  const handleClearResults = () => {
    setAcUnits([createinputspecs(0, text[lang].inputSpecs)]);
    setComparedUnitIds(['', '']);
  };


  const handleAddUnit = () => {
    if (acUnits.length < 3) {
      setAcUnits(prevUnits => {
        const unit1 = prevUnits[0];
        const newUnit = {
          ...createinputspecs(prevUnits.length, text[lang].inputSpecs),

          province: unit1.province,
          workingTimeRange: unit1.workingTimeRange,
          workingDayPerYear: unit1.workingDayPerYear,
          electricityRate: unit1.electricityRate,
          outdoorTemp: unit1.outdoorTemp,
          coilInletDryBulb: unit1.coilInletDryBulb,
          coilInletWetBulb: unit1.coilInletWetBulb,
          fullCapacity: initialProvinceData.fullCapacity, 
          halfCapacity: initialProvinceData.halfCapacity,
          fullPowerFixed: initialProvinceData.fullPowerFixed,
          fullPowerVariable: initialProvinceData.fullPowerVariable,
          halfPowerVariable: initialProvinceData.halfPowerVariable,
          designCoolingLoad: initialProvinceData.designCoolingLoad,
        };
        return [...prevUnits, newUnit];
      });
    } else {
      alert(text[lang].maxUnitsAlert);
    }
  };

  const handleRemoveUnit = (unitIdToRemove) => {
    if (acUnits.length > 1) {
      setAcUnits(prevUnits => prevUnits.filter(unit => unit.id !== unitIdToRemove));
    } else {
      alert(text[lang].minUnitsAlert);
    }
  };

  const handleToggleMinimize = (unitId) => {
    setAcUnits(prevUnits =>
      prevUnits.map(unit =>
        unit.id === unitId ? { ...unit, isMinimized: !unit.isMinimized } : unit
      )
    );
  };


  const handleComparisonSelection = (unitId, index) => {
    setComparedUnitIds(prev => {
      const newCompared = [...prev];
      newCompared[index] = unitId;
      return newCompared;
    });
  };

  const unit1ToCompare = acUnits.find(unit => unit.id === comparedUnitIds[0]);
  const unit2ToCompare = acUnits.find(unit => unit.id === comparedUnitIds[1]);

  const canCompare = unit1ToCompare?.results && unit2ToCompare?.results && unit1ToCompare.id !== unit2ToCompare.id;

  const getComparisonSavings = () => {
    if (!canCompare) return null;

    const unit1Cost = unit1ToCompare.calculationType === 'fixed'
      ? unit1ToCompare.results.fixed.cost
      : unit1ToCompare.results.variable.cost;

    const unit2Cost = unit2ToCompare.calculationType === 'fixed'
      ? unit2ToCompare.results.fixed.cost
      : unit2ToCompare.results.variable.cost;

    const costDifference = unit1Cost - unit2Cost;
    const savingPercent = unit1Cost !== 0 ? (costDifference / unit1Cost) * 100 : 0;

    let paybackPeriod = null;
    const u1Invest = unit1ToCompare.investmentCost;
    const u2Invest = unit2ToCompare.investmentCost;

    if (costDifference > 0) { 
      const annualSavings = costDifference; 
      if (u2Invest > 0 && annualSavings > 0) {
        paybackPeriod = u2Invest / annualSavings;
      }
    } else if (costDifference < 0) { 
      const annualSavings = -costDifference; 
      if (u1Invest > 0 && annualSavings > 0) {
        paybackPeriod = u1Invest / annualSavings;
      }
    }

    return {
      costDifference,
      savingPercent: isNaN(savingPercent) ? 0 : savingPercent,
      unitWithLowerCost: costDifference > 0 ? unit2ToCompare.name : unit1ToCompare.name,
      unitWithHigherCost: costDifference > 0 ? unit1ToCompare.name : unit2ToCompare.name,
      paybackPeriod: paybackPeriod !== null ? paybackPeriod.toFixed(2) : null,
    };
  };

  const comparisonSavings = getComparisonSavings();

  const getComparisonType = () => {
    if (!unit1ToCompare || !unit2ToCompare) return "";
    if (unit1ToCompare.calculationType === "fixed" && unit2ToCompare.calculationType === "fixed") return "fix-fix";
    if (unit1ToCompare.calculationType === "variable" && unit2ToCompare.calculationType === "variable") return "var-var";
    return "fix-var";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
      <div className="lg:col-span-1">
        <Card className='bg-gray-50 rounded-lg shadow-sm border border-gray-200 text-gray-500'>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-600">{text[lang].pageTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {acUnits.map((unit, unitIndex) => (
              <div key={unit.id} className="border p-3 rounded-lg bg-white shadow-sm mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-600">{unit.name}</h3>
                  <div className="flex items-center space-x-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-indigo-500 text-white font-bold hover:bg-indigo-300 rounded-md px-2.5 py-1.5 flex items-center text-sm"
                      onClick={() => handleToggleMinimize(unit.id)}
                      title={unit.isMinimized ? text[lang].expand : text[lang].minimize}
                    >
                      {unit.isMinimized ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronUp className="w-4 h-4 mr-1" />}
                      {unit.isMinimized ? text[lang].expand : text[lang].minimize}
                    </Button>
                    {acUnits.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-400 rounded-md px-2.5 py-1.5 flex items-center text-sm"
                        onClick={() => handleRemoveUnit(unit.id)}
                        title={text[lang].remove}
                      >
                        <X className="w-4 h-4 mr-1" />
                        {text[lang].remove}
                      </Button>
                    )}
                  </div>
                </div>
                
                {!unit.isMinimized && (
                  <div className="space-y-4 ">
               <div className="mb-6">
  <label className="text-base font-semibold text-gray-700 block mb-4">
    {text[lang].selectCalcType}
  </label>
  
  <RadioGroup
    value={unit.calculationType}
    onValueChange={(value) => handleInputChange(unit.id, 'calculationType', value)}
    className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
  >
    <div className="relative">
      <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 cursor-pointer group bg-white hover:bg-indigo-50">
        <RadioGroupItem 
          value="fixed" 
          id={`fixedType-${unit.id}`}
          className="w-4 h-4 text-indigo-600 border-2 border-gray-300 group-hover:border-indigo-400"
        />
        <label 
          htmlFor={`fixedType-${unit.id}`}
          className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-700 transition-colors duration-200 select-none"
        >
          {text[lang].fixedType}
        </label>
      </div>
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 transform transition-all duration-200 ${unit.calculationType === 'fixed' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
    </div>
    
    <div className="relative">
      <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 cursor-pointer group bg-white hover:bg-indigo-50">
        <RadioGroupItem 
          value="variable" 
          id={`variableType-${unit.id}`}
          className="w-4 h-4 text-indigo-600 border-2 border-gray-300 group-hover:border-indigo-400"
        />
        <label 
          htmlFor={`variableType-${unit.id}`}
          className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-700 transition-colors duration-200 select-none"
        >
          {text[lang].variableType}
        </label>
      </div>
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 transform transition-all duration-200 ${unit.calculationType === 'variable' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
    </div>
  </RadioGroup>
</div>

                {unitIndex === 0 && (
                  <>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`province-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].province}</label>
                          <Select value={unit.province} onValueChange={(value) => handleProvinceChange(unit.id, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={text[lang].selectProvince} />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map(p => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor={`workingTimeRange-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].workingTimeRange}</label>
                          <Select value={unit.workingTimeRange} onValueChange={(value) => handleInputChange(unit.id, 'workingTimeRange', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={text[lang].selectTimeRange} />
                            </SelectTrigger>
                            <SelectContent>
                              {workingTimeRanges.map(range => (
                                <SelectItem key={range} value={range}>{range}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor={`workingDayPerYear-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].workingDayPerYear}</label>
                          <Input
                            type="number"
                            value={unit.workingDayPerYear}
                            onChange={(e) => handleInputChange(unit.id, 'workingDayPerYear', e.target.value === '' ? '' : Number(e.target.value))}
                            className={unit.workingDayPerYear === INITIAL_WORKING_DAY_PER_YEAR && typeof unit.workingDayPerYear === 'number' ? 'text-gray-500' : 'text-gray-900'}
                          />
                        </div>

                        <div>
                          <label htmlFor={`electricityRate-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].electricityRate}</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={unit.electricityRate}
                            onChange={(e) => handleInputChange(unit.id, 'electricityRate', e.target.value === '' ? '' : Number(e.target.value))}
                            className={
                              unit.electricityRate === INITIAL_ELECTRICITY_RATE && typeof unit.electricityRate === 'number'
                                ? 'text-gray-500'
                                : 'text-gray-900'
                            }
                          />
                        </div>
                      </div>
                    </div>
                 
                  </>
                )}

                {unitIndex === 0 && (
                  <>
                    <div className="space-y-1 mt-2">
                      <h4 className="text-base font-semibold text-gray-600 ">{text[lang].airConditionerTemperature}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`outdoorTemp-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].outdoorTemp}</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={unit.outdoorTemp}
                            onChange={(e) => handleInputChange(unit.id, 'outdoorTemp', e.target.value === '' ? '' : Number(e.target.value))}
                            className={unit.outdoorTemp === provinceDataMap[unit.province]?.outdoorTemp && typeof unit.outdoorTemp === 'number' ? 'text-gray-500' : 'text-gray-900'}
                          />
                        </div>

                        <div>
                          <label htmlFor={`coilInletDryBulb-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].coilInletDryBulb}</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={unit.coilInletDryBulb}
                            onChange={(e) => handleInputChange(unit.id, 'coilInletDryBulb', e.target.value === '' ? '' : Number(e.target.value))}
                            className={unit.coilInletDryBulb === INITIAL_COIL_INLET_DRY_BULB && typeof unit.coilInletDryBulb === 'number' ? 'text-gray-500' : 'text-gray-900'}
                          />
                        </div>

                        <div>
                          <label htmlFor={`coilInletWetBulb-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].coilInletWetBulb}</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={unit.coilInletWetBulb}
                            onChange={(e) => handleInputChange(unit.id, 'coilInletWetBulb', e.target.value === '' ? '' : Number(e.target.value))}
                            className={
                              unit.coilInletWetBulb === INITIAL_COIL_INLET_WET_BULB && typeof unit.coilInletWetBulb === 'number'
                                ? 'text-gray-500'
                                : 'text-gray-900'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1 mt-2">
                  <h4 className="text-base font-semibold text-gray-600 mb-2">{text[lang].powerLoadInfo}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`fullCapacity-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].fullCapacity}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={unit.fullCapacity}
                        onChange={(e) => handleInputChange(unit.id, 'fullCapacity', e.target.value === '' ? '' : Number(e.target.value))}
                        className={unit.fullCapacity === provinceDataMap[unit.province]?.fullCapacity && typeof unit.fullCapacity === 'number' ? 'text-gray-500' : 'text-gray-900'}
                      />
                    </div>

                    <div>
                      <label htmlFor={`halfCapacity-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].halfCapacity}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={unit.halfCapacity}
                        onChange={(e) => handleInputChange(unit.id, 'halfCapacity', e.target.value === '' ? '' : Number(e.target.value))}
                        className={unit.halfCapacity === provinceDataMap[unit.province]?.halfCapacity && typeof unit.halfCapacity === 'number' ? 'text-gray-500' : 'text-gray-900'}
                      />
                    </div>

                    {unit.calculationType === 'fixed' && (
                      <div>
                        <label htmlFor={`fullPowerFixed-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].fullPowerFixed}</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={unit.fullPowerFixed}
                          onChange={(e) => handleInputChange(unit.id, 'fullPowerFixed', e.target.value === '' ? '' : Number(e.target.value))}
                          className={unit.fullPowerFixed === provinceDataMap[unit.province]?.fullPowerFixed && typeof unit.fullPowerFixed === 'number' ? 'text-gray-500' : 'text-gray-900'}
                        />
                      </div>
                    )}

                    {unit.calculationType === 'variable' && (
                      <>
                        <div>
                          <label htmlFor={`fullPowerVariable-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].fullPowerVariable}</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={unit.fullPowerVariable}
                            onChange={(e) => handleInputChange(unit.id, 'fullPowerVariable', e.target.value === '' ? '' : Number(e.target.value))}
                            className={unit.fullPowerVariable === provinceDataMap[unit.province]?.fullPowerVariable && typeof unit.fullPowerVariable === 'number' ? 'text-gray-500' : 'text-gray-900'}
                          />
                        </div>

                        <div>
                          <label htmlFor={`halfPowerVariable-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].halfPowerVariable}</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={unit.halfPowerVariable}
                            onChange={(e) => handleInputChange(unit.id, 'halfPowerVariable', e.target.value === '' ? '' : Number(e.target.value))}
                            className={unit.halfPowerVariable === provinceDataMap[unit.province]?.halfPowerVariable && typeof unit.halfPowerVariable === 'number' ? 'text-gray-500' : 'text-gray-900'}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor={`designCoolingLoad-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].designCoolingLoad}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={unit.designCoolingLoad}
                        onChange={(e) => handleInputChange(unit.id, 'designCoolingLoad', e.target.value === '' ? '' : Number(e.target.value))}
                        className={unit.designCoolingLoad === provinceDataMap[unit.province]?.designCoolingLoad && typeof unit.designCoolingLoad === 'number' ? 'text-gray-500' : 'text-gray-900'}
                      />
                    </div>
                  </div>
                </div>

                {unit.calculationType === 'variable' && (
                  <div className="space-y-2 mt-3">
                    <label htmlFor={`investmentCost-${unit.id}`} className="text-sm font-medium leading-none">{text[lang].investmentCostLabel}</label>
                    <Input
                      type="number"
                      step="0.01"
                      id={`investmentCost-${unit.id}`}
                      value={unit.investmentCost}
                      onChange={(e) => handleInputChange(unit.id, 'investmentCost', e.target.value === '' ? '' : Number(e.target.value))}
                      className={unit.investmentCost === 0 && typeof unit.investmentCost === 'number' ? 'text-gray-500' : 'text-gray-900'}
                    />
                  </div>
                )}
                </div> 
                )}
              </div>
            ))}

            <Button onClick={handleAddUnit} disabled={acUnits.length >= 3} className=" w-full  flex items-center justify-center gap-3 text-sm">
              <PlusCircle className="w-8 h-8" /> {text[lang].addUnit}
            </Button>
            <Button onClick={handleCalculateAll} disabled={acUnits.some(unit => unit.isLoading)} className="w-full text-sm"> 
              {acUnits.some(unit => unit.isLoading) ? text[lang].calculatingAll : text[lang].calculateAll}
            </Button>
            <Button variant="outline" onClick={handleClearResults} className="w-full text-sm">
              {text[lang].clearAll}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-1">
        <Card className='bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-200'>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-600">{text[lang].resultsTitle}</CardTitle>
            <hr className="my-6" />
          </CardHeader>
          <CardContent>
            {acUnits.some(unit => unit.isLoading) && <p className="text-base text-blue-500">{text[lang].loadingResults}</p>}
            {acUnits.some(unit => unit.error) && <p className="text-base text-red-500">{text[lang].calculationFailed}</p>}

            {acUnits.every(unit => !unit.isLoading && !unit.error && !unit.results) && (
              <p className="text-base text-gray-600">{text[lang].enterInputs}</p>
            )}

           
            {acUnits.some(unit => unit.results) && (
              <>
                
                <h2 className="text-lg font-semibold text-gray-600 mb-4 ">{text[lang].comparisonSpecs}</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                      <label className="text-sm font-medium leading-none mb-3 block text-gray-600">{text[lang].selectUnit1}</label>
                      <Select
                        value={comparedUnitIds[0]}
                        onValueChange={(value) => handleComparisonSelection(value, 0)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={text[lang].selectUnit1} />
                        </SelectTrigger>
                        <SelectContent>
                          {acUnits.filter(unit => unit.results).map(unit => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm font-medium text-gray-600 md:mt-6"> 
                      {text[lang].comparisonConnector}
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium leading-none mb-6 block"></label>
                      <Select
                        value={comparedUnitIds[1]}
                        onValueChange={(value) => handleComparisonSelection(value, 1)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={text[lang].selectUnit2} />
                        </SelectTrigger>
                        <SelectContent>
                          {acUnits.filter(unit => unit.results).map(unit => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {canCompare && comparisonSavings ? (
                    <Card className="mt-2 bg-white  shadow-lg font-bold">
                      <CardContent className="space-y-3 pt-3">
                        
                        {(() => {
                          const type = getComparisonType();
                          
                          const unit1Cost = unit1ToCompare.calculationType === 'fixed'
                            ? unit1ToCompare.results.fixed.cost
                            : unit1ToCompare.results.variable.cost;
                          const unit2Cost = unit2ToCompare.calculationType === 'fixed'
                            ? unit2ToCompare.results.fixed.cost
                            : unit2ToCompare.results.variable.cost;

                         
                          const unit1Saving = unit1ToCompare.results.savings?.cost || 0;
                          const unit2Saving = unit2ToCompare.results.savings?.cost || 0;

                          
                          const unit1SavingPercent = unit1ToCompare.results.savings?.energyPercent
                            ? (parseFloat(unit1ToCompare.results.savings.energyPercent) * 100).toFixed(1)
                            : null;
                          const unit2SavingPercent = unit2ToCompare.results.savings?.energyPercent
                            ? (parseFloat(unit2ToCompare.results.savings.energyPercent) * 100).toFixed(1)
                            : null;

                          return (
                            <div className="space-y-2 text-base">
                              <div>
                                <p className="font-bold text-gray-600 text-lg">{unit1ToCompare.name}:</p>
                                <div className="flex justify-between">
                                  <span className="text-gray-700">{text[lang].annualCost}</span>
                                  <span>{parseFloat(unit1Cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}฿</span>
                                </div>
                                {unit1ToCompare.calculationType === 'variable' && unit1Saving > 0 && (
                                  <div className="flex justify-between text-green-600 font-bold">
                                    <span>{text[lang].electricityCostSaving}</span>
                                    <span>{parseFloat(unit1Saving).toLocaleString(undefined, { maximumFractionDigits: 2 })}฿</span>
                                  </div>
                                )}
                                {unit1ToCompare.calculationType === 'variable' && unit1SavingPercent && (
                                   <div className="flex justify-between text-blue-600 font-bold">
                                     <span>{text[lang].savingEnergy}</span>
                                     <span>{unit1SavingPercent}%</span>
                                   </div>
                                )}
                              </div>

                              <hr className="my-2 border-gray-300"/>

                              <div>
                                <p className="font-bold text-gray-600 text-lg">{unit2ToCompare.name}:</p>
                                <div className="flex justify-between">
                                  <span className="text-gray-700 font-bold">{text[lang].annualCost}</span>
                                  <span>{parseFloat(unit2Cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}฿</span>
                                </div>
                                {unit2ToCompare.calculationType === 'variable' && unit2Saving > 0 && (
                                  <div className="flex justify-between font-bold text-green-600">
                                   
                                  </div>
                                )}
                                 {unit2ToCompare.calculationType === 'variable' && unit2SavingPercent && (
                                   <div className="flex justify-between text-blue-600">
                                     
                                   </div>
                                )}
                              </div>

                              <hr className="my-3 border-gray-300"/>

                              <div className="flex justify-between items-center text-xl font-bold text-blue-700 pt-1">
                                <span>{text[lang].costDifference}</span>
                                <span>{comparisonSavings.costDifference.toLocaleString(undefined, { maximumFractionDigits: 2 })}฿</span>
                              </div>
                              {comparisonSavings.paybackPeriod && (
                                <div className="flex justify-between items-center text-base font-semibold text-orange-600">
                                  <span>{text[lang].paybackPeriod}</span>
                                  <span>{comparisonSavings.paybackPeriod}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="text-base text-gray-500 mt-4">
                      {acUnits.filter(unit => unit.results).length < 2
                        ? text[lang].comparisonTip1
                        : (unit1ToCompare?.id === unit2ToCompare?.id && unit1ToCompare?.id !== ''
                          ? text[lang].comparisonTip2
                          : text[lang].comparisonTip3
                        )
                      }
                    </p>
                  )}

                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mb-2 mt-5">
          <span className="text-sm font-semibold text-gray-600 mr-1 mt-6">
            {text[lang].noteTitle}{' '}
            <p className='text-sm text-gray-600 font-normal'>
              {text[lang].noteContent}
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Compare;