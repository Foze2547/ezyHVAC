import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '../contexts/LanguageContext';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Ufactor from '../../public/Ufactor.png';
import tb from '../../public/tb.png';
import td from '../../public/td.png';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,} from "@/components/ui/tooltip";


import {
    Ruler, Sun, Calculator, Lightbulb, User, Home, Thermometer, Loader, ServerCrash,Shield,ImageIcon,
    Building, Divide, Wind, HardHat, MapPin, Eye, EyeOff, Trophy ,Printer,Grid2x2,BrickWall,Info,FileSpreadsheet,Square,SquareDashed,Backpack
} from 'lucide-react';

const languageData = {
    en: {
        pageTitle: "Cooling Load: RTS Method",
        projectInfo: "Project Information",
        projectName: "Project Name",
        projectNamePlaceholder: "e.g. Sukhumvit Condo Project",
        projectNameDesc: "Project name for calculation",
        buildingName: "Building Name",
        buildingNamePlaceholder: "e.g. Building A",
        buildingNameDesc: "Building name",
        roomName: "Room Name",
        roomNamePlaceholder: "e.g. Room 101",
        roomNameDesc: "Room or area name for calculation",
        date: "Date",
        city: "City/Province",
        cityPlaceholder: "Select City/Province",
        otherCityName: "Other City Name", 
        otherCityNamePlaceholder: "e.g. London", 
        otherCityNameDesc: "Enter city name if 'Other' is selected.", 
        oaCustomInputGuidance: "When 'Other' city is selected, manually enter 24 hourly values below.", 
        manualInputGuidance: "Weather data for Thailand in April is automatically populated. For all other locations and months, please enter outdoor weather data for the 21st day of the selected month.",
        hourlyWeatherProfile: "/Input Hourly Weather Profile",
        dateDesc: "date",
        roomDimension: "Room Dimension",
        length: "Length (m)",
        lengthPlaceholder: "e.g. 5",
        lengthDesc: "Length of the room",
        width: "Width (m)",
        widthPlaceholder: "e.g. 4",
        widthDesc: "Width of the room",
        ceilingHeight: "Ceiling Height (m)",
        altitude: "Altitude (m)",
        altitudePlaceholder: "e.g. 10",
        altitudeDesc: "Altitude above sea level.",
        ceilingHeightPlaceholder: "e.g. 2.7",
        ceilingHeightDesc: "Height from floor to ceiling",
        area: "Area (m²)",
        areaPlaceholder: "Auto-calculated",
        areaDesc: "Room area (Length x Width)",
        floorNo: "Floor No.",
        floorNoPlaceholder: "e.g. 1",
        floorNoDesc: "Floor number of the room",
        locationInfo: "Location & Room Information",
       
        customCityName: "Custom City Name",
        customCityNamePlaceholder: "e.g. London",
        customCityNameDesc: "Enter custom city name if 'Custom' is selected.",
        timeZone: "Time Zone",
        timeZoneDesc: "Find the correct UTC offset at ASHRAE Meteo",
        calMonth: "Month",
        calMonthPlaceholder: "Select Month",
        longitude: "Longitude",
        longitudePlaceholder: "e.g. 100.5",
        longitudeDesc: "Longitude of the location (degrees)",
        lonHemisphere: "Longitude Hemisphere",
        lonHemisphereDesc: "Hemisphere of Longitude",
        latitude: "Latitude",
        latitudePlaceholder: "e.g. 13.7",
        latitudeDesc: "Latitude of the location (degrees)",
        taub: "Beam  Optical Depth (τb)",
        taubPlaceholder: "e.g. 0.05",
        taud: "Diffuse Optical Depth (τd)",
        inputUsageProfile: "Input Usage Profile (%)",
        taudPlaceholder: "e.g. 0.05",
        roomTemp: "Desired Room Temperature (°C)",
        roomTempPlaceholder: "e.g. 24",
        roomTempDesc: "Desired Room temperature",
        roomHumidity: "Desired Room Relative Humidity (%)",
        roomHumidityPlaceholder: "e.g. 50",
        roomHumidityDesc: "Desired room relative humidity",
        pressure: "Pressure (Pa)",
        pressurePlaceholder: "e.g. 101325",
        pressureDesc: "Outdoor atmospheric pressure",
        ceiling: "Ceiling",
        floor: "Floor",
        partition: "Partition",
        cfpArea: "Area (m²)",
        cfpAreaPlaceholder: "e.g. 20",
        cfpAreaDesc: "Area of the surface",
        materialType: "Type of material",
        materialTypePlaceholder: "Select Material Type",
        materialTypeDesc: "Type of material",
        uFactorCTS: "U-factor (CTS)",
        uFactorCTSPlaceholder: "e.g. 0.2",
        uFactorCTSDesc: "U-factor of material (CTS) (manual input)",
        uFactorCFP: "U-factor(W/m².K)",
        uFactorCFPPlaceholder: "e.g. 0.3",
        uFactorCFPDesc: "U-factor of material (manual input)",
        tempDiff: "Temperature Difference",
        tempDiffPlaceholder: "e.g. 5",
        tempDiffDesc: "Temperature difference between zones",
        wall: "Wall",
        numberOfWalls: "Total Walls",
        numberOfWallsDesc: "Number of walls to consider",
        wallNum: "Wall",
        orientation: "Exposure",
        orientationPlaceholder: "Select Exposures",
        psi: "Surface azimuth(Ψ)",
        psiPlaceholder: "Auto",
        psiDesc: "Psi angle (Auto if not Custom)",
        numberOfPartitions: "Total Partitions",
        numberOfPartitionsDesc: "Number of partitions to consider.",
        partitionNum: "Partition ",
        wallType: "Wall Type",
        wallTypePlaceholder: "Select Wall Type",
        wallTypeDesc: "Type of wall material",
        uFactor: "U-factor(W/m².K)",
        uFactorAutoDesc: "Auto (from Wall Type)",
        uFactorDesc: "Overall heat transfer coefficient of the wall",
        wallArea: "Wall Area (m²)",
        wallAreaPlaceholder: "e.g. 10",
        wallAreaDesc: "Area of the wall",
        surfaceColor: "Surface Color",
        surfaceColorPlaceholder: "Select Surface Color",
        surfaceColorDesc: "Surface color of the wall",
        alphaHo: "α/ho",
        alphaHoAutoDesc: "Auto (from Surface Color)",
        alphaHoDesc: "Absorptivity-to-convection coefficient ratio of the surface",
        interiorZone: "RTS Zone Type",
        interiorZonePlaceholder: "Select Nonsolar RTS Zone",
        interiorZoneDesc: "Type of interior zone",
        window: "Window",
        numberOfWindows: "Total Windows",
        numberOfWindowsDesc: "Number of windows to consider",
        windowNum: "Window ",
        glassType: "Glass Type",
        glassTypePlaceholder: "Select Glass Type",
        glassTypeDesc: "Type of glass",
        blinds: "Blinds",
        blindsPlaceholder: "With/Without Blinds",
        blindsDesc: "Presence of blinds",
        uFactorManualPlaceholder: "e.g. 3.0",
        uFactorManualDesc: "Overall heat transfer coefficient of the glass (manual input)",
        shgc: "SHGC",
        shgcAutoDesc: "Auto (from Glass Type)",
        shgcDesc: "Solar Heat Gain Coefficient",
        sc: "SC",
        scAutoDesc: "Auto (from Glass Type)",
        scDesc: "Shading Coefficient",
        windowArea: "Window Area (m²)",
        windowAreaPlaceholder: "e.g. 2",
        windowAreaDesc: "Area of the window",
        solarRTSZone: "Solar RTS Zone",
        solarRTSZonePlaceholder: "Select Solar RTS Zone",
        solarRTSZoneDesc: "Solar Radiation Time Series zone type",
        blindsWarning: "Solar RTS Zone will be ignored when blinds are selected.",
        overallSummary: "Overall Summary",
        projectDetails: "Project Details",
        peakLoadByComponent: "Peak Load by Component",
        totalDailyLoadByComponent: "Total Daily Load by Component",
        oaFlowRateTooltip: "Use the CO2 Calculator to help estimate the required outside air flow rate",
        roof: "Roof",
        roofType: "Roof Type",
        roofTypePlaceholder: "Select Roof Type",
        roofTypeDesc: "Type of roof",
        roofUFactorAutoDesc: "Auto (from Roof Type)",
        roofUFactorDesc: "Overall heat transfer coefficient of the roof",
        roofArea: "Roof Area (m²)",
        roofAreaPlaceholder: "e.g. 20",
        roofAreaDesc: "Area of the roof",
        surfaceAngle: "Surface Angle (Σ)",
        surfaceAnglePlaceholder: "e.g. 0 (for horizontal)",
        surfaceAngleDesc: "Tilt angle of the surface (in degrees, 0 for horizontal)",
        people: "People",
        peopleCount: "Occupancy",
        peopleCountPlaceholder: "e.g. 4",
        peopleCountDescLink: "Please use the <a href='https://roongzaa007.github.io/CO2_Calculator_V1.1.0/' target='_blank' rel='noopener noreferrer' class='text-blue-500 underline'>CO2 Calculator</a> to determine the number of people and input here.",
        peopleCountDesc: "Number of occupants in the room",
        activity: "Activity level",
        activityPlaceholder: "Select Activity",
        activityDesc: "Activity level of occupants",
        peopleScheduleDesc: "Occupancy schedule per hour (0-100%)",
        lighting: "Lighting",
        lightHeatGain: "Lighting (Watts)",
        lightHeatGainPlaceholder: "e.g. 100",
        lightHeatGainDesc: "Heat emitted from lighting equipment (manual input)",
        lightingScheduleDesc: "Lighting usage schedule per hour (0-100%)",
        equipments: "Equipments",
        sensibleHeat: "Sensible Heat Input (Watts)",
        latentHeat: "Latent Heat Input (Watts)",
        latentHeatPlaceholder: "e.g. 50",
        latentHeatDesc: "Latent heat emitted from equipment (manual input)",
        coolingType: "Type of Cooling",
        coolingTypePlaceholder: "Select Cooling Type",
        lighthingoption: "select Option",
        coolingTypeDesc: "Type of cooling used by the equipment",
        equipmentScheduleDesc: "Equipment usage schedule per hour (0-100%)",
        outsideAir: "Ventilation",
        ttt: "You can find the correct Time Zone on the website.",
        outdoor: "Outdoor Air",
        
        oaFlowRate: "Outside Air Flow rate (L/s)",
        oaFlowRateDescLink: "Please use the <a href='https://roongzaa007.github.io/CO2_Calculator_V1.1.0/' target='_blank' rel='noopener noreferrer' class='text-blue-500 underline'>CO2 Calculator</a> to determine the flow rate and input here.",
        oaFlowRateDesc: "Outside air flow rate",
        oaHourlyTemp: "Outside Air Temperature",
        oaHourlyHumidity: "Relative Humidity",
        oaHourlyTempDesc: "Outdoor air dry-bulb temperature for each hour.",
        oaHourlyHumidityDesc: "Outdoor air relative humidity for each hour.",
       
        calculateButton: "Calculate",
        calculatingButton: "Calculating...",
        errorCardTitle: "Error",
        peakCoolingLoad: "Peak Cooling Load",
        watts: "Watts",
        timeOfPeakLoad: "Time of Peak Load",
        lst: "LST",
        designLoadSummary: "Design Cooling Load Summary",
        componentLoadDetails: "Component Load Details",
        selectHourToView: "Select Hour to View",
        noDataForSelectedHour: "No data for selected hour in",
        hideProfile: "Hide",
        showProfile: "Show",
        profile: "Profile",
        country: "Country",
        peopleProfile: "People Profile",
        lightingProfile: "Lighting Profile",
        equipmentsProfile: "Equipments Profile",
        outsideairtempProfile: "Outside Air Temperature Profile",
        outsideairhumidityProfile: "Outside Air Humidity Profile",
        hour: "Hour",
        usageProfile: "Usage Profile (%)",
        airusageProfileDesc: "Ventilation usage schedule per hour (0-100%)",
        LType: "Type",
        LTypePlaceholder: "select Lighting Option",
        LTypeDesc: "Lighting Option",
        exportPdfButton: "Export to PDF",
        peopleCountTooltip: "Use the CO2 Calculator to estimate the appropriate number of people for your space:",
        exportExcelButton: "Export to Excel",
        
    },
    th: {
        pageTitle: "คำนวณภาระการทำความเย็น: แบบ RTS",
        exportExcelButton: "ส่งออกเป็น Excel",
        exportPdfButton: "ส่งออกเป็น PDF",
        peopleCountTooltip: "สามารถใช้ CO2 Calculator เพื่อช่วยประเมินจำนวนคนที่เหมาะสมสำหรับพื้นที่ของคุณได้ที่",
        projectInfo: "ข้อมูลโครงการ",
        projectName: "ชื่อโครงการ",
        projectNamePlaceholder: "เช่น โครงการคอนโดสุขุมวิท",
        projectNameDesc: "ชื่อโครงการสำหรับการคำนวณ",
        ttt: "คุณสามารถค้นหา Time Zone ที่ถูกต้องได้จากเว็บไซต์",
        buildingName: "ชื่ออาคาร",
        buildingNamePlaceholder: "เช่น อาคาร A",
        buildingNameDesc: "ชื่ออาคาร",
        roomName: "ชื่อห้อง",
        roomNamePlaceholder: "เช่น ห้อง 101",
        roomNameDesc: "ชื่อห้องหรือพื้นที่สำหรับคำนวณ",
        date: "วันที่",
         altitude: "ความสูง (ม.)",
         manualInputGuidance: "ข้อมูลสภาพอากาศจะถูกกรอกอัตโนมัติสำหรับเดือนเมษายนเท่านั้น สำหรับเดือนอื่นๆ กรุณาป้อนข้อมูลรายชั่วโมงด้วยตนเองให้ตรงกับวันที่ 21 ของเดือนที่คำนวณ",
        altitudePlaceholder: "เช่น 10",
        altitudeDesc: "ความสูงจากระดับน้ำทะเล",
        dateDesc: "วันที่คำนวณ",
        roomDimension: "ขนาดห้อง",
        length: "ความยาว (ม.)",
        numberOfPartitions: "จำนวนผนังกั้นห้อง",
        numberOfPartitionsDesc: "จำนวนผนังกั้นห้องที่ต้องการคำนวณ",
        city: "เมือง/จังหวัด",
        cityPlaceholder: "เลือกเมือง/จังหวัด",
        otherCityName: "ชื่อเมือง (อื่นๆ)", 
        otherCityNamePlaceholder: "เช่น ลอนดอน", 
        otherCityNameDesc: "ป้อนชื่อเมืองเองหากเลือก 'อื่นๆ'", 
        airusageProfileDesc: 'ตารางการใช้ระบบระบายอากาศต่อชั่วโมง (0-100%)',
        oaCustomInputGuidance: "เมื่อเลือกเมือง 'อื่นๆ' ให้ป้อนค่ารายชั่วโมง 24 ค่าด้านล่างด้วยตนเอง", 
        
        hourlyWeatherProfile: "โปรไฟล์สภาพอากาศรายชั่วโมง", 
        partitionNum: "ผนังกั้นห้อง ",
        lengthPlaceholder: "เช่น 5",
        lengthDesc: "ความยาวของห้อง",
        width: "ความกว้าง (ม.)",
        widthPlaceholder: "เช่น 4",
        widthDesc: "ความกว้างของห้อง",
        ceilingHeight: "ความสูงฝ้า (ม.)",
        ceilingHeightPlaceholder: "เช่น 2.7",
        ceilingHeightDesc: "ความสูงจากพื้นถึงฝ้าเพดาน",
        area: "พื้นที่ (ตร.ม.)",
        areaPlaceholder: "คำนวณอัตโนมัติ",
        areaDesc: "พื้นที่ห้อง (ความยาว x ความกว้าง)",
        floorNo: "ชั้นที่",
        floorNoPlaceholder: "เช่น 1",
        floorNoDesc: "หมายเลขชั้นของห้อง",
        locationInfo: "ข้อมูลที่ตั้งและห้อง",
        country: "ประเทศ",
       
        customCityName: "ชื่อเมือง (กำหนดเอง)",
        customCityNamePlaceholder: "เช่น ลอนดอน",
        customCityNameDesc: "ป้อนชื่อเมืองเองหากเลือก 'กำหนดเอง'",
        timeZone: "เขตเวลา (Time Zone)",
        timeZoneDesc: "ค้นหาค่า Time Zone (UTC offset) ที่ถูกต้องสำหรับตำแหน่งของคุณจาก ASHRAE Meteo",
        calMonth: "เดือนที่คำนวณ",
        calMonthPlaceholder: "เลือกเดือน",
        longitude: "ลองจิจูด",
        longitudePlaceholder: "เช่น 100.5",
        longitudeDesc: "ลองจิจูดของที่ตั้ง (องศา)",
        lonHemisphere: "ซีกโลกของลองจิจูด",
        lonHemisphereDesc: "ซีกโลกของลองจิจูด",
        latitude: "ละติจูด",
        latitudePlaceholder: "เช่น 13.7",
        latitudeDesc: "ละติจูดของที่ตั้ง (องศา)",
        taub: "Beam  Optical Depth (τb)",
        taubPlaceholder: "เช่น 0.05",
        taud: "Diffuse Optical Depth (τd)",
        taubDesc: "ค่าการส่องผ่านสำหรับรังสีตรง ",
        taudPlaceholder: "เช่น 0.05",
        taudDesc: "ค่าการส่องผ่านสำหรับรังสีกระจาย ",
        roomTemp: "อุณหภูมิห้อง (°C)",
        roomTempPlaceholder: "เช่น 24",
        roomTempDesc: "อุณหภูมิห้องที่ต้องการ",
        roomHumidity: "ความชื้นห้อง (%)",
        roomHumidityPlaceholder: "เช่น 50",
        roomHumidityDesc: "ความชื้นสัมพัทธ์ในห้องที่ต้องการ",
        pressure: "ความดัน (Pa)",
        pressurePlaceholder: "เช่น 101325",
        pressureDesc: "ความดันบรรยากาศภายนอก",
        ceiling: "ฝ้าเพดาน",
        floor: "พื้น",
        partition: "ผนังกั้นห้อง",
        cfpArea: "พื้นที่ (ตร.ม.)",
        cfpAreaPlaceholder: "เช่น 20",
        cfpAreaDesc: "พื้นที่ของพื้นผิว",
        materialType: "ประเภทวัสดุ",
        materialTypePlaceholder: "เลือกประเภทวัสดุ",
        materialTypeDesc: "ประเภทของวัสดุ",
        uFactorCTS: "U-factor (CTS)",
        uFactorCTSPlaceholder: "เช่น 0.2",
        uFactorCTSDesc: "U-factor ของวัสดุ (CTS) (ป้อนเอง)",
        uFactorCFP: "U-factor",
        uFactorCFPPlaceholder: "เช่น 0.3",
        uFactorCFPDesc: "U-factor ของวัสดุ (ป้อนเอง)",
        tempDiff: "ผลต่างอุณหภูมิ",
        tempDiffPlaceholder: "เช่น 5",
        tempDiffDesc: "ผลต่างอุณหภูมิระหว่างโซน",
        wall: "ผนัง",
        numberOfWalls: "จำนวนผนัง",
        numberOfWallsDesc: "จำนวนผนังที่ต้องการคำนวณ",
        wallNum: "ผนัง",
        orientation: "ทิศ",
        orientationPlaceholder: "เลือกทิศ",
        psi: "ทิศทางพื้นผิว(Ψ)",
        psiPlaceholder: "อัตโนมัติ",
        psiDesc: "มุม Psi (อัตโนมัติหากไม่ใช่ Custom)",
        wallType: "ประเภทผนัง",
        wallTypePlaceholder: "เลือกประเภทผนัง",
        wallTypeDesc: "ประเภทของวัสดุผนัง",
        uFactor: "U-factor(W/m².K)",
        uFactorAutoDesc: "อัตโนมัติ (จากประเภทผนัง)",
        uFactorDesc: "สัมประสิทธิ์การถ่ายเทความร้อนรวมของผนัง",
        wallArea: "พื้นที่ผนัง (ตร.ม.)",
        wallAreaPlaceholder: "เช่น 10",
        wallAreaDesc: "พื้นที่ของผนัง",
        surfaceColor: "สีพื้นผิว",
        surfaceColorPlaceholder: "เลือกสีพื้นผิว",
        surfaceColorDesc: "สีพื้นผิวของผนัง",
        alphaHo: "α/ho",
        alphaHoAutoDesc: "อัตโนมัติ (จากสีพื้นผิว)",
        alphaHoDesc: "อัตราส่วนความสามารถในการดูดกลืนต่อสัมประสิทธิ์การพาความร้อนของพื้นผิว",
        interiorZone: "โซนภายใน",
        interiorZonePlaceholder: "เลือกประเภทโซนภายใน",
        interiorZoneDesc: "ประเภทของโซนภายใน",
        window: "หน้าต่าง",
        numberOfWindows: "จำนวนหน้าต่าง",
        numberOfWindowsDesc: "จำนวนหน้าต่างที่ต้องการคำนวณ",
        windowNum: "หน้าต่าง",
        glassType: "ประเภทกระจก",
        glassTypePlaceholder: "เลือกประเภทกระจก",
        glassTypeDesc: "ประเภทของกระจก",
        blinds: "ม่าน",
        blindsPlaceholder: "มี/ไม่มีม่าน",
        blindsDesc: "การมีอยู่ของมู่ลี่",
        uFactorManualPlaceholder: "เช่น 3.0",
        uFactorManualDesc: "สัมประสิทธิ์การถ่ายเทความร้อนรวมของกระจก (ป้อนเอง)",
        shgc: "SHGC",
        shgcAutoDesc: "อัตโนมัติ (จากประเภทกระจก)",
        shgcDesc: "สัมประสิทธิ์การได้ความร้อนจากแสงอาทิตย์",
        sc: "SC",
        scAutoDesc: "อัตโนมัติ (จากประเภทกระจก)",
        scDesc: "สัมประสิทธิ์การบังแดด",
        windowArea: "พื้นที่หน้าต่าง (ตร.ม.)",
        windowAreaPlaceholder: "เช่น 2",
        windowAreaDesc: "พื้นที่ของหน้าต่าง",
        solarRTSZone: "โซน Solar RTS",
        solarRTSZonePlaceholder: "เลือกโซน Solar RTS",
        solarRTSZoneDesc: "ประเภทโซนของอนุกรมเวลารังสีดวงอาทิตย์",
        blindsWarning: "โซน Solar RTS จะถูกละเว้นเมื่อเลือกมู่ลี่",
        overallSummary: "สรุปภาพรวม",
        projectDetails: "รายละเอียดโครงการ",
        peakLoadByComponent: "ภาระสูงสุดตามองค์ประกอบ",
        totalDailyLoadByComponent: "ภาระรวมรายวันตามองค์ประกอบ",
        roof: "หลังคา",
        roofType: "ประเภทหลังคา",
        oaFlowRateTooltip: "สามารถใช้ CO2 Calculator เพื่อช่วยประเมินอัตราการไหลของอากาศภายนอกที่ต้องการได้",
        roofTypePlaceholder: "เลือกประเภทหลังคา",
        roofTypeDesc: "ประเภทของหลังคา",
        roofUFactorAutoDesc: "อัตโนมัติ (จากประเภทหลังคา)",
        roofUFactorDesc: "สัมประสิทธิ์การถ่ายเทความร้อนรวมของหลังคา",
        roofArea: "พื้นที่หลังคา (ตร.ม.)",
        roofAreaPlaceholder: "เช่น 20",
        roofAreaDesc: "พื้นที่ของหลังคา",
        surfaceAngle: "มุมพื้นผิว (Σ)",
        surfaceAnglePlaceholder: "เช่น 0 (สำหรับแนวนอน)",
        surfaceAngleDesc: "มุมเอียงของพื้นผิว (องศา, 0 สำหรับแนวนอน)",
        people: "บุคคล",
        peopleCount: "จำนวนคน",
        peopleCountPlaceholder: "เช่น 4",
        peopleCountDescLink: "โปรดใช้ <a href='https://roongzaa007.github.io/CO2_Calculator_V1.1.0/' target='_blank' rel='noopener noreferrer' class='text-blue-500 underline'>CO2 Calculator</a> เพื่อหาจำนวนคนแล้วนำมาป้อนที่นี่",
        peopleCountDesc: "จำนวนผู้ใช้อาคารในห้อง",
        activity: "กิจกรรม",
        activityPlaceholder: "เลือกกิจกรรม",
        activityDesc: "ระดับกิจกรรมของผู้ใช้อาคาร",
        peopleScheduleDesc: "ตารางการใช้งานรายชั่วโมง (0-100%)",
        lighting: "แสงสว่าง",
        lightHeatGain: "ความร้อนที่ได้รับ (วัตต์)",
        lightHeatGainPlaceholder: "เช่น 100",
        lightHeatGainDesc: "ความร้อนที่ปล่อยออกมาจากอุปกรณ์ให้แสงสว่าง (ป้อนเอง)",
        lightingScheduleDesc: "ตารางการใช้งานแสงสว่างรายชั่วโมง (0-100%)",
        equipments: "อุปกรณ์",
        sensibleHeat: "ความร้อนสัมผัส (วัตต์)",
        latentHeat: "ความร้อนแฝง (วัตต์)",
        latentHeatPlaceholder: "เช่น 50",
        latentHeatDesc: "ความร้อนแฝงที่ปล่อยออกมาจากอุปกรณ์ (ป้อนเอง)",
        inputUsageProfile: "โปรไฟล์การใช้งาน (%)",
        coolingType: "ประเภทการระบายความร้อน",
        coolingTypePlaceholder: "เลือกประเภทการระบายความร้อน",
        LType: "ประเภท",
        LTypePlaceholder: "เลือกตัวเลือกของแสงสว่าง",
        coolingTypeDesc: "ประเภทของการระบายความร้อนที่ใช้โดยอุปกรณ์",
        LTypeDesc: "ตัวเลือกของแสงสว่าง",
        equipmentScheduleDesc: "ตารางการใช้งานอุปกรณ์รายชั่วโมง (0-100%)",
        outsideAir: "การระบายอากาศ",
        outdoor: "อากาศภายนอก",
        oaFlowRate: "อัตราการไหลของอากาศภายนอก (ลบ.ม./วินาที)",
        oaFlowRateDescLink: "โปรดใช้ <a href='https://roongzaa007.github.io/CO2_Calculator_V1.1.0/' target='_blank' rel='noopener noreferrer' class='text-blue-500 underline'>CO2 Calculator</a> เพื่อหาอัตราการไหลแล้วนำมาป้อนที่นี่",
        oaFlowRateDesc: "อัตราการไหลของอากาศภายนอก",
        oaHourlyTemp: "อุณหภูมิอากาศภายนอกรายชั่วโมง",
        oaHourlyHumidity: "ความชื้นอากาศภายนอกรายชั่วโมง",
        oaHourlyTempDesc: "อุณหภูมิกระเปาะแห้งของอากาศภายนอกสำหรับแต่ละชั่วโมง",
        oaHourlyHumidityDesc: "ความชื้นสัมพัทธ์ของอากาศภายนอกสำหรับแต่ละชั่วโมง",
        calculateButton: "คำนวณ",
        calculatingButton: "กำลังคำนวณ...",
        errorCardTitle: "ข้อผิดพลาด",
        peakCoolingLoad: "ภาระการทำความเย็นสูงสุด",
        watts: "วัตต์",
        timeOfPeakLoad: "เวลาที่ภาระสูงสุด",
        lst: "LST",
        designLoadSummary: "สรุปภาระการทำความเย็นในการออกแบบ",
        componentLoadDetails: "รายละเอียดภาระตามองค์ประกอบ",
        selectHourToView: "เลือกชั่วโมงเพื่อดู",
        noDataForSelectedHour: "ไม่มีข้อมูลสำหรับชั่วโมงที่เลือกใน",
        hideProfile: "ซ่อน",
        showProfile: "แสดง",
        profile: "โปรไฟล์",
        peopleProfile: "โปรไฟล์บุคคล",
        lightingProfile: "โปรไฟล์แสงสว่าง",
        equipmentsProfile: "โปรไฟล์อุปกรณ์",
        outsideairtempProfile: "โปรไฟล์อุณหภูมิอากาศภายนอก",
        outsideairhumidityProfile: "โปรไฟล์ความชื้นอากาศภายนอก",
        hour: "ชั่วโมง",
        usageProfile: "โปรไฟล์การใช้งาน (%)"
    }
};



const FormCard = ({ title, icon, children, className }) => {
    return (
        <Card className={`shadow-lg border-gray-200 bg-white ${className}`}>
            <CardHeader className="bg-slate-50 p-3 rounded-t-lg border-b">
                <CardTitle className="flex items-center gap-3 text-slate-700 text-lg font-semibold">{icon}{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                {children}
            </CardContent>
        </Card>
    );
};

const ScheduleTable = ({ schedule, onScheduleChange, title, t }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleValueChange = (index, value) => {
        const newData = [...schedule];
        newData[index].usage = value;
        onScheduleChange(newData);
    };

    const getProfileTitle = (baseTitle) => {
        const lowerCaseTitle = baseTitle.toLowerCase().replace(/\s/g, '');
        return t[lowerCaseTitle + 'Profile'] || `${baseTitle} ${t.profile}`;
    };

    return (
        <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)} className="w-full flex items-center gap-2">
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isVisible ? `${t.hideProfile}/${t.inputUsageProfile}` : `${t.showProfile}/${t.inputUsageProfile}`}
            </Button>
            {isVisible && (
                <div className="mt-2 max-h-64 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-2">{t.hour}</th>
                                <th scope="col" className="px-4 py-2 w-[70%]">{t.inputUsageProfile || '/Input Usage Profile (%)'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((item, index) => {
                                const numericValue = parseInt(item.usage) || 0;
                                return (
                                    <tr key={item.hour} className="bg-white border-b">
                                        <td className="px-4 py-1.5 font-medium text-gray-900">{item.hour}</td>
                                        <td className="px-4 py-1.5">
                                            <div className="flex items-center gap-4">
                                                <Slider
                                                    value={[numericValue]}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(newValue) => onScheduleChange(index, `${newValue[0]}%`)}
                                                    className="w-full"
                                                />
                                                <Input
                                                    type="text"
                                                    value={item.usage}
                                                    onChange={(e) => onScheduleChange(index, e.target.value)}
                                                    className="h-8 w-20 text-center"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


const HourlyInputTable = ({ t, tempData, humidData, onTempChange, onHumidChange }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleTempValueChange = (index, value) => {
        const newData = [...tempData];
        newData[index] = parseFloat(value) || 0;
        onTempChange(newData);
    };
    
    const handleHumidValueChange = (index, value) => {
        const newData = [...humidData];
        newData[index] = parseFloat(value) || 0;
        onHumidChange(newData);
    };

    return (
        <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)} className="w-full flex items-center gap-2">
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isVisible ? `${t.hideProfile}${t.hourlyWeatherProfile}` : `${t.showProfile}${t.hourlyWeatherProfile}`}
            </Button>
            {isVisible && (
                <div className="mt-2 max-h-72 overflow-y-auto border rounded-lg shadow-inner">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 text-center">
                            <tr>
                                <th scope="col" className="px-4 py-2">{t.hour}</th>
                                <th scope="col" className="px-4 py-2">{t.oaHourlyTemp} (°C)</th>
                                <th scope="col" className="px-4 py-2">{t.oaHourlyHumidity} (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 24 }, (_, i) => i).map(index => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-1.5 font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-4 py-1.5">
                                        <Input
                                            type="number"
                                            value={tempData[index]}
                                            onChange={(e) => handleTempValueChange(index, e.target.value)}
                                            className="h-8 w-full text-center"
                                        />
                                    </td>
                                    <td className="px-4 py-1.5">
                                        <Input
                                            type="number"
                                            value={humidData[index]}
                                            onChange={(e) => handleHumidValueChange(index, e.target.value)}
                                            className="h-8 w-full text-center"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
const ResultsDisplay = ({
    t,
    categoryPeakLoads,
    categoryPeakSensibleLoads,
    categoryPeakLatentLoads,
    projectInfo,
    locationInfo,
    categoryDetails,
    roomDimension,
    safetyFactors,
    categoryHourlyLoads,
    projectHourlyTotalLoads,
    categoryCounts,
    categoryHourlySensibleLoads,
    categoryHourlyLatentLoads,
}) => {

    const formatNumber = (num) => {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatDecimal = (num, places = 2) => {
        if (typeof num !== 'number' || isNaN(num)) return (0).toFixed(places);
        return num.toFixed(places);
    };

    const displayOrder = ['windows', 'walls', 'roof', 'floors', 'partitions', 'ceilings', 'people', 'lighting', 'equipments', 'outdoor'];
    const categoryDisplayNames = { windows: 'Window', walls: 'Wall', roof: 'Roof', floors: 'Floor', partitions: 'Partition', ceilings: 'Ceiling', people: 'People', lighting: 'Lighting', equipments: 'Equipment', outdoor: 'Ventilation' };

    const handleExportPdf = () => {
        const element = document.getElementById('printable-results');
        if (!element) return;
        const fileName = `CoolingLoad_Summary_${projectInfo.projectName || 'Project'}.pdf`;
        const opt = { margin: 0.5, filename: fileName, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
        html2pdf().from(element).set(opt).save();
    };

    const handleExportExcel = () => {
        const headers = ['Hour', ...displayOrder.map(key => {
            const count = categoryCounts?.[key] || 0;
            const displayName = categoryDisplayNames[key] || key;
            return count > 0 ? `${displayName} (${count})` : displayName;
        }), 'Total Load'];

        const dataRows = Array.from({ length: 24 }, (_, i) => {
            const row = [i + 1];
            displayOrder.forEach(key => { row.push(categoryHourlyLoads[key]?.[i] || 0); });
            row.push(projectHourlyTotalLoads[i] || 0);
            return row;
        });

        const finalData = [headers, ...dataRows];
        const worksheet = XLSX.utils.aoa_to_sheet(finalData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cooling_Load_Data');
        const fileName = `CoolingLoad_Data_${projectInfo.projectName || 'Project'}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    if (!categoryPeakLoads || !projectInfo || !categoryHourlyLoads || !projectHourlyTotalLoads || !categoryHourlySensibleLoads || !categoryHourlyLatentLoads) {
        return null;
    }

    

    const peakHourIndex = projectHourlyTotalLoads.indexOf(Math.max(...projectHourlyTotalLoads));

    const totalZonePeakLoad = displayOrder.reduce((sum, key) => sum + (categoryPeakLoads[key] || 0), 0);
    const totalZoneSensible = displayOrder.reduce((sum, key) => sum + (categoryPeakSensibleLoads[key] || 0), 0);
    const totalZoneLatent = displayOrder.reduce((sum, key) => sum + (categoryPeakLatentLoads[key] || 0), 0);

    const ductSF = (safetyFactors.duct || 0) / 100;
    const overallSF = (safetyFactors.overall || 0) / 100;
    const ductHeatGainTotal = totalZonePeakLoad * ductSF;
    const ductHeatGainSensible = totalZoneSensible * ductSF;
    const ductHeatGainLatent = totalZoneLatent * ductSF;
    const subTotalTotal = totalZonePeakLoad + ductHeatGainTotal;
    const subTotalSensible = totalZoneSensible + ductHeatGainSensible;
    const subTotalLatent = totalZoneLatent + ductHeatGainLatent;
    const safetyLoadTotal = subTotalTotal * overallSF;
    const safetyLoadSensible = subTotalSensible * overallSF;
    const safetyLoadLatent = subTotalLatent * overallSF;

    const totalConditioningLoad = (projectHourlyTotalLoads[peakHourIndex] || 0) + ductHeatGainTotal + safetyLoadTotal;
    const totalSensibleLoad = displayOrder.reduce((sum, key) => sum + (categoryHourlySensibleLoads?.[key]?.[peakHourIndex] || 0), 0) + ductHeatGainSensible + safetyLoadSensible;
    const totalLatentLoad = displayOrder.reduce((sum, key) => sum + (categoryHourlyLatentLoads?.[key]?.[peakHourIndex] || 0), 0) + ductHeatGainLatent + safetyLoadLatent;


    const totalsensibleh = (totalSensibleLoad + totalLatentLoad) > 0 ? totalSensibleLoad / (totalSensibleLoad + totalLatentLoad) : 0;

    const rdisplayOrder = ['windows', 'walls', 'roof', 'floors', 'partitions', 'ceilings', 'people', 'lighting', 'equipments'];
    const totalrZoneDailySensible = rdisplayOrder.reduce((sum, key) => sum + (categoryPeakSensibleLoads[key] || 0), 0);
    const totalrZoneDailyLatent = rdisplayOrder.reduce((sum, key) => sum + (categoryPeakLatentLoads[key] || 0), 0);
    const roomsensibleh = (totalrZoneDailySensible + totalrZoneDailyLatent) > 0 ? totalrZoneDailySensible / (totalrZoneDailySensible + totalrZoneDailyLatent) : 0;

    const roomArea = parseFloat(roomDimension?.area) || 0;
    const wattsPerSqM = roomArea > 0 ? totalConditioningLoad / roomArea : 0;
    const btuPerHrSqM = wattsPerSqM * 3.41214;
    const btucl = totalConditioningLoad * 3.41214;

    const getMonthName = (monthNumber) => {
        const monthMap = { '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December' };
        return monthMap[monthNumber] || 'N/A';
    };
    const calculationMonth = getMonthName(locationInfo.calMonth);

    return (
        <div className="space-y-4">
            <FormCard title={t.designLoadSummary} icon={<Trophy className="text-amber-500" />}>
                <div className="flex justify-end mb-4 space-x-2">
                    <Button onClick={handleExportExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                        <FileSpreadsheet className="h-4 w-4" />
                        {t.exportExcelButton}
                    </Button>
                    <Button onClick={handleExportPdf} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white">
                        <Printer className="h-4 w-4" />
                        {t.exportPdfButton}
                    </Button>
                </div>
                <div id="printable-results" className="p-4 bg-white font-sans text-xs border border-gray-300">
                    <div className="grid grid-cols-4 gap-4 text-center mb-4 border-b pb-4">
                        <div><p className="text-slate-500 uppercase font-semibold text-xs">Total Cooling Load (W)</p><p className="text-2xl font-bold text-blue-600">{formatNumber(totalConditioningLoad)}</p></div>
                        <div><p className="text-slate-500 uppercase font-semibold text-xs">Total Cooling Load (Btu/h)</p><p className="text-2xl font-bold text-blue-600">{formatNumber(btucl)}</p></div>
                        <div><p className="text-slate-500 uppercase font-semibold text-xs">W/m²</p><p className="text-2xl font-bold text-blue-600">{formatDecimal(wattsPerSqM)}</p></div>
                        <div><p className="text-slate-500 uppercase font-semibold text-xs">Btu/h·m²</p><p className="text-2xl font-bold text-blue-600">{formatDecimal(btuPerHrSqM)}</p></div>
                    </div>

                    <div className="text-center mb-4"><h2 className="font-bold text-sm uppercase">Design Cooling Load Summary</h2></div>
                    <header className="flex justify-between mb-4 text-xs">
                         <div>
                            <p><strong>Project Name:</strong> {projectInfo.projectName || 'N/A'}</p>
                            <p><strong>Room name:</strong> {projectInfo.roomName || 'N/A'}</p>
                            <p><strong>Floor No:</strong> {roomDimension.floorNo || 'N/A'}</p>
                            <p><strong>Calculation Month:</strong> {calculationMonth}</p>
                            <p><strong>Location:</strong> {locationInfo.city || 'N/A'}</p>
                            <p><strong>Desired room temperature:</strong> {locationInfo.roomTemp || 'N/A'} °C</p>
                            <p><strong>Desired room humidity:</strong> {locationInfo.roomHumidity || 'N/A'} %</p>
                        </div>
                        <div className="text-right">
                            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</p>
                            <p><strong>Time:</strong> {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                        </div>
                    </header>

                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 p-2 text-left font-bold" rowSpan="2">DESIGN COOLING</th>
                                <th className="border border-gray-400 p-2 text-right font-bold" rowSpan="2">Details</th>
                                <th className="border border-gray-400 p-2 text-center font-bold" colSpan="3">LOADS (W)</th>
                            </tr>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 p-2 text-right font-bold">Total Load</th>
                                <th className="border border-gray-400 p-2 text-right font-bold">Sensible</th>
                                <th className="border border-gray-400 p-2 text-right font-bold">Latent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayOrder.map(key => {
                                const peakLoad = categoryHourlyLoads?.[key]?.[peakHourIndex] || 0;
                                const sensibleLoad = categoryHourlySensibleLoads?.[key]?.[peakHourIndex] || 0;
                                const latentLoad = categoryHourlyLatentLoads?.[key]?.[peakHourIndex] || 0;
                                const displayName = categoryDisplayNames[key] || key;
                                const detailItem = categoryDetails ? categoryDetails[key] : null;
                                let detailText = '-';
if (detailItem) {
    if (key === 'people') {
        detailText = `${formatNumber(detailItem.count || 0)} Persons`;
    } else if (key === 'lighting') { 
        detailText = `${formatNumber(detailItem.heatGain || 0)} W`;
    } else if (key === 'equipments') {
        const sensible = detailItem.sensible || 0;
        const latent = detailItem.latent || 0;
        if (sensible > 0 || latent > 0) {
            detailText = `S: ${formatNumber(sensible)} W / L: ${formatNumber(latent)} W`;
        }
    } else if (key === 'outdoor') {
        detailText = `${formatNumber(detailItem.flowRate || 0)} L/s`;
    } else if (detailItem.area) { 
        detailText = `${formatNumber(detailItem.area || 0)} m²`;
    }
}

                                return (
                                    <tr key={key}>
                                        <td className="border border-gray-400 p-2">{displayName}</td>
                                        <td className="border border-gray-400 p-2 text-right">{detailText}</td>
                                        <td className="border border-gray-400 p-2 text-right">{formatNumber(peakLoad)}</td>
                                        <td className="border border-gray-400 p-2 text-right">{formatNumber(sensibleLoad)}</td>
                                        <td className="border border-gray-400 p-2 text-right">{formatNumber(latentLoad)}</td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td className="border border-gray-400 p-2">Duct Loss</td>
                                <td className="border border-gray-400 p-2 text-right">{safetyFactors.duct}%</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(ductHeatGainTotal)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(ductHeatGainSensible)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(ductHeatGainLatent)}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-400 p-2">Overall Safety Factor</td>
                                <td className="border border-gray-400 p-2 text-right">{safetyFactors.overall}%</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(safetyLoadTotal)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(safetyLoadSensible)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(safetyLoadLatent)}</td>
                            </tr>
                            <tr><td colSpan="5" className="p-1"></td></tr>
                            <tr className="font-bold bg-blue-100 text-blue-800">
                                <td className="border border-gray-400 p-2" colSpan={2}>Design Total Cooling Load (W)</td>
                                <td className="border border-gray-400 p-2 text-center">{formatNumber(totalConditioningLoad)}</td>
                                <td className="border border-gray-400 p-2 text-center">{formatNumber(totalSensibleLoad)}</td>
                                <td className="border border-gray-400 p-2 text-center">{formatNumber(totalLatentLoad)}</td>
                            </tr>
                            <tr className="font-bold bg-yellow-100 text-yellow-800">
                                <td className="border border-gray-400 p-2" colSpan={2}>Room Sensible Heat Ratio (RSHR)</td>
                                <td colSpan={3} className="border border-gray-400 p-2 text-center">{isNaN(roomsensibleh) ? '0.00' : roomsensibleh.toFixed(2)}</td>
                            </tr>
                            <tr className="font-bold bg-yellow-100 text-yellow-800">
                                <td className="border border-gray-400 p-2" colSpan={2}>Total Sensible Heat Ratio (TSHR)</td>
                                <td colSpan={3} className="border border-gray-400 p-2 text-center">{isNaN(totalsensibleh) ? '0.00' : totalsensibleh.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </FormCard>
        </div>
    );
};


const CeilingInput = ({ t, data, onDataChange, materialTypeOptions, interiorZoneOptions ,  }) => {
    const handleInputChange = (field, value) => {
        onDataChange('ceilings', data.id, field, value);
    };
    return (
        <FormCard title={t.ceiling} icon={<SquareDashed />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs">{t.cfpArea}</Label>
                    <Input type="number" placeholder={t.cfpAreaPlaceholder} value={data.area} onChange={e => handleInputChange('area', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">{t.materialType}</Label>
                    <Select value={data.materialType} onValueChange={v => handleInputChange('materialType', v)}>
                        <SelectTrigger><SelectValue placeholder={t.materialTypePlaceholder} /></SelectTrigger>
                        <SelectContent>{materialTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
  <div className="flex items-center space-x-2 mt-2">
    <Label htmlFor={`uFactor-${data.id}`} className="text-xs">
      {t.uFactor}
    </Label>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://ufactor-calculator.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn more about U-Factor"
          >
            <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to calculate U-Factor.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <Input
    id={`uFactor-${data.id}`} 
    placeholder={t.uFactorAutoDesc}
    value={data.uFactor}
    onChange={e => onDataChange('ceilings', data.id, 'uFactor', e.target.value)}
  />
</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <Label className="text-xs mb-2">{t.tempDiff}</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 cursor-help text-gray-500 mb-0.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className = "text-blue-700"> 3°C  for adjacent to Genaral space ,
                                        -5°C for adjacent to Machine Room</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Input
                        type="number"
                        placeholder={t.tempDiffPlaceholder}
                        value={data.tempdiff}
                        onChange={e => handleInputChange('tempdiff', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">{t.interiorZone}</Label>
                    <Input
                        value={data.interiorZone}
                        readOnly
                        placeholder="Set from Location Info"
                        className="bg-slate-100"
                    />
                </div>
            </div>
        </FormCard>
    );
};
const FloorInput = ({ t, data, onDataChange, materialTypeOptions, interiorZoneOptions }) => {
    const handleInputChange = (field, value) => {
        onDataChange('floors', data.id, field, value);
    };
    return (
        <FormCard title={t.floor} icon={<Square />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs">{t.cfpArea}</Label>
                    <Input type="number" placeholder={t.cfpAreaPlaceholder} value={data.area} onChange={e => handleInputChange('area', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">{t.materialType}</Label>
                    <Select value={data.materialType} onValueChange={v => handleInputChange('materialType', v)}>
                        <SelectTrigger><SelectValue placeholder={t.materialTypePlaceholder} /></SelectTrigger>
                        <SelectContent>{materialTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
  <div className="flex items-center space-x-2 mt-2">
    <Label htmlFor="uFactor" className="text-xs">
      {t.uFactor}
    </Label>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://ufactor-calculator.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn more about U-Factor"
          >
            <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to calculate U-Factor.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <Input
    id="uFactor" 
    placeholder={t.uFactorAutoDesc}
    value={data.uFactor}
    onChange={e => handleInputChange('uFactor', e.target.value)}
  />
</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <Label className="text-xs mb-2">{t.tempDiff}</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 cursor-help text-gray-500 mb-0.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className = "text-blue-700"> 3°C  for adjacent to Genaral space ,
                                        -5°C for adjacent to Machine Room</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Input
                        type="number"
                        placeholder={t.tempDiffPlaceholder}
                        value={data.tempdiff}
                        onChange={e => handleInputChange('tempdiff', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">{t.interiorZone}</Label>
                    <Input
                        value={data.interiorZone}
                        readOnly
                        placeholder="Set from Location Info"
                        className="bg-slate-100"
                    />
                </div>
            </div>
        </FormCard>
    );
};
const PartitionInput = ({ t, data, onDataChange, materialTypeOptions, interiorZoneOptions }) => {
    const handleInputChange = (field, value) => {
        onDataChange('partitions', data.id, field, value);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
                <Label className="text-xs">{t.cfpArea}</Label>
                <Input type="number" placeholder={t.cfpAreaPlaceholder} value={data.area} onChange={e => handleInputChange('area', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">{t.materialType}</Label>
                <Select value={data.materialType} onValueChange={v => handleInputChange('materialType', v)}>
                    <SelectTrigger><SelectValue placeholder={t.materialTypePlaceholder} /></SelectTrigger>
                    <SelectContent>{materialTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
  <div className="flex items-center space-x-2 mt-2">
    <Label htmlFor={`uFactor-${data.id}`} className="text-xs">
      {t.uFactor}
    </Label>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://ufactor-calculator.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn more about U-Factor"
          >
            <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to calculate U-Factor.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <Input
    id={`uFactor-${data.id}`} 
    placeholder={t.uFactorAutoDesc}
    value={data.uFactor}
    onChange={e => onDataChange('partitions', data.id, 'uFactor', e.target.value)}
  />
</div>
            <div className="space-y-1">
                <div className="flex items-center gap-1">
                    <Label className="text-xs mb-2">{t.tempDiff}</Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 cursor-help text-gray-500 mb-0.5" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className = "text-blue-700"> 3°C  for adjacent to Genaral space ,
                                    -5°C for adjacent to Machine Room</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Input
                    type="number"
                    placeholder={t.tempDiffPlaceholder}
                    value={data.tempdiff}
                    onChange={e => handleInputChange('tempdiff', e.target.value)}
                />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">{t.interiorZone}</Label>
                <Input
                    value={data.interiorZone}
                    readOnly
                    placeholder="Set from Location Info"
                    className="bg-slate-100"
                />
            </div>
        </div>
    );
};
const CoolingLoad = ({ language = 'en' }) => { 
    const { lang, setLang } = useLanguage(); 
    const t = languageData[lang] || languageData.en;
    const initialSchedule = () => Array.from({ length: 24 }, (_, i) => {
        const hour = i + 1;
        const usage = (hour >= 8 && hour <= 17) ? '100%' : '0%';
        return { hour, usage };
    });
    const initialHourlyData = () => Array(24).fill(0);
    const orientations = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "Custom"];
    const psiValues = { N: 180, E: -90, S: 0, W: 90, NE: -135, SE: -45, SW: 45, NW: 135 };
    const comprehensiveLocationData = {
    "Bangkok": {
    "temp": [30.60, 30.57, 30.53, 30.50, 30.47, 30.43, 30.40, 32.00, 33.60, 35.20, 36.23, 37.27, 38.30, 38.53, 38.77, 39.00, 37.40, 35.80, 34.20, 33.50, 32.80, 32.10, 31.70, 31.30],
    "humid": [85.0, 84.7, 84.3, 84.0, 84.7, 85.3, 86.0, 73.7, 61.3, 49.0, 45.3, 41.7, 38.0, 38.7, 39.3, 40.0, 45.7, 51.3, 57.0, 63.0, 69.0, 75.0, 77.3, 79.7]
  },
  "Amnat Charoen": {
    "temp": [31.70, 31.13, 30.57, 30.00, 30.17, 30.33, 30.50, 31.63, 32.77, 33.90, 35.10, 36.30, 37.50, 37.90, 38.30, 38.70, 37.13, 35.57, 34.00, 33.47, 32.93, 32.40, 31.87, 31.33],
    "humid": [57.0, 59.0, 61.0, 63.0, 64.7, 66.3, 68.0, 64.0, 60.0, 56.0, 51.3, 46.7, 42.0, 42.0, 42.0, 42.0, 43.0, 44.0, 45.0, 49.0, 53.0, 57.0, 59.0, 61.0]
  },
  "Ang Thong": {
    "temp": [30.00, 29.83, 29.67, 29.50, 29.60, 29.70, 29.80, 31.20, 32.60, 34.00, 35.17, 36.33, 37.50, 37.97, 38.43, 38.90, 37.67, 36.43, 35.20, 34.40, 33.60, 32.80, 32.13, 31.47],
    "humid": [72.0, 77.0, 82.0, 87.0, 87.7, 88.3, 89.0, 78.3, 67.7, 57.0, 51.3, 45.7, 40.0, 38.3, 36.7, 35.0, 39.7, 44.3, 49.0, 51.7, 54.3, 57.0, 60.7, 64.3]
  },
  "Bueng Kan": {
    "temp": [26.60, 26.00, 25.40, 24.80, 24.90, 25.00, 25.10, 27.97, 30.83, 33.70, 35.30, 36.90, 38.50, 38.87, 39.23, 39.60, 37.57, 35.53, 33.50, 31.83, 30.17, 28.50, 27.93, 27.37],
    "humid": [83.0, 83.7, 84.3, 85.0, 86.3, 87.7, 89.0, 78.0, 67.0, 56.0, 50.0, 44.0, 38.0, 34.3, 30.7, 27.0, 34.7, 42.3, 50.0, 57.3, 64.7, 72.0, 74.7, 77.3]
  },
  "Buri Ram": {
    "temp": [30.80, 30.33, 29.87, 29.40, 29.40, 29.40, 29.40, 31.43, 33.47, 35.50, 36.40, 37.30, 38.20, 38.43, 38.67, 38.90, 37.27, 35.63, 34.00, 33.83, 33.67, 33.50, 32.33, 31.17],
    "humid": [60.0, 63.7, 67.3, 71.0, 70.7, 70.3, 70.0, 61.0, 52.0, 43.0, 39.7, 36.3, 33.0, 31.7, 30.3, 29.0, 32.0, 35.0, 38.0, 39.3, 40.7, 42.0, 44.7, 47.3]
  },
  "Chachoengsao": {
    "temp": [28.00, 27.73, 27.47, 27.20, 27.13, 27.07, 27.00, 29.17, 31.33, 33.50, 34.67, 35.83, 37.00, 37.43, 37.87, 38.30, 36.53, 34.77, 33.00, 31.67, 30.33, 29.00, 28.67, 28.33],
    "humid": [92.0, 92.7, 93.3, 94.0, 95.0, 96.0, 97.0, 87.0, 77.0, 67.0, 59.3, 51.7, 44.0, 41.7, 39.3, 37.0, 45.7, 54.3, 63.0, 71.0, 79.0, 87.0, 89.3, 91.7]
  },
  "Chai Nat": {
    "temp": [30.50, 29.83, 29.17, 28.50, 28.50, 28.50, 28.50, 30.57, 32.63, 34.70, 35.90, 37.10, 38.30, 38.77, 39.23, 39.70, 38.40, 37.10, 35.80, 34.70, 33.60, 32.50, 31.77, 31.03],
    "humid": [65.0, 71.7, 78.3, 85.0, 84.3, 83.7, 83.0, 70.7, 58.3, 46.0, 43.3, 40.7, 38.0, 37.0, 36.0, 35.0, 40.0, 45.0, 50.0, 54.7, 59.3, 64.0, 64.0, 64.0]
  },
  "Chaiyaphum": {
    "temp": [28.80, 28.47, 28.13, 27.80, 28.23, 28.67, 29.10, 30.90, 32.70, 34.50, 36.23, 37.97, 39.70, 39.93, 40.17, 40.40, 38.90, 37.40, 35.90, 34.67, 33.43, 32.20, 30.97, 29.73],
    "humid": [53.0, 56.7, 60.3, 64.0, 66.0, 68.0, 70.0, 63.0, 56.0, 49.0, 43.7, 38.3, 33.0, 31.0, 29.0, 27.0, 29.0, 31.0, 33.0, 37.3, 41.7, 46.0, 48.7, 51.3]
  },
  "Chanthaburi": {
    "temp": [30.00, 29.83, 29.67, 29.50, 29.63, 29.77, 29.90, 31.27, 32.63, 34.00, 34.33, 34.67, 35.00, 34.80, 34.60, 34.40, 33.53, 32.67, 31.80, 31.37, 30.93, 30.50, 30.00, 29.50],
    "humid": [84.0, 84.3, 84.7, 85.0, 84.0, 83.0, 82.0, 75.3, 68.7, 62.0, 60.3, 58.7, 57.0, 59.0, 61.0, 63.0, 66.7, 70.3, 74.0, 76.3, 78.7, 81.0, 82.7, 84.3]
  },
  "Chiang Mai": {
    "temp": [29.8, 29.0, 28.1, 27.3, 27.2, 27.1, 27.0, 29.3, 31.6, 33.9, 35.3, 36.7, 38.1, 38.6, 39.2, 39.7, 38.1, 36.5, 34.9, 34.3, 33.6, 33.0, 31.9, 30.9],
    "humid": [60.0, 63.3, 66.7, 70.0, 70.7, 71.3, 72.0, 64.7, 57.3, 50.0, 45.3, 40.7, 36.0, 33.0, 30.0, 27.0, 32.0, 37.0, 42.0, 43.0, 44.0, 45.0, 49.0, 53.0]
  },
  "Chiang Rai": {
    "temp": [27.30, 26.37, 25.43, 24.50, 24.27, 24.03, 23.80, 26.37, 28.93, 31.50, 33.17, 34.83, 36.50, 36.83, 37.17, 37.50, 36.33, 35.17, 34.00, 32.27, 30.53, 28.80, 27.87, 26.93],
    "humid": [79.0, 80.3, 81.7, 83.0, 83.0, 83.0, 83.0, 73.7, 64.3, 55.0, 49.3, 43.7, 38.0, 36.0, 34.0, 32.0, 36.7, 41.3, 46.0, 49.0, 52.0, 55.0, 60.3, 65.7]
  },
  "Chon Buri": {
    "temp": [30.10, 30.07, 30.03, 30.00, 30.20, 30.40, 30.60, 31.97, 33.33, 34.70, 35.30, 35.90, 36.50, 36.83, 37.17, 37.50, 36.73, 35.97, 35.20, 34.13, 33.07, 32.00, 31.50, 31.00],
    "humid": [85.0, 84.0, 83.0, 82.0, 81.7, 81.3, 81.0, 74.3, 67.7, 61.0, 57.3, 53.7, 50.0, 46.7, 43.3, 40.0, 40.3, 40.7, 41.0, 47.0, 53.0, 59.0, 64.3, 69.7]
  },
  "Chumphon": {
    "temp": [29.30, 29.03, 28.77, 28.50, 28.50, 28.50, 28.50, 30.17, 31.83, 33.50, 34.57, 35.63, 36.70, 36.17, 35.63, 35.10, 33.97, 32.83, 31.70, 31.10, 30.50, 29.90, 29.43, 28.97],
    "humid": [84.0, 85.3, 86.7, 88.0, 88.0, 88.0, 88.0, 80.3, 72.7, 65.0, 59.0, 53.0, 47.0, 52.0, 57.0, 62.0, 64.7, 67.3, 70.0, 72.7, 75.3, 78.0, 80.3, 82.7]
  },
  "Kalasin": {
    "temp": [30.00, 29.47, 28.93, 28.40, 28.53, 28.67, 28.80, 30.73, 32.67, 34.60, 36.03, 37.47, 38.90, 39.40, 39.90, 40.40, 38.67, 36.93, 35.20, 33.63, 32.07, 30.50, 29.77, 29.03],
    "humid": [68.0, 70.0, 72.0, 74.0, 73.3, 72.7, 72.0, 65.0, 58.0, 51.0, 46.3, 41.7, 37.0, 34.3, 31.7, 29.0, 37.7, 46.3, 55.0, 62.0, 69.0, 76.0, 79.3, 82.7]
  },
  "Kamphaeng Phet": {
    "temp": [29.20, 28.43, 27.67, 26.90, 26.87, 26.83, 26.80, 29.80, 32.80, 35.80, 37.17, 38.53, 39.90, 40.03, 40.17, 40.30, 38.93, 37.57, 36.20, 34.63, 33.07, 31.50, 30.83, 30.17],
    "humid": [66.0, 68.0, 70.0, 72.0, 74.7, 77.3, 80.0, 67.7, 55.3, 43.0, 40.0, 37.0, 34.0, 31.0, 28.0, 25.0, 33.0, 41.0, 49.0, 53.0, 57.0, 61.0, 63.3, 65.7]
  },
  "Kanchanaburi": {
    "temp": [31.20, 30.60, 30.00, 29.40, 29.43, 29.47, 29.50, 31.47, 33.43, 35.40, 37.00, 38.60, 40.20, 40.53, 40.87, 41.20, 40.03, 38.87, 37.70, 36.47, 35.23, 34.00, 33.33, 32.67],
    "humid": [61.0, 62.0, 63.0, 64.0, 65.3, 66.7, 68.0, 60.7, 53.3, 46.0, 42.3, 38.7, 35.0, 34.0, 33.0, 32.0, 35.0, 38.0, 41.0, 42.7, 44.3, 46.0, 50.7, 55.3]
  },
  "Khon Kaen": {
    "temp": [29.00, 28.50, 28.00, 27.50, 27.67, 27.83, 28.00, 30.63, 33.27, 35.90, 37.27, 38.63, 40.00, 39.83, 39.67, 39.50, 38.30, 37.10, 35.90, 34.83, 33.77, 32.70, 31.83, 30.97],
    "humid": [68.0, 68.3, 68.7, 69.0, 65.3, 61.7, 58.0, 52.3, 46.7, 41.0, 37.3, 33.7, 30.0, 30.3, 30.7, 31.0, 32.7, 34.3, 36.0, 39.0, 42.0, 45.0, 48.3, 51.7]
  },
  "Krabi": {
    "temp": [26.40, 26.50, 26.60, 26.70, 26.67, 26.63, 26.60, 28.00, 29.40, 30.80, 32.17, 33.53, 34.90, 35.13, 35.37, 35.60, 34.33, 33.07, 31.80, 31.10, 30.40, 29.70, 29.33, 28.97],
    "humid": [97.0, 97.3, 97.7, 98.0, 97.3, 96.7, 96.0, 90.0, 84.0, 78.0, 71.3, 64.7, 58.0, 58.7, 59.3, 60.0, 64.7, 69.3, 74.0, 77.0, 80.0, 83.0, 85.0, 87.0]
  },
  "Lampang": {
    "temp": [30.50, 29.80, 29.10, 28.40, 27.93, 27.47, 27.00, 29.50, 32.00, 34.50, 36.00, 37.50, 39.00, 39.67, 40.33, 41.00, 39.33, 37.67, 36.00, 34.57, 33.13, 31.70, 31.03, 30.37],
    "humid": [56.0, 58.7, 61.3, 64.0, 68.3, 72.7, 77.0, 66.7, 56.3, 46.0, 41.7, 37.3, 33.0, 31.0, 29.0, 27.0, 32.7, 38.3, 44.0, 47.7, 51.3, 55.0, 58.3, 61.7]
  },
  "Lamphun": {
    "temp": [31.30, 30.83, 30.37, 29.90, 29.43, 28.97, 28.50, 30.57, 32.63, 34.70, 36.27, 37.83, 39.40, 39.97, 40.53, 41.10, 39.87, 38.63, 37.40, 36.17, 34.93, 33.70, 32.77, 31.83],
    "humid": [52.0, 55.3, 58.7, 62.0, 63.7, 65.3, 67.0, 59.0, 51.0, 43.0, 39.0, 35.0, 31.0, 29.0, 27.0, 25.0, 27.3, 29.7, 32.0, 35.3, 38.7, 42.0, 46.0, 50.0]
  },
  "Loei": {
    "temp": [25.80, 25.37, 24.93, 24.50, 24.47, 24.43, 24.40, 27.90, 31.40, 34.90, 36.43, 37.97, 39.50, 39.33, 39.17, 39.00, 37.57, 36.13, 34.70, 33.37, 32.03, 30.70, 29.40, 28.10],
    "humid": [78.0, 79.7, 81.3, 83.0, 82.7, 82.3, 82.0, 69.7, 57.3, 45.0, 42.0, 39.0, 36.0, 36.0, 36.0, 36.0, 39.0, 42.0, 45.0, 51.3, 57.7, 64.0, 68.7, 73.3]
  },
  "Lop Buri": {
    "temp": [30.00, 29.67, 29.33, 29.00, 29.00, 29.00, 29.00, 30.60, 32.20, 33.80, 35.20, 36.60, 38.00, 38.20, 38.40, 38.60, 37.53, 36.47, 35.40, 34.53, 33.67, 32.80, 32.00, 31.20],
    "humid": [72.0, 77.0, 82.0, 87.0, 87.7, 88.3, 89.0, 78.3, 67.7, 57.0, 51.3, 45.7, 40.0, 38.3, 36.7, 35.0, 39.7, 44.3, 49.0, 51.7, 54.3, 57.0, 60.7, 64.3]
  },
  "Mae Hong Son": {
    "temp": [31.40, 30.87, 30.33, 29.80, 29.53, 29.27, 29.00, 30.70, 32.40, 34.10, 35.53, 36.97, 38.40, 39.20, 40.00, 40.80, 39.53, 38.27, 37.00, 36.20, 35.40, 34.60, 33.73, 32.87],
    "humid": [56.0, 59.3, 62.7, 66.0, 67.7, 69.3, 71.0, 64.0, 57.0, 50.0, 45.3, 40.7, 36.0, 34.0, 32.0, 30.0, 32.3, 34.7, 37.0, 40.7, 44.3, 48.0, 51.0, 54.0]
  },
  "Maha Sarakham": {
    "temp": [30.50, 29.97, 29.43, 28.90, 29.10, 29.30, 29.50, 31.73, 33.97, 36.20, 37.53, 38.87, 40.20, 40.47, 40.73, 41.00, 39.67, 38.33, 37.00, 35.50, 34.00, 32.50, 31.83, 31.17],
    "humid": [62.0, 63.0, 64.0, 65.0, 65.3, 65.7, 66.0, 59.3, 52.7, 46.0, 42.3, 38.7, 35.0, 34.0, 33.0, 32.0, 34.7, 37.3, 40.0, 44.3, 48.7, 53.0, 52.0, 51.0]
  },
  "Mukdahan": {
    "temp": [31.00, 30.93, 30.87, 30.80, 30.43, 30.07, 29.70, 31.80, 33.90, 36.00, 37.13, 38.27, 39.40, 39.43, 39.47, 39.50, 38.33, 37.17, 36.00, 34.73, 33.47, 32.20, 31.73, 31.27],
    "humid": [66.0, 66.3, 66.7, 67.0, 68.0, 69.0, 70.0, 64.0, 58.0, 52.0, 48.7, 45.3, 42.0, 41.0, 40.0, 39.0, 42.7, 46.3, 50.0, 53.7, 57.3, 61.0, 62.0, 63.0]
  },
  "Nakhon Nayok": {
    "temp": [29.00, 29.00, 29.00, 29.00, 29.00, 28.00, 29.00, 30.00, 32.00, 33.00, 34.00, 34.00, 32.00, 33.00, 35.00, 35.00, 34.00, 34.00, 32.00, 31.00, 30.00, 30.00, 30.00, 30.00],
    "humid": [79.00, 79.00, 79.00, 79.00, 79.00, 89.00, 84.00, 79.00, 66.00, 59.00, 52.00, 52.00, 62.00, 63.00, 49.00, 49.00, 52.00, 52.00, 59.00, 66.00, 74.00, 74.00, 74.00, 74.00]
  },
  "Nakhon Pathom": {
    "temp": [29.00, 28.47, 27.93, 27.40, 27.37, 27.33, 27.30, 29.37, 31.43, 33.50, 34.87, 36.23, 37.60, 38.17, 38.73, 39.30, 37.87, 36.43, 35.00, 33.67, 32.33, 31.00, 30.43, 29.87],
    "humid": [79.0, 79.3, 79.7, 80.0, 78.3, 76.7, 75.0, 69.0, 63.0, 57.0, 53.3, 49.7, 46.0, 44.0, 42.0, 40.0, 44.3, 48.7, 53.0, 58.3, 63.7, 69.0, 71.3, 73.7]
  },
  "Nakhon Phanom": {
    "temp": [31.30, 31.20, 31.10, 31.00, 30.90, 30.80, 30.70, 32.07, 33.43, 34.80, 35.83, 36.87, 37.90, 38.00, 38.10, 38.20, 37.23, 36.27, 35.30, 34.40, 33.50, 32.60, 32.13, 31.67],
    "humid": [64.0, 64.0, 64.0, 64.0, 64.0, 64.0, 64.0, 61.0, 58.0, 55.0, 51.0, 47.0, 43.0, 42.7, 42.3, 42.0, 44.3, 46.7, 49.0, 52.0, 55.0, 58.0, 59.7, 61.3]
  },
  "Nakhon Ratchasima": {
    "temp": [29.80, 29.33, 28.87, 28.40, 28.63, 28.87, 29.10, 30.93, 32.77, 34.60, 35.97, 37.33, 38.70, 38.90, 39.10, 39.30, 37.80, 36.30, 34.80, 33.70, 32.60, 31.50, 30.70, 29.90],
    "humid": [76.0, 79.3, 82.7, 86.0, 85.3, 84.7, 84.0, 76.7, 69.3, 62.0, 57.0, 52.0, 47.0, 45.7, 44.3, 43.0, 47.0, 51.0, 55.0, 57.7, 60.3, 63.0, 66.0, 69.0]
  },
  "Nakhon Sawan": {
    "temp": [31.30, 30.60, 29.90, 29.20, 29.07, 28.93, 28.80, 30.97, 33.13, 35.30, 36.80, 38.30, 39.80, 40.03, 40.27, 40.50, 39.10, 37.70, 36.30, 35.67, 35.03, 34.40, 33.87, 33.33],
    "humid": [60.0, 62.7, 65.3, 68.0, 73.0, 78.0, 83.0, 70.7, 58.3, 46.0, 43.3, 40.7, 38.0, 37.7, 37.3, 37.0, 41.0, 45.0, 49.0, 48.3, 47.7, 47.0, 48.3, 49.7]
  },
  "Nakhon Si Thammarat": {
    "temp": [28.00, 27.67, 27.33, 27.00, 27.10, 27.20, 27.30, 29.57, 31.83, 34.10, 34.73, 35.37, 36.00, 35.33, 34.67, 34.00, 33.10, 32.20, 31.30, 30.80, 30.30, 29.80, 29.47, 29.13],
    "humid": [88.0, 90.7, 93.3, 96.0, 94.3, 92.7, 91.0, 81.0, 71.0, 61.0, 59.0, 57.0, 55.0, 56.7, 58.3, 60.0, 65.0, 70.0, 75.0, 77.7, 80.3, 83.0, 84.0, 85.0]
  },
  "Nan": {
    "temp": [27.50, 27.00, 26.50, 26.00, 25.77, 25.53, 25.30, 28.13, 30.97, 33.80, 35.40, 37.00, 38.60, 39.13, 39.67, 40.20, 38.63, 37.07, 35.50, 34.00, 32.50, 31.00, 29.83, 28.67],
    "humid": [78.0, 80.0, 82.0, 84.0, 84.3, 84.7, 85.0, 72.0, 59.0, 46.0, 43.3, 40.7, 38.0, 36.7, 35.3, 34.0, 38.7, 43.3, 48.0, 53.0, 58.0, 63.0, 67.3, 71.7]
  },
  "Narathiwat": {
    "temp": [27.90, 27.53, 27.17, 26.80, 26.90, 27.00, 27.10, 28.83, 30.57, 32.30, 32.77, 33.23, 33.70, 33.60, 33.50, 33.40, 32.53, 31.67, 30.80, 30.60, 30.40, 30.20, 29.63, 29.07],
    "humid": [80.0, 82.7, 85.3, 88.0, 87.0, 86.0, 85.0, 76.3, 67.7, 59.0, 58.7, 58.3, 58.0, 56.0, 54.0, 52.0, 60.0, 68.0, 76.0, 74.7, 73.3, 72.0, 72.7, 73.3]
  },
  "Nong Bua Lam Phu": {
    "temp": [27.90, 27.63, 27.37, 27.10, 27.17, 27.23, 27.30, 30.23, 33.17, 36.10, 37.30, 38.50, 39.70, 39.63, 39.57, 39.50, 38.23, 36.97, 35.70, 34.80, 33.90, 33.00, 32.27, 31.53],
    "humid": [68.0, 68.7, 69.3, 70.0, 71.7, 73.3, 75.0, 64.3, 53.7, 43.0, 43.7, 44.3, 45.0, 43.3, 41.7, 40.0, 43.0, 46.0, 49.0, 50.0, 51.0, 52.0, 55.0, 58.0]
  },
  "Nong Khai": {
    "temp": [28.20, 27.80, 27.40, 27.00, 27.17, 27.33, 27.50, 30.33, 33.17, 36.00, 37.00, 38.00, 39.00, 39.33, 39.67, 40.00, 38.87, 37.73, 36.60, 35.53, 34.47, 33.40, 32.57, 31.73],
    "humid": [76.0, 77.3, 78.7, 80.0, 80.3, 80.7, 81.0, 70.0, 59.0, 48.0, 45.7, 43.3, 41.0, 40.0, 39.0, 38.0, 41.3, 44.7, 48.0, 52.3, 56.7, 61.0, 64.3, 67.7]
  },
  "Nonthaburi": {
    "temp": [29.00, 28.47, 27.93, 27.40, 27.37, 27.33, 27.30, 29.37, 31.43, 33.50, 34.87, 36.23, 37.60, 38.17, 38.73, 39.30, 37.87, 36.43, 35.00, 33.67, 32.33, 31.00, 30.43, 29.87],
    "humid": [66.0, 66.7, 67.3, 68.0, 72.3, 76.7, 81.0, 69.3, 57.7, 46.0, 42.3, 38.7, 35.0, 33.7, 32.3, 31.0, 36.7, 42.3, 48.0, 50.7, 53.3, 56.0, 60.3, 64.7]
  },
  "Pathum Thani": {
    "temp": [31.50, 31.17, 30.83, 30.50, 30.57, 30.63, 30.70, 32.13, 33.57, 35.00, 36.17, 37.33, 38.50, 38.93, 39.37, 39.80, 38.63, 37.47, 36.30, 35.43, 34.57, 33.70, 33.03, 32.37],
    "humid": [66.0, 66.7, 67.3, 68.0, 72.3, 76.7, 81.0, 69.3, 57.7, 46.0, 42.3, 38.7, 35.0, 33.7, 32.3, 31.0, 36.7, 42.3, 48.0, 50.7, 53.3, 56.0, 60.3, 64.7]
  },
  "Pattani": {
    "temp": [27.50, 27.30, 27.10, 26.90, 26.80, 26.70, 26.60, 29.00, 31.40, 33.80, 33.97, 34.13, 34.30, 34.47, 34.63, 34.80, 33.43, 32.07, 30.70, 30.13, 29.57, 29.00, 28.47, 27.93],
    "humid": [87.0, 88.0, 89.0, 90.0, 91.7, 93.3, 95.0, 82.3, 69.7, 57.0, 57.0, 57.0, 57.0, 56.7, 56.3, 56.0, 63.3, 70.7, 78.0, 79.3, 80.7, 82.0, 83.3, 84.7]
  },
  "Phangnga": {
    "temp": [28.50, 28.17, 27.83, 27.50, 27.50, 27.50, 27.50, 29.00, 30.50, 32.00, 32.10, 32.20, 32.30, 33.03, 33.77, 34.50, 33.33, 32.17, 31.00, 30.53, 30.07, 29.60, 29.20, 28.80],
    "humid": [78.0, 82.0, 86.0, 90.0, 92.0, 94.0, 96.0, 86.7, 77.3, 68.0, 64.0, 60.0, 56.0, 55.3, 54.7, 54.0, 60.3, 66.7, 73.0, 73.7, 74.3, 75.0, 77.0, 79.0]
  },
  "Phatthalung": {
    "temp": [27.00, 26.67, 26.33, 26.00, 26.10, 26.20, 26.30, 27.87, 29.43, 31.00, 32.17, 33.33, 34.50, 34.30, 34.10, 33.90, 32.93, 31.97, 31.00, 30.33, 29.67, 29.00, 28.57, 28.13],
    "humid": [95.0, 95.7, 96.3, 97.0, 97.3, 97.7, 98.0, 90.3, 82.7, 75.0, 70.0, 65.0, 60.0, 62.7, 65.3, 68.0, 71.7, 75.3, 79.0, 80.3, 81.7, 83.0, 84.3, 85.7]
  },
  "Phayao": {
    "temp": [30.50, 29.67, 28.83, 28.00, 27.87, 27.73, 27.60, 29.80, 32.00, 34.20, 35.30, 36.40, 37.50, 38.00, 38.50, 39.00, 37.33, 35.67, 34.00, 32.33, 30.67, 29.00, 29.07, 29.13],
    "humid": [50.0, 53.3, 56.7, 60.0, 60.7, 61.3, 62.0, 54.7, 47.3, 40.0, 37.0, 34.0, 31.0, 28.7, 26.3, 24.0, 31.3, 38.7, 46.0, 50.0, 54.0, 58.0, 55.0, 52.0]
  },
  "Phetchabun": {
    "temp": [28.50, 28.00, 27.50, 27.00, 27.20, 27.40, 27.60, 30.07, 32.53, 35.00, 36.50, 38.00, 39.50, 40.07, 40.63, 41.20, 39.47, 37.73, 36.00, 34.33, 32.67, 31.00, 30.17, 29.33],
    "humid": [69.0, 70.7, 72.3, 74.0, 74.7, 75.3, 76.0, 69.3, 62.7, 56.0, 52.3, 48.7, 45.0, 41.0, 37.0, 33.0, 39.0, 45.0, 51.0, 55.3, 59.7, 64.0, 66.3, 68.7]
  },
  "Phetchaburi": {
    "temp": [30.00, 29.53, 29.07, 28.60, 28.47, 28.33, 28.20, 30.13, 32.07, 34.00, 34.00, 34.00, 34.00, 33.73, 33.47, 33.20, 32.80, 32.40, 32.00, 31.87, 31.73, 31.60, 31.53, 31.47],
    "humid": [75.0, 72.7, 70.3, 68.0, 66.7, 65.3, 64.0, 61.3, 58.7, 56.0, 56.3, 56.7, 57.0, 59.0, 61.0, 63.0, 65.7, 68.3, 71.0, 70.7, 70.3, 70.0, 70.0, 70.0]
  },
  "Phichit": {
    "temp": [30.20, 29.53, 28.87, 28.20, 28.17, 28.13, 28.10, 29.87, 31.63, 33.40, 34.53, 35.67, 36.80, 37.53, 38.27, 39.00, 37.73, 36.47, 35.20, 33.93, 32.67, 31.40, 30.93, 30.47],
    "humid": [74.0, 76.7, 79.3, 82.0, 81.3, 80.7, 80.0, 72.7, 65.3, 58.0, 53.3, 48.7, 44.0, 42.3, 40.7, 39.0, 44.3, 49.7, 55.0, 60.0, 65.0, 70.0, 71.7, 73.3]
  },
  "Phitsanulok": {
    "temp": [30.80, 30.13, 29.47, 28.80, 28.20, 27.60, 27.00, 29.10, 31.20, 33.30, 34.60, 35.90, 37.20, 37.60, 38.00, 38.40, 37.03, 35.67, 34.30, 33.30, 32.30, 31.30, 30.60, 29.90],
    "humid": [55.0, 58.7, 62.3, 66.0, 69.7, 73.3, 77.0, 69.0, 61.0, 53.0, 50.3, 47.7, 45.0, 43.7, 42.3, 41.0, 45.3, 49.7, 54.0, 56.3, 58.7, 61.0, 65.0, 69.0]
  },
  "Phra Nakhon Si Ayutthaya": {
    "temp": [30.00, 29.83, 29.67, 29.50, 29.60, 29.70, 29.80, 31.20, 32.60, 34.00, 35.17, 36.33, 37.50, 37.97, 38.43, 38.90, 37.67, 36.43, 35.20, 34.40, 33.60, 32.80, 32.13, 31.47],
    "humid": [81.0, 82.7, 84.3, 86.0, 87.3, 88.7, 90.0, 79.3, 68.7, 58.0, 54.0, 50.0, 46.0, 44.3, 42.7, 41.0, 47.0, 53.0, 59.0, 62.7, 66.3, 70.0, 71.0, 72.0]
  },
  "Phrae": {
    "temp": [29.80, 29.30, 28.80, 28.30, 27.00, 27.00, 27.00, 30.00, 33.00, 35.00, 37.00, 39.00, 39.00, 40.00, 41.00, 41.00, 41.00, 39.00, 36.50, 35.50, 34.50, 33.50, 32.87, 32.23],
    "humid": [64.00, 66.00, 68.00, 70.00, 70.00, 70.00, 70.00, 58.00, 49.00, 44.00, 39.00, 37.00, 35.00, 31.00, 26.00, 24.00, 24.00, 31.00, 45.00, 48.70, 52.30, 56.00, 59.00, 62.00]
  },
  "Phuket": {
    "temp": [30.40, 29.30, 28.20, 27.10, 26.57, 26.03, 25.50, 27.87, 30.23, 32.60, 33.47, 34.33, 35.20, 35.37, 35.53, 35.70, 34.30, 32.90, 31.50, 31.27, 31.03, 30.80, 30.40, 30.00],
    "humid": [78.0, 82.0, 86.0, 90.0, 92.0, 94.0, 96.0, 86.7, 77.3, 68.0, 64.0, 60.0, 56.0, 55.3, 54.7, 54.0, 60.3, 66.7, 73.0, 73.7, 74.3, 75.0, 77.0, 79.0]
  },
  "Prachin Buri": {
    "temp": [30.60, 30.40, 30.20, 30.00, 29.97, 29.93, 29.90, 31.33, 32.77, 34.20, 35.57, 36.93, 38.30, 38.53, 38.77, 39.00, 38.00, 37.00, 36.00, 34.57, 33.13, 31.70, 31.13, 30.57],
    "humid": [80.0, 81.0, 82.0, 83.0, 82.7, 82.3, 82.0, 76.3, 70.7, 65.0, 58.7, 52.3, 46.0, 42.7, 39.3, 36.0, 38.3, 40.7, 43.0, 50.3, 57.7, 65.0, 70.3, 75.7]
  },
  "Prachuap Khiri Khan": {
    "temp": [29.50, 29.23, 28.97, 28.70, 28.80, 28.90, 29.00, 31.10, 33.20, 35.30, 36.20, 37.10, 38.00, 37.57, 37.13, 36.70, 35.23, 33.77, 32.30, 31.70, 31.10, 30.50, 30.17, 29.83],
    "humid": [78.0, 76.3, 74.7, 73.0, 71.3, 69.7, 68.0, 60.3, 52.7, 45.0, 45.7, 46.3, 47.0, 48.7, 50.3, 52.0, 57.3, 62.7, 68.0, 71.3, 74.7, 78.0, 79.0, 80.0]
  },
  "Ranong": {
    "temp": [29.20, 28.60, 28.00, 27.40, 27.40, 27.40, 27.40, 29.07, 30.73, 32.40, 33.13, 33.87, 34.60, 34.50, 34.40, 34.30, 33.57, 32.83, 32.10, 31.43, 30.77, 30.10, 29.60, 29.10],
    "humid": [80.0, 83.3, 86.7, 90.0, 88.7, 87.3, 86.0, 80.7, 75.3, 70.0, 65.7, 61.3, 57.0, 56.3, 55.7, 55.0, 59.3, 63.7, 68.0, 72.3, 76.7, 81.0, 82.3, 83.7]
  },
  "Ratchaburi": {
    "temp": [28.40, 27.93, 27.47, 27.00, 26.67, 26.33, 26.00, 28.50, 31.00, 33.50, 35.17, 36.83, 38.50, 38.30, 38.10, 37.90, 36.37, 34.83, 33.30, 32.47, 31.63, 30.80, 30.20, 29.60],
    "humid": [79.0, 81.3, 83.7, 86.0, 86.7, 87.3, 88.0, 74.3, 60.7, 47.0, 42.3, 37.7, 33.0, 34.3, 35.7, 37.0, 41.3, 45.7, 50.0, 53.7, 57.3, 61.0, 65.0, 69.0]
  },
  "Rayong": {
    "temp": [30.60, 30.57, 30.53, 30.50, 30.57, 30.63, 30.70, 31.97, 33.23, 34.50, 34.67, 34.83, 35.00, 35.10, 35.20, 35.30, 33.93, 32.57, 31.20, 31.03, 30.87, 30.70, 30.70, 30.70],
    "humid": [83.0, 82.0, 81.0, 80.0, 79.7, 79.3, 79.0, 74.7, 70.3, 66.0, 63.0, 60.0, 57.0, 55.7, 54.3, 53.0, 60.3, 67.7, 75.0, 74.7, 74.3, 74.0, 76.3, 78.7]
  },
  "Roi Et": {
    "temp": [31.50, 30.93, 30.37, 29.80, 29.60, 29.40, 29.20, 31.13, 33.07, 35.00, 36.33, 37.67, 39.00, 39.67, 40.33, 41.00, 39.67, 38.33, 37.00, 35.73, 34.47, 33.20, 32.47, 31.73],
    "humid": [59.0, 62.0, 65.0, 68.0, 69.7, 71.3, 73.0, 65.0, 57.0, 49.0, 45.0, 41.0, 37.0, 34.3, 31.7, 29.0, 32.3, 35.7, 39.0, 42.7, 46.3, 50.0, 51.7, 53.3]
  },
  "Sa Kaeo": {
    "temp": [27.50, 27.53, 27.57, 27.60, 27.53, 27.47, 27.40, 29.37, 31.33, 33.30, 34.87, 36.43, 38.00, 38.33, 38.67, 39.00, 37.20, 35.40, 33.60, 32.57, 31.53, 30.50, 29.57, 28.63],
    "humid": [94.0, 94.0, 94.0, 94.0, 94.7, 95.3, 96.0, 87.3, 78.7, 70.0, 61.7, 53.3, 45.0, 44.0, 43.0, 42.0, 49.0, 56.0, 63.0, 68.0, 73.0, 78.0, 82.0, 86.0]
  },
  "Sakon Nakhon": {
    "temp": [30.50, 30.17, 29.83, 29.50, 29.57, 29.63, 29.70, 31.80, 33.90, 36.00, 37.10, 38.20, 39.30, 39.60, 39.90, 40.20, 38.80, 37.40, 36.00, 34.87, 33.73, 32.60, 32.20, 31.80],
    "humid": [62.0, 63.0, 64.0, 65.0, 64.3, 63.7, 63.0, 56.0, 49.0, 42.0, 39.7, 37.3, 35.0, 34.3, 33.7, 33.0, 36.7, 40.3, 44.0, 46.7, 49.3, 52.0, 52.7, 53.3]
  },
  "Samut Prakan": {
    "temp": [30.50, 30.43, 30.37, 30.30, 30.33, 30.37, 30.40, 31.43, 32.47, 33.50, 33.93, 34.37, 34.80, 34.60, 34.40, 34.20, 33.47, 32.73, 32.00, 31.83, 31.67, 31.50, 31.17, 30.83],
    "humid": [82.0, 82.7, 83.3, 84.0, 82.7, 81.3, 80.0, 74.7, 69.3, 64.0, 60.3, 56.7, 53.0, 53.7, 54.3, 55.0, 60.3, 65.7, 71.0, 70.3, 69.7, 69.0, 73.0, 77.0]
  },
  "Samut Sakhon": {
    "temp": [30.50, 30.43, 30.37, 30.30, 30.33, 30.37, 30.40, 31.43, 32.47, 33.50, 33.93, 34.37, 34.80, 34.60, 34.40, 34.20, 33.47, 32.73, 32.00, 31.83, 31.67, 31.50, 31.17, 30.83],
    "humid": [82.0, 82.7, 83.3, 84.0, 82.7, 81.3, 80.0, 74.7, 69.3, 64.0, 60.3, 56.7, 53.0, 53.7, 54.3, 55.0, 60.3, 65.7, 71.0, 70.3, 69.7, 69.0, 73.0, 77.0]
  },
  "Samut Songkhram": {
    "temp": [30.60, 30.10, 29.60, 29.10, 28.73, 28.37, 28.00, 30.10, 32.20, 34.30, 34.83, 35.37, 35.90, 35.37, 34.83, 34.30, 33.63, 32.97, 32.30, 32.00, 31.70, 31.40, 31.17, 30.93],
    "humid": [71.0, 74.7, 78.3, 82.0, 82.0, 82.0, 82.0, 68.7, 55.3, 42.0, 43.0, 44.0, 45.0, 49.7, 54.3, 59.0, 61.7, 64.3, 67.0, 68.7, 70.3, 72.0, 70.7, 69.3]
  },
  "Saraburi": {
    "temp": [30.00, 29.83, 29.67, 29.50, 29.63, 29.77, 29.90, 31.27, 32.63, 34.00, 34.33, 34.67, 35.00, 34.80, 34.60, 34.40, 33.53, 32.67, 31.80, 31.37, 30.93, 30.50, 30.00, 29.50],
    "humid": [72.0, 77.0, 82.0, 87.0, 87.7, 88.3, 89.0, 78.3, 67.7, 57.0, 51.3, 45.7, 40.0, 38.3, 36.7, 35.0, 39.7, 44.3, 49.0, 51.7, 54.3, 57.0, 60.7, 64.3]
  },
  "Satun": {
    "temp": [26.90, 26.43, 25.97, 25.50, 25.73, 25.97, 26.20, 27.80, 29.40, 31.00, 32.00, 33.00, 34.00, 34.17, 34.33, 34.50, 33.60, 32.70, 31.80, 31.13, 30.47, 29.80, 29.40, 29.00],
    "humid": [94.0, 94.7, 95.3, 96.0, 96.0, 96.0, 96.0, 89.0, 82.0, 75.0, 71.0, 67.0, 63.0, 59.3, 55.7, 52.0, 57.7, 63.3, 69.0, 73.7, 78.3, 83.0, 85.3, 87.7]
  },
  "Si Sa Ket": {
    "temp": [31.80, 31.47, 31.13, 30.80, 30.63, 30.47, 30.30, 32.20, 34.10, 36.00, 37.17, 38.33, 39.50, 39.70, 39.90, 40.10, 38.47, 36.83, 35.20, 34.30, 33.40, 32.50, 32.20, 31.90],
    "humid": [61.0, 63.0, 65.0, 67.0, 69.0, 71.0, 73.0, 66.0, 59.0, 52.0, 46.3, 40.7, 35.0, 34.7, 34.3, 34.0, 39.3, 44.7, 50.0, 52.7, 55.3, 58.0, 59.0, 60.0]
  },
  "Sing Buri": {
    "temp": [30.50, 29.83, 29.17, 28.50, 28.50, 28.50, 28.50, 30.57, 32.63, 34.70, 35.90, 37.10, 38.30, 38.77, 39.23, 39.70, 38.40, 37.10, 35.80, 34.70, 33.60, 32.50, 31.77, 31.03],
    "humid": [72.0, 77.0, 82.0, 87.0, 87.7, 88.3, 89.0, 78.3, 67.7, 57.0, 51.3, 45.7, 40.0, 38.3, 36.7, 35.0, 39.7, 44.3, 49.0, 51.7, 54.3, 57.0, 60.7, 64.3]
  },
  "Songkhla": {
    "temp": [29.00, 28.60, 28.20, 27.80, 27.83, 27.87, 27.90, 29.77, 31.63, 33.50, 33.73, 33.97, 34.20, 34.10, 34.00, 33.90, 33.00, 32.10, 31.20, 30.93, 30.67, 30.40, 30.17, 29.93],
    "humid": [78.0, 80.7, 83.3, 86.0, 84.7, 83.3, 82.0, 74.7, 67.3, 60.0, 59.7, 59.3, 59.0, 59.0, 59.0, 59.0, 64.0, 69.0, 74.0, 74.3, 74.7, 75.0, 75.0, 75.0]
  },
  "Sukhothai": {
    "temp": [31.20, 30.90, 30.60, 30.30, 29.97, 29.63, 29.30, 31.53, 33.77, 36.00, 37.53, 39.07, 40.60, 40.73, 40.87, 41.00, 39.23, 37.47, 35.70, 34.57, 33.43, 32.30, 31.73, 31.17],
    "humid": [44.0, 46.3, 48.7, 51.0, 57.0, 63.0, 69.0, 61.0, 53.0, 45.0, 39.7, 34.3, 29.0, 29.3, 29.7, 30.0, 36.7, 43.3, 50.0, 53.0, 56.0, 59.0, 61.3, 63.7]
  },
  "Suphan Buri": {
    "temp": [30.10, 29.63, 29.17, 28.70, 28.60, 28.50, 28.40, 30.60, 32.80, 35.00, 36.33, 37.67, 39.00, 39.17, 39.33, 39.50, 38.27, 37.03, 35.80, 34.70, 33.60, 32.50, 31.73, 30.97],
    "humid": [79.0, 79.3, 79.7, 80.0, 79.3, 78.7, 78.0, 68.0, 58.0, 48.0, 45.0, 42.0, 39.0, 39.0, 39.0, 39.0, 42.7, 46.3, 50.0, 52.3, 54.7, 57.0, 63.7, 70.3]
  },
  "Surat Thani": {
    "temp": [27.60, 27.23, 26.87, 26.50, 26.40, 26.30, 26.20, 27.97, 29.73, 31.50, 33.73, 35.97, 38.20, 37.47, 36.73, 36.00, 34.10, 32.20, 30.30, 29.53, 28.77, 28.00, 27.63, 27.27],
    "humid": [85.0, 86.7, 88.3, 90.0, 90.7, 91.3, 92.0, 81.3, 70.7, 60.0, 54.3, 48.7, 43.0, 44.3, 45.7, 47.0, 54.0, 61.0, 68.0, 72.3, 76.7, 81.0, 83.7, 86.3]
  },
  "Surin": {
    "temp": [31.50, 30.90, 30.30, 29.70, 29.63, 29.57, 29.50, 31.17, 32.83, 34.50, 35.83, 37.17, 38.50, 38.83, 39.17, 39.50, 38.40, 37.30, 36.20, 35.63, 35.07, 34.50, 33.67, 32.83],
    "humid": [67.0, 69.7, 72.3, 75.0, 76.0, 77.0, 78.0, 70.0, 62.0, 54.0, 48.3, 42.7, 37.0, 37.0, 37.0, 37.0, 40.7, 44.3, 48.0, 47.7, 47.3, 47.0, 51.3, 55.7]
  },
  "Tak": {
    "temp": [30.80, 30.33, 29.87, 29.40, 29.60, 29.80, 30.00, 31.37, 32.73, 34.10, 35.47, 36.83, 38.20, 38.47, 38.73, 39.00, 37.67, 36.33, 35.00, 34.33, 33.67, 33.00, 32.43, 31.87],
    "humid": [51.0, 56.0, 61.0, 66.0, 64.7, 63.3, 62.0, 58.7, 55.3, 52.0, 48.3, 44.7, 41.0, 41.3, 41.7, 42.0, 44.3, 46.7, 49.0, 50.7, 52.3, 54.0, 54.0, 54.0]
  },
  "Trang": {
    "temp": [25.50, 25.73, 25.97, 26.20, 26.33, 26.47, 26.60, 28.07, 29.53, 31.00, 32.57, 34.13, 35.70, 35.03, 34.37, 33.70, 32.13, 30.57, 29.00, 28.77, 28.53, 28.30, 27.97, 27.63],
    "humid": [94.0, 94.0, 94.0, 94.0, 93.7, 93.3, 93.0, 85.7, 78.3, 71.0, 64.7, 58.3, 52.0, 55.3, 58.7, 62.0, 68.7, 75.3, 82.0, 84.0, 86.0, 88.0, 89.0, 90.0]
  },
  "Trat": {
    "temp": [29.00, 28.67, 28.33, 28.00, 28.07, 28.13, 28.20, 29.67, 31.13, 32.60, 33.30, 34.00, 34.70, 34.47, 34.23, 34.00, 33.07, 32.13, 31.20, 30.87, 30.53, 30.20, 29.80, 29.40],
    "humid": [83.0, 83.7, 84.3, 85.0, 86.0, 87.0, 88.0, 81.7, 75.3, 69.0, 66.7, 64.3, 62.0, 63.3, 64.7, 66.0, 69.3, 72.7, 76.0, 78.0, 80.0, 82.0, 83.7, 85.3]
  },
  "Ubon Ratchathani": {
    "temp": [32.00, 31.87, 31.73, 31.60, 31.23, 30.87, 30.50, 31.97, 33.43, 34.90, 35.60, 36.30, 37.00, 37.57, 38.13, 38.70, 37.63, 36.57, 35.50, 34.60, 33.70, 32.80, 32.30, 31.80],
    "humid": [54.0, 54.7, 55.3, 56.0, 58.0, 60.0, 62.0, 58.7, 55.3, 52.0, 50.0, 48.0, 46.0, 44.7, 43.3, 42.0, 46.0, 50.0, 54.0, 56.3, 58.7, 61.0, 62.0, 63.0]
  },
  "Udon Thani": {
    "temp": [29.50, 28.67, 27.83, 27.00, 27.40, 27.80, 28.20, 31.03, 33.87, 36.70, 37.97, 39.23, 40.50, 40.60, 40.70, 40.80, 39.37, 37.93, 36.50, 35.50, 34.50, 33.50, 32.70, 31.90],
    "humid": [61.0, 64.3, 67.7, 71.0, 70.0, 69.0, 68.0, 57.7, 47.3, 37.0, 34.0, 31.0, 28.0, 27.7, 27.3, 27.0, 32.0, 37.0, 42.0, 43.7, 45.3, 47.0, 49.3, 51.7]
  },
  "Uthai Thani": {
    "temp": [31.00, 30.73, 30.47, 30.20, 29.20, 28.20, 27.20, 29.87, 32.53, 35.20, 36.27, 37.33, 38.40, 39.03, 39.67, 40.30, 39.17, 38.03, 36.90, 35.70, 34.50, 33.30, 32.10, 30.90],
    "humid": [69.0, 71.7, 74.3, 77.0, 79.7, 82.3, 85.0, 72.3, 59.7, 47.0, 43.7, 40.3, 37.0, 37.3, 37.7, 38.0, 40.7, 43.3, 46.0, 50.7, 55.3, 60.0, 65.3, 70.7]
  },
  "Uttaradit": {
    "temp": [29.80, 29.30, 28.80, 28.30, 27.93, 27.57, 27.20, 29.63, 32.07, 34.50, 36.17, 37.83, 39.50, 40.00, 40.50, 41.00, 39.50, 38.00, 36.50, 35.50, 34.50, 33.50, 32.87, 32.23],
    "humid": [64.0, 66.0, 68.0, 70.0, 71.3, 72.7, 74.0, 66.7, 59.3, 52.0, 46.7, 41.3, 36.0, 33.7, 31.3, 29.0, 34.3, 39.7, 45.0, 48.7, 52.3, 56.0, 59.0, 62.0]
  },
  "Yala": {
    "temp": [26.20, 26.13, 26.07, 26.00, 26.07, 26.13, 26.20, 28.63, 31.07, 33.50, 34.37, 35.23, 36.10, 35.57, 35.03, 34.50, 33.27, 32.03, 30.80, 29.87, 28.93, 28.00, 27.67, 27.33],
    "humid": [90.0, 91.3, 92.7, 94.0, 93.7, 93.3, 93.0, 82.3, 71.7, 61.0, 56.7, 52.3, 48.0, 51.3, 54.7, 58.0, 63.7, 69.3, 75.0, 78.7, 82.3, 86.0, 88.0, 90.0]
  },
  "Yasothon": {
    "temp": [32.00, 31.67, 31.33, 31.00, 30.97, 30.93, 30.90, 32.27, 33.63, 35.00, 35.97, 36.93, 37.90, 38.23, 38.57, 38.90, 37.57, 36.23, 34.90, 34.23, 33.57, 32.90, 32.33, 31.77],
    "humid": [63.0, 65.0, 67.0, 69.0, 69.7, 70.3, 71.0, 64.7, 58.3, 52.0, 51.7, 51.3, 51.0, 49.7, 48.3, 47.0, 48.7, 50.3, 52.0, 53.3, 54.7, 56.0, 57.3, 58.7]
  }
};
    const thaiProvinces = [...Object.keys(comprehensiveLocationData), "Other"];
    const months = [{ value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" }, { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" }, { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" }, { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }];
    const timeZones = Array.from({ length: 27 }, (_, i) => `UTC${14 - i >= 0 ? '+' : ''}${14 - i}`);
    const activityOptions = ["Seated at theater/Theater", "Seated, very light work/Offices, hotels, apartments", "Moderately active office work/Offices, hotels, apartments", "Standing, light work; walking/Department store; retail store", "Walking, standing/Drug store, bank", "Sedentary work/Restaurant", "Light bench work/Factory", "Moderate dancing/Dance hall", "Walking 4.8 km/h; light machine work/Factory", "Bowling/Bowling alley", "Heavy work/Factory", "Heavy machine work; lifting/Factory", "Athletics/Gymnasium"];
    const coolingTypeOptions = ["Equipment without cooling fan", "Equipment with cooling fan", "Equipment with exhaust hood"];
    const Loptions = ['Downlights (CFL & Incandescent)', 'Fluorescents (Recessed / Suspended)', 'LEDs (High-Bay / Pendant / High-Efficacy Troffer / Color Tuning)', 'LEDs (Troffer Partial Aperture / Uniform Diffuser / Retrofit / Downlight)'];
    const [wallTypeOptions, setWallTypeOptions] = useState([]);
    const [uFactorMap, setUFactorMap] = useState({});
    const [surfaceColorOptions, setSurfaceColorOptions] = useState([]);
    const [alphaHoMap, setAlphaHoMap] = useState({});
    const [interiorZoneOptions, setInteriorZoneOptions] = useState([]);
    const [roofTypeOptions, setRoofTypeOptions] = useState([]);
    const [roofUFactorMap, setRoofUFactorMap] = useState({});
    const [materialTypeOptions, setMaterialTypeOptions] = useState([]);
    const [glassTypeOptions, setGlassTypeOptions] = useState([]);
    const [glassPropertiesMap, setGlassPropertiesMap] = useState({});
    const [provinceHourlyDataMap, setProvinceHourlyDataMap] = useState({});
    const [materialUFactorMap, setMaterialUFactorMap] = useState({});
    const [selectedCountry, setSelectedCountry] = useState('Thailand');
    const [roomDimensionInputs, setRoomDimensionInputs] = useState({ length: '', width: '', ceilingHeight: '', area: '', floorNo: '' });
    const [formData, setFormData] = useState({
        projectInfo: { projectName: '', buildingName: '', roomName: '', date: new Date().toISOString().split('T')[0] },
        locationInfo: {
            city: '', customCity: '', timeZone: 'UTC+7', calMonth: '4', longitude: '', lonHemisphere: 'E',
            latitude: '', taub: '0.576', taud: '1.984', roomTemp: '24', roomHumidity: '50', altitude: '0',
            outsideAirTemp: initialHourlyData(), outsideAirHumidity: initialHourlyData(),interiorZone: '',
        },
        walls: [{ id: 1, orientation: 'N', psi: '180', wallType: '', uFactor: '', area: '', surfaceColor: '', alpha_ho: '', interiorZone: '' }],
        windows: [{ id: 1, orientation: 'N', psi: '180', glassType: '', blinds: 'No Blinds', uFactor: '', area: '', interiorZone: '' }],
        roof: { roofType: '', uFactor: '', area: '', surfaceColor: '', interiorZone: '', surfaceAngle: '', alpha_ho: '' },
        ceilings: [{ id: 1, area: '', materialType: '', uFactor: '', interiorZone: '', tempdiff: '' }],
        floors: [{ id: 1, area: '', materialType: '', uFactor: '', interiorZone: '', tempdiff: '' }],
        partitions: [{ id: 1, area: '', materialType: '', uFactor: '', interiorZone: '', tempdiff: '' }],
        people: { count: '', activity: activityOptions[0], interiorZone: '', schedule: initialSchedule() },
        lighting: { heatGain: '', interiorZone: '', schedule: initialSchedule(), coolingType: Loptions[0] },
        equipments: { sensibleHeat: '', latentHeat: '', coolingType: coolingTypeOptions[0], interiorZone: '', schedule: initialSchedule() },
        outsideAir: { flowRate: '', schedule: initialSchedule() },
    });
    const categoryCounts = {
        windows: formData.windows?.length || 0,
        walls: formData.walls?.length || 0,
        partitions: formData.partitions?.length || 0,

    };

    const [wallCount, setWallCount] = useState(1);
    const [windowCount, setWindowCount] = useState(1);
    const [partitionCount, setPartitionCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [calculationResults, setCalculationResults] = useState(null);
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVBtq7dzitcPwq4nHj20i0ERKL2ytG_MmjW47ZzIDdoCt_mQu0wAF5cZrgl32D/exec';
    useEffect(() => {
        const simulatedFetchedData = {
            wallTypes: ["1. Spandrel glass, insulation board, gyp board", "2. Metal wall panel, insulation board, gyp board", "3. 25 mm stucco, insulation board, gyp board", "4. Metal wall panel, sheathing, batt insulation, gyp board", "5. 25 mm stucco, sheathing, batt insulation, gyp board", "6. Wood siding, sheathing, batt insulation, 13 mm wood", "7. 25 mm stucco, sheathing, batt insulation, gyp board", "8. EIFS finish, insulation board, sheathing, gyp board", "9. EIFS finish, insulation board, sheathing, batt insulation, gyp board", "10. EIFS finish, insulation board, sheathing, 200 mm LW CMU, gyp board", "11. Brick, insulation board, sheathing, gyp board", "12. Brick, sheathing, batt insulation, gyp board", "13. Brick, insulation board, sheathing, batt insulation, gyp board", "14. Brick, insulation board, 200 mm LW CMU", "15. Brick, 200 mm LW CMU, batt insulation, gyp board", "16. Brick, insulation board, 200 mm HW CMU, gyp board", "17. Brick, insulation board, brick", "18. Brick, insulation board, 200 mm LW concrete, gyp board", "19. Brick, insulation board, 300 mm HW concrete, gyp board", "20. Brick, 200 mm HW concrete, batt insulation, gyp board", "21. 200 mm LW CMU, batt insulation, gyp board", "22. 200 mm LW CMU with fill insulation, batt insulation, gyp board", "23. 25 mm stucco, 200 mm HW CMU, batt insulation, gyp board", "24. 200 mm LW CMU with fill insulation", "25. 200 mm LW CMU with fill insulation, gyp board", "26. 300 mm LW CMU with fill insulation, gyp board", "27. 100 mm LW concrete, board insulation, gyp board", "28. 100 mm LW concrete, board insulation, 100 mm LW concrete", "29. 100 mm LW concrete, batt insulation, gyp board", "30. EIFS finish, insulation board, 200 mm LW concrete, gyp board", "31. 200 mm LW concrete, batt insulation, gyp board", "32. EIFS finish, insulation board, 200 mm HW concrete, gyp board", "33. 200 mm HW concrete, batt insulation,gyp board", "34. 300 mm HW concrete, batt insulation, gyp board", "35. 300 mm HW concrete"],
            uFactorMap: { "1. Spandrel glass, insulation board, gyp board": "0.428", "2. Metal wall panel, insulation board, gyp board": "0.429", "3. 25 mm stucco, insulation board, gyp board": "0.428", "4. Metal wall panel, sheathing, batt insulation, gyp board": "0.419", "5. 25 mm stucco, sheathing, batt insulation, gyp board": "0.417", "6. Wood siding, sheathing, batt insulation, 13 mm wood": "0.406", "7. 25 mm stucco, sheathing, batt insulation, gyp board": "0.415", "8. EIFS finish, insulation board, sheathing, gyp board": "0.668", "9. EIFS finish, insulation board, sheathing, batt insulation, gyp board": "0.305", "10. EIFS finish, insulation board, sheathing, 200 mm LW CMU, gyp board": "0.524", "11. Brick, insulation board, sheathing, gyp board": "0.571", "12. Brick, sheathing, batt insulation, gyp board": "0.377", "13. Brick, insulation board, sheathing, batt insulation, gyp board": "0.283", "14. Brick, insulation board, 200 mm LW CMU": "0.581", "15. Brick, 200 mm LW CMU, batt insulation, gyp board": "0.348", "16. Brick, insulation board, 200 mm HW CMU, gyp board": "0.628", "17. Brick, insulation board, brick": "0.702", "18. Brick, insulation board, 200 mm LW concrete, gyp board": "0.514", "19. Brick, insulation board, 300 mm HW concrete, gyp board": "0.581", "20. Brick, 200 mm HW concrete, batt insulation, gyp board": "0.389", "21. 200 mm LW CMU, batt insulation, gyp board": "0.383", "22. 200 mm LW CMU with fill insulation, batt insulation, gyp board": "0.335", "23. 25 mm stucco, 200 mm HW CMU, batt insulation, gyp board": "0.414", "24. 200 mm LW CMU with fill insulation": "1.056", "25. 200 mm LW CMU with fill insulation, gyp board": "0.834", "26. 300 mm LW CMU with fill insulation, gyp board": "0.689", "27. 100 mm LW concrete, board insulation, gyp board": "0.673", "28. 100 mm LW concrete, board insulation, 100 mm LW concrete": "0.418", "29. 100 mm LW concrete, batt insulation, gyp board": "0.434", "30. EIFS finish, insulation board, 200 mm LW concrete, gyp board": "0.650", "31. 200 mm LW concrete, batt insulation, gyp board": "0.387", "32. EIFS finish, insulation board, 200 mm HW concrete, gyp board": "0.467", "33. 200 mm HW concrete, batt insulation,gyp board": "0.434", "34. 300 mm HW concrete, batt insulation, gyp board": "0.266", "35. 300 mm HW concrete": "3.122" },
            surfaceColors: ["Light-colored surface", "Dark-colored surface"],
            alphaHoMap: { "Light-colored surface": "0.026", "Dark-colored surface": "0.052" },
            interiorZoneOptions: ["1-Light thermal mass, with carpet, 10% glass area", "2-Light thermal mass, with carpet, 50% glass area", "3-Light thermal mass, with carpet, 90% glass area", "4-Light thermal mass, no carpet, 10% glass area", "5-Light thermal mass, no carpet, 50% glass area", "6-Light thermal mass, no carpet, 90% glass area", "7-Medium thermal mass, with carpet, 10% glass area", "8-Medium thermal mass, with carpet, 50% glass area", "9-Medium thermal mass, with carpet, 90% glass area", "10-Medium thermal mass, no carpet, 10% glass area", "11-Medium thermal mass, no carpet, 50% glass area", "12-Medium thermal mass, no carpet, 90% glass area", "13-Heavy thermal mass, with carpet, 10% glass area", "14-Heavy thermal mass, with carpet, 50% glass area", "15-Heavy thermal mass, with carpet, 90% glass area", "16-Heavy thermal mass, no carpet, 10% glass area", "17-Heavy thermal mass, no carpet, 50% glass area", "18-Heavy thermal mass, no carpet, 90% glass area", "19-Interior zone, light thermal mass, with carpet", "20-Interior zone, light thermal mass, no carpet", "21-Interior zone, medium thermal mass, with carpet", "22-Interior zone, medium thermal mass, no carpet", "23-Interior zone, heavy thermal mass, with carpet", "24-Interior zone, heavy thermal mass, no carpet"],
            roofTypeOptions: ["1. Metal roof, batt insulation, gyp board", "2. Metal roof, batt insulation, suspended acoustical ceiling", "3. Metal roof, batt insulation", "4. Asphalt shingles, wood sheathing, batt insulation, gyp board", "5. Slate or tile, wood sheathing, batt insulation, gyp board", "6. Wood shingles, wood sheathing, batt insulation, gyp board", "7. Membrane, sheathing, insulation board, wood deck", "8. Membrane, sheathing, insulation board, wood deck, suspended acoustical ceiling", "9. Membrane, sheathing, insulation board, metal deck", "10. Membrane, sheathing, insulation board, metal deck", "11. Membrane, sheathing, insulation board, metal deck", "12. 50 mm concrete roof ballast, membrane, sheathing, insulation board, metal deck", "13. Membrane, sheathing, insulation board, 100 mm LW concrete", "14. Membrane, sheathing, insulation board, 150 mm LW concrete", "15. Membrane, sheathing, insulation board, 200 mm LW concrete", "16. Membrane, sheathing, insulation board, 150 mm HW concrete", "17. Membrane, sheathing, insulation board, 200 mm HW concrete", "18. Membrane, sheathing, insulation board, 200 mm HW concrete", "19. Membrane, 150 mm HW concrete, batt insulation, suspended acoustical ceiling"],
            roofUFactorMap: { "1. Metal roof, batt insulation, gyp board": "0.249", "2. Metal roof, batt insulation, suspended acoustical ceiling": "0.227", "3. Metal roof, batt insulation": "0.255", "4. Asphalt shingles, wood sheathing, batt insulation, gyp board": "0.235", "5. Slate or tile, wood sheathing, batt insulation, gyp board": "0.239", "6. Wood shingles, wood sheathing, batt insulation, gyp board": "0.231", "7. Membrane, sheathing, insulation board, wood deck": "0.393", "8. Membrane, sheathing, insulation board, wood deck, suspended acoustical ceiling": "0.329", "9. Membrane, sheathing, insulation board, metal deck": "0.452", "10. Membrane, sheathing, insulation board, metal deck": "0.371", "11. Membrane, sheathing, insulation board, metal deck": "0.323", "12. 50 mm concrete roof ballast, membrane, sheathing, insulation board, metal deck": "0.206", "13. Membrane, sheathing, insulation board, 100 mm LW concrete": "0.297", "14. Membrane, sheathing, insulation board, 150 mm LW concrete": "0.304", "15. Membrane, sheathing, insulation board, 200 mm LW concrete": "0.296", "16. Membrane, sheathing, insulation board, 150 mm HW concrete": "0.288", "17. Membrane, sheathing, insulation board, 200 mm HW concrete": "0.315", "18. Membrane, sheathing, insulation board, 200 mm HW concrete": "0.313", "19. Membrane, 150 mm HW concrete, batt insulation, suspended acoustical ceiling": "0.239" },
            materialTypeOptions: ["1. Spandrel glass, insulation board, gyp board", "2. Metal wall panel, insulation board, gyp board", "3. 25 mm stucco, insulation board, gyp board", "4. Metal wall panel, sheathing, batt insulation, gyp board", "5. 25 mm stucco, sheathing, batt insulation, gyp board", "6. Wood siding, sheathing, batt insulation, 13 mm wood", "7. 25 mm stucco, sheathing, batt insulation, gyp board", "8. EIFS finish, insulation board, sheathing, gyp board", "9. EIFS finish, insulation board, sheathing, batt insulation, gyp board", "10. EIFS finish, insulation board, sheathing, 200 mm LW CMU, gyp board", "11. Brick, insulation board, sheathing, gyp board", "12. Brick, sheathing, batt insulation, gyp board", "13. Brick, insulation board, sheathing, batt insulation, gyp board", "14. Brick, insulation board, 200 mm LW CMU", "15. Brick, 200 mm LW CMU, batt insulation, gyp board", "16. Brick, insulation board, 200 mm HW CMU, gyp board", "17. Brick, insulation board, brick", "18. Brick, insulation board, 200 mm LW concrete, gyp board", "19. Brick, insulation board, 300 mm HW concrete, gyp board", "20. Brick, 200 mm HW concrete, batt insulation, gyp board", "21. 200 mm LW CMU, batt insulation, gyp board", "22. 200 mm LW CMU with fill insulation, batt insulation, gyp board", "23. 25 mm stucco, 200 mm HW CMU, batt insulation, gyp board", "24. 200 mm LW CMU with fill insulation", "25. 200 mm LW CMU with fill insulation, gyp board", "26. 300 mm LW CMU with fill insulation, gyp board", "27. 100 mm LW concrete, board insulation, gyp board", "28. 100 mm LW concrete, board insulation, 100 mm LW concrete", "29. 100 mm LW concrete, batt insulation, gyp board", "30. EIFS finish, insulation board, 200 mm LW concrete, gyp board", "31. 200 mm LW concrete, batt insulation, gyp board", "32. EIFS finish, insulation board, 200 mm HW concrete, gyp board", "33. 200 mm HW concrete, batt insulation,gyp board", "34. 300 mm HW concrete, batt insulation, gyp board", "35. 300 mm HW concrete"],
            materialUFactorMap: { "1. Spandrel glass, insulation board, gyp board": "0.428", "2. Metal wall panel, insulation board, gyp board": "0.429", "3. 25 mm stucco, insulation board, gyp board": "0.428", "4. Metal wall panel, sheathing, batt insulation, gyp board": "0.419", "5. 25 mm stucco, sheathing, batt insulation, gyp board": "0.417", "6. Wood siding, sheathing, batt insulation, 13 mm wood": "0.406", "7. 25 mm stucco, sheathing, batt insulation, gyp board": "0.415", "8. EIFS finish, insulation board, sheathing, gyp board": "0.668", "9. EIFS finish, insulation board, sheathing, batt insulation, gyp board": "0.305", "10. EIFS finish, insulation board, sheathing, 200 mm LW CMU, gyp board": "0.524", "11. Brick, insulation board, sheathing, gyp board": "0.571", "12. Brick, sheathing, batt insulation, gyp board": "0.377", "13. Brick, insulation board, sheathing, batt insulation, gyp board": "0.283", "14. Brick, insulation board, 200 mm LW CMU": "0.581", "15. Brick, 200 mm LW CMU, batt insulation, gyp board": "0.348", "16. Brick, insulation board, 200 mm HW CMU, gyp board": "0.628", "17. Brick, insulation board, brick": "0.702", "18. Brick, insulation board, 200 mm LW concrete, gyp board": "0.514", "19. Brick, insulation board, 300 mm HW concrete, gyp board": "0.581", "20. Brick, 200 mm HW concrete, batt insulation, gyp board": "0.389", "21. 200 mm LW CMU, batt insulation, gyp board": "0.383", "22. 200 mm LW CMU with fill insulation, batt insulation, gyp board": "0.335", "23. 25 mm stucco, 200 mm HW CMU, batt insulation, gyp board": "0.414", "24. 200 mm LW CMU with fill insulation": "1.056", "25. 200 mm LW CMU with fill insulation, gyp board": "0.834", "26. 300 mm LW CMU with fill insulation, gyp board": "0.689", "27. 100 mm LW concrete, board insulation, gyp board": "0.673", "28. 100 mm LW concrete, board insulation, 100 mm LW concrete": "0.418", "29. 100 mm LW concrete, batt insulation, gyp board": "0.434", "30. EIFS finish, insulation board, 200 mm LW concrete, gyp board": "0.650", "31. 200 mm LW concrete, batt insulation, gyp board": "0.387", "32. EIFS finish, insulation board, 200 mm HW concrete, gyp board": "0.467", "33. 200 mm HW concrete, batt insulation,gyp board": "0.434", "34. 300 mm HW concrete, batt insulation, gyp board": "0.266", "35. 300 mm HW concrete": "3.122" },
            glassTypeOptions: ["Sngl 1a 3 mm CLR Glazing System", "Sngl 1b 6 mm CLR Glazing System", "Sngl 1c 3 mm BRZ Glazing System", "Sngl 1d 6 mm BRZ Glazing System", "Sngl 1e 3 mm GRN Glazing System", "Sngl 1f 6 mm GRN Glazing System", "Sngl 1g 3 mm GRY Glazing System", "Sngl 1h 6 mm GRY Glazing System", "Sngl 1i 6 mm BLUGRN Glazing System", "Sngl 1j 6 mm SS on CLR 8% Glazing System", "Sngl 1k 6 mm SS on CLR 14% Glazing System", "Sngl 1l 6 mm SS on CLR 20% Glazing System", "Sngl 1m 6 mm SS on GRN 14% Glazing System", "Sngl 1n 6 mm TI on CLR 20% Glazing System", "Sngl 1o 6 mm TI on CLR 30% Glazing System", "Dbl 5a 3 mm CLR CLR Glazing System", "Dbl 5b 6 mm CLR CLR Glazing System", "Dbl 5c 3 mm BRZ CLR Glazing System", "Dbl 5d 6 mm BRZ CLR Glazing System", "Dbl 5e 3 mm GRN CLR Glazing System", "Dbl 5f 6 mm GRN CLR Glazing System", "Dbl 5g 3 mm GRY CLR Glazing System", "Dbl 5h 6 mm GRY CLR Glazing System", "Dbl 5i 6 mm BLUGRN CLR Glazing System", "Dbl 5j 6 mm HI-P GRN CLR Glazing System", "Dbl 5k 6 mm SS on CLR 8%, CLR Glazing System", "Dbl 5l 6 mm SS on CLR 14%, CLR Glazing System", "Dbl 5m 6 mm SS on CLR 20%, CLR Glazing System", "Dbl 5n 6 mm SS on GRN 14%, CLR Glazing System", "Dbl 5o 6 mm TI on CLR 20%, CLR Glazing System", "Dbl 5p 6 mm TI on CLR 30%, CLR Glazing System", "Sngl 17a 3 mm LE CLR Glazing System", "Sngl 17b 6 mm LE CLR Glazing System", "Sngl 17c 3 mm CLR LE Glazing System", "Sngl 17d 6 mm CLR LE Glazing System", "Sngl 17e 3 mm BRZ LE Glazing System", "Sngl 17f 6 mm BRZ LE Glazing System", "Sngl 17g 3 mm GRN LE Glazing System", "Sngl 17h 6 mm GRN LE Glazing System", "Sngl 17i 3 mm GRY LE Glazing System", "Sngl 17j 6 mm GRY LE Glazing System", "Sngl 17k 6 mm BLUGRN LE Glazing System", "Sngl 17l 6 mm HI-P GRN LE Glazing System", "Sngl 21a 3 mm LE CLR Glazing System", "Sngl 21b 6 mm LE CLR Glazing System", "Sngl 21c 3 mm CLR LE Glazing System", "Sngl 21d 6 mm CLR LE Glazing System", "Sngl 21e 3 mm BRZ LE Glazing System", "Sngl 21f 6 mm BRZ LE Glazing System", "Sngl 21g 3 mm GRN LE Glazing System", "Sngl 21h 6 mm GRN LE Glazing System", "Sngl 21i 3 mm GRY LE Glazing System", "Sngl 21j 6 mm GRY LE Glazing System", "Sngl 21k 6 mm BLUGRN LE Glazing System", "Sngl 21l 6 mm HI-P GRN W/LE CLR Glazing System", "Dbl 25a 3 mm LE CLR Glazing System", "Dbl 25b 6 mm LE CLR Glazing System", "Dbl 25c 6 mm BRZ W/LE CLR Glazing System", "Dbl 25d 6 mm GRN W/LE CLR Glazing System", "Dbl 25e 6 mm GRY W/LE CLR Glazing System", "Dbl 25f 6 mm BLUE W/LE CLR Glazing System", "Dbl 25g 6 mm HI-P GRN W/LE CLR Glazing System", "Trpl 29a 3 mm CLR CLR CLR Glazing System", "Trpl 29b 6 mm CLR CLR CLR Glazing System", "Trpl 29c 6 mm HI-P GRN CLR CLR Glazing System", "Trpl 32a 3 mm LE CLR CLR Glazing System", "Trpl 32b 6 mm LE CLR CLR Glazing System", "Trpl 32c 3 mm CLR CLR CLR Glazing System", "Trpl 32d 6 mm CLR CLR CLR Glazing System", "Trpl 40a 3 mm CLR CLR CLR Glazing System", "Trpl 40b 6 mm LE LE CLR Glazing System", "Trpl 49 3 mm LE LE CLR Glazing System", "Trpl 50 6 mm LE LE CLR Glazing System"],
            solarRTSZoneTypeOptions: ["1-Light thermal mass, with carpet, 10% glass area", "2-Light thermal mass, with carpet, 50% glass area", "3-Light thermal mass, with carpet, 90% glass area", "4-Light thermal mass, no carpet, 10% glass area", "5-Light thermal mass, no carpet, 50% glass area", "6-Light thermal mass, no carpet, 90% glass area", "7-Medium thermal mass, with carpet, 10% glass area", "8-Medium thermal mass, with carpet, 50% glass area", "9-Medium thermal mass, with carpet, 90% glass area", "10-Medium thermal mass, no carpet, 10% glass area", "11-Medium thermal mass, no carpet, 50% glass area", "12-Medium thermal mass, no carpet, 90% glass area", "13-Heavy thermal mass, with carpet, 10% glass area", "14-Heavy thermal mass, with carpet, 50% glass area", "15-Heavy thermal mass, with carpet, 90% glass area", "16-Heavy thermal mass, no carpet, 10% glass area", "17-Heavy thermal mass, no carpet, 50% glass area", "18-Heavy thermal mass, no carpet, 90% glass area",],
            locationData: comprehensiveLocationData
        };

        const simulateFetch = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            const data = simulatedFetchedData;

            setWallTypeOptions(data.wallTypes || []);
            setUFactorMap(data.uFactorMap || {});
            setSurfaceColorOptions(data.surfaceColors || []);
            setAlphaHoMap(data.alphaHoMap || {});
            setInteriorZoneOptions(data.interiorZoneOptions || []);
            setRoofTypeOptions(data.roofTypeOptions || []);
            setRoofUFactorMap(data.roofUFactorMap || {});
            setMaterialTypeOptions(data.materialTypeOptions || []);
            setMaterialUFactorMap(data.materialUFactorMap || {});
            const uniqueGlassTypeOptions = Array.from(new Set(data.glassTypeOptions || []));
            setGlassTypeOptions(uniqueGlassTypeOptions);
            setProvinceHourlyDataMap(data.locationData || {});

            setFormData(prev => {
                const defaultMaterialType = data.materialTypeOptions?.[0] || '';
                const defaultUFactor = data.materialUFactorMap?.[defaultMaterialType] || '';
                const defaultInteriorZone = data.interiorZoneOptions?.[0] || '';
                const defaultCityName = Object.keys(comprehensiveLocationData)[0];
                const defaultCityData = comprehensiveLocationData[defaultCityName];
                const newLocationInfo = {
                    ...prev.locationInfo,
                    city: prev.locationInfo.city || defaultCityName || '',
                    outsideAirTemp: (prev.locationInfo.city && comprehensiveLocationData[prev.locationInfo.city]?.temp) || defaultCityData?.temp || initialHourlyData(),
                    outsideAirHumidity: (prev.locationInfo.city && comprehensiveLocationData[prev.locationInfo.city]?.humid) || defaultCityData?.humid || initialHourlyData(),
                    customCity: prev.locationInfo.city === 'Custom' ? prev.locationInfo.customCity : ''
                };

                return {
                    ...prev,
                    locationInfo: newLocationInfo
                };
            });
            setRoomDimensionInputs(prev => ({ ...prev, length: prev.length || '', width: prev.width || '', ceilingHeight: prev.ceilingHeight || '', area: prev.area || '', floorNo: prev.floorNo || '' }));
            setLoading(false);
        };
        simulateFetch();
    }, []);


    useEffect(() => {
    const newZone = formData.locationInfo.interiorZone;
    if (newZone) {
        setFormData(prev => ({
            ...prev,
            walls: prev.walls.map(item => ({ ...item, interiorZone: newZone })),
            windows: prev.windows.map(item => ({ ...item, interiorZone: newZone })),
            roof: { ...prev.roof, interiorZone: newZone },
            ceilings: prev.ceilings.map(item => ({ ...item, interiorZone: newZone })), // <<== บรรทัดที่เพิ่ม
            floors: prev.floors.map(item => ({ ...item, interiorZone: newZone })),       // <<== บรรทัดที่เพิ่ม
            partitions: prev.partitions.map(item => ({ ...item, interiorZone: newZone })),
            people: { ...prev.people, interiorZone: newZone },
            lighting: { ...prev.lighting, interiorZone: newZone },
            equipments: { ...prev.equipments, interiorZone: newZone },
        }));
    }
}, [formData.locationInfo.interiorZone]);

    useEffect(() => {
    const currentLength = formData.walls.length;
    const newCount = wallCount >= 0 ? wallCount : 0;
    if (newCount > currentLength) {
        const newItems = Array.from({ length: newCount - currentLength }, () => ({ id: Date.now() + Math.random(), orientation: 'N', psi: '180', wallType: wallTypeOptions[0] || '', uFactor: uFactorMap[wallTypeOptions[0]] || '', area: '', surfaceColor: surfaceColorOptions[0] || '', alpha_ho: alphaHoMap[surfaceColorOptions[0]] || '', interiorZone: formData.locationInfo.interiorZone || interiorZoneOptions[0] || '' }));
        setFormData(prev => ({ ...prev, walls: [...prev.walls, ...newItems] }));
    } else if (newCount < currentLength) {
        setFormData(prev => ({ ...prev, walls: prev.walls.slice(0, newCount) }));
    }
}, [wallCount, wallTypeOptions, uFactorMap, surfaceColorOptions, alphaHoMap, interiorZoneOptions, formData.locationInfo.interiorZone]);

useEffect(() => {
    const currentLength = formData.partitions.length;
    const newCount = partitionCount >= 0 ? partitionCount : 0;

    if (newCount > currentLength) {
        const newItems = Array.from({ length: newCount - currentLength }, () => ({
            id: Date.now() + Math.random(),
            area: '',
            materialType: materialTypeOptions[0] || '',
            uFactor: materialUFactorMap[materialTypeOptions[0]] || '',
            interiorZone: formData.locationInfo.interiorZone || interiorZoneOptions[0] || '',
            tempdiff: ''
        }));
        setFormData(prev => ({ ...prev, partitions: [...prev.partitions, ...newItems] }));
    } else if (newCount < currentLength) {
        setFormData(prev => ({ ...prev, partitions: prev.partitions.slice(0, newCount) }));
    }
}, [partitionCount, materialTypeOptions, materialUFactorMap, interiorZoneOptions, formData.locationInfo.interiorZone]);

useEffect(() => {
    const currentLength = formData.windows.length;
    const newCount = windowCount >= 0 ? windowCount : 0;
    if (newCount > currentLength) {
        const newItems = Array.from({ length: newCount - currentLength }, () => {
            const defaultGlassType = glassTypeOptions?.[0] || '';
            return { id: Date.now() + Math.random(), orientation: 'N', psi: '180', glassType: defaultGlassType, blinds: 'No Blinds', uFactor: '', area: '', interiorZone: formData.locationInfo.interiorZone || interiorZoneOptions[0] || '' };
        });
        setFormData(prev => ({ ...prev, windows: [...prev.windows, ...newItems] }));
    } else if (newCount < currentLength) {
        setFormData(prev => ({ ...prev, windows: prev.windows.slice(0, newCount) }));
    }
}, [windowCount, glassTypeOptions, interiorZoneOptions, glassPropertiesMap, formData.locationInfo.interiorZone]);

    const handleRoomDimensionChange = (field, value) => {
        setRoomDimensionInputs(prev => {
            const newState = { ...prev, [field]: value };
            if (field === 'length' || field === 'width') {
                const newLength = field === 'length' ? parseFloat(value) : parseFloat(newState.length);
                const newWidth = field === 'width' ? parseFloat(value) : parseFloat(newState.width);
                newState.area = (newLength && newWidth) ? (newLength * newWidth).toFixed(2) : '';
            }
            return newState;
        });
    };

    const [safetyFactors, setSafetyFactors] = useState({ duct: 10, overall: 10 });
    const handleSafetyFactorChange = (type, value) => {
        const numericValue = parseInt(value, 10);
        if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
            setSafetyFactors(prev => ({ ...prev, [type]: value === '' ? '' : numericValue }));
        }
    };


    const handleCfpChange = (section, id, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'materialType') {
                        updatedItem.uFactor = materialUFactorMap[value] || '';
                    }
                    return updatedItem;
                }
                return item;
            })
        }));
    };

    const handleDynamicItemChange = (section, id, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'orientation' && value !== 'Custom') {
                        updatedItem.psi = psiValues[value];
                    }
                    if (section === 'walls') {
                        if (field === 'wallType') { updatedItem.uFactor = uFactorMap[value] || ''; }
                        if (field === 'surfaceColor') { updatedItem.alpha_ho = alphaHoMap[value] || ''; }
                    } else if (section === 'windows') {
                        if (field === 'glassType') {
                            const properties = glassPropertiesMap[value];
                            if (properties) {
                                updatedItem.shgc = properties.shgc || '';
                                updatedItem.sc = properties.sc || '';
                            } else {
                                updatedItem.shgc = '';
                                updatedItem.sc = '';
                            }
                        }
                        if (field === 'blinds') {
                            updatedItem.blinds = value;
                            if (value === 'With Blinds') {
                                updatedItem.solarRTSZoneType = '';
                            }
                        }
                    }
                    return updatedItem;
                }
                return item;
            })
        }));
    };

    const handleInputChange = (section, field, value) => {
        setFormData(prev => {
            const newState = { ...prev };
            if (section === 'roof') {
                newState.roof = { ...newState.roof, [field]: value };
                if (field === 'roofType') { newState.roof.uFactor = roofUFactorMap[value] || ''; }
                if (field === 'surfaceColor') { newState.roof.alpha_ho = alphaHoMap[value] || ''; }
            } else if (section === 'locationInfo') {
                const newLocationInfo = { ...newState.locationInfo, [field]: value };

                if (field === 'city' || field === 'calMonth') {
                    const city = (field === 'city') ? value : newLocationInfo.city;
                    const month = (field === 'calMonth') ? value : newLocationInfo.calMonth;

                    if (city && city !== 'Other') { // Check for 'Other'
                        const selectedCityData = provinceHourlyDataMap[city];
                        if (month === '4' && selectedCityData) {
                            newLocationInfo.outsideAirTemp = selectedCityData.temp;
                            newLocationInfo.outsideAirHumidity = selectedCityData.humid;
                        } else {
                            newLocationInfo.outsideAirTemp = initialHourlyData();
                            newLocationInfo.outsideAirHumidity = initialHourlyData();
                        }
                    } else if (city === 'Other' && field === 'city') {
                        newLocationInfo.outsideAirTemp = initialHourlyData();
                        newLocationInfo.outsideAirHumidity = initialHourlyData();
                    }
                }
                newState.locationInfo = newLocationInfo;

            } else {
                newState[section] = { ...newState[section], [field]: value };
            }
            return newState;
        });
    };

    const handleScheduleChange = (section, index, value) => {
        const newSchedule = [...formData[section].schedule];
        newSchedule[index].usage = value;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], schedule: newSchedule } }));

    };


    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        handleInputChange('locationInfo', 'city', '');
        handleInputChange('locationInfo', 'outsideAirTemp', initialHourlyData());
        handleInputChange('locationInfo', 'outsideAirHumidity', initialHourlyData());
    };

    const handleCalculate = async () => {
        setLoading(true);
        setError(null);
        setCalculationResults(null);
        const dataToSend = JSON.parse(JSON.stringify(formData));

        Object.keys(dataToSend).forEach(sectionKey => {
            const section = dataToSend[sectionKey];
            if (typeof section === 'object' && section !== null) {
                if (Array.isArray(section)) {
                    section.forEach(item => {
                        for (const key in item) {
                            if (['psi', 'uFactor', 'area', 'alpha_ho', 'tempdiff', 'count', 'flowRate'].includes(key)) {
                                item[key] = parseFloat(item[key]);
                                if (isNaN(item[key])) item[key] = 0;
                            }
                        }
                    });
                } else {
                    for (const key in section) {
                        if (['longitude', 'latitude', 'taub', 'taud', 'roomTemp', 'roomHumidity', 'altitude', 'uFactor', 'surfaceAngle', 'heatGain', 'sensibleHeat', 'latentHeat', 'count', 'flowRate'].includes(key)) {
                            if (key === 'outsideAirTemp' || key === 'outsideAirHumidity') {
                                section[key] = section[key].map(val => parseFloat(val));
                                section[key] = section[key].map(val => isNaN(val) ? 0 : val);
                            } else {
                                section[key] = parseFloat(section[key]);
                                if (isNaN(section[key])) section[key] = 0;
                            }
                        }
                    }
                }
            }
        });

        dataToSend.windows = dataToSend.windows.map(win => {
            if (win.blinds === 'With Blinds') {
                return { ...win, solarRTSZoneType: null };
            }
            return win;
        });

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ formData: dataToSend })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();

            if (result.status === 'success') {


                const categoryDetails = {
                    windows: { area: formData.windows.reduce((sum, item) => sum + Number(item.area || 0), 0) },
                    walls: { area: formData.walls.reduce((sum, item) => sum + Number(item.area || 0), 0) },
                    roof: { area: Number(formData.roof.area || 0) },
                    floors: { area: formData.floors.reduce((sum, item) => sum + Number(item.area || 0), 0) },
                    partitions: { area: formData.partitions.reduce((sum, item) => sum + Number(item.area || 0), 0) },
                    ceilings: { area: formData.ceilings.reduce((sum, item) => sum + Number(item.area || 0), 0) },
                    people: { count: Number(formData.people.count || 0) },
                    lighting: { heatGain: Number(formData.lighting.heatGain || 0) },

                    equipments: {
                        sensible: Number(formData.equipments.sensibleHeat || 0),
                        latent: Number(formData.equipments.latentHeat || 0)
                    },

                    outdoor: { flowRate: Number(formData.outsideAir.flowRate || 0) },
                };


                const designLoadWithTotal = {
                    ...result.data.designLoad,
                    totalLoad: result.data.sumOfAllLoads,
                };

                setCalculationResults({
                    ...result.data,
                    designLoad: designLoadWithTotal,
                    categoryDetails: categoryDetails,
                });

            } else {
                throw new Error(result.message || 'An unknown error occurred in the script.');
            }
        } catch (e) {
            console.error("Fetch error:", e);
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" min-h-screen py-8">
            <div className="container max-w-7xl px-4 space-y-6">
                <div className="flex items-center justify-center bg-slate-200 h-20 shadow-md rounded-md">
                    <h1 className="font-kanit text-xs md:text-3xl text-center bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                        {t.pageTitle}
                    </h1>
                </div>

                <div className="space-y-6 md:grid-cols-3 gap-4">
                    <FormCard title={t.projectInfo} icon={<HardHat />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="projectName">{t.projectName}</Label>
                                <Input id="projectName" placeholder={t.projectNamePlaceholder} value={formData.projectInfo.projectName} onChange={e => handleInputChange('projectInfo', 'projectName', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="buildingName">{t.buildingName}</Label>
                                <Input id="buildingName" placeholder={t.buildingNamePlaceholder} value={formData.projectInfo.buildingName} onChange={e => handleInputChange('projectInfo', 'buildingName', e.target.value)} />

                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="roomName">{t.roomName}</Label>
                                <Input id="roomName" placeholder={t.roomNamePlaceholder} value={formData.projectInfo.roomName} onChange={e => handleInputChange('projectInfo', 'roomName', e.target.value)} />

                            </div>
                        </div>
                    </FormCard>
                    <FormCard title={t.roomDimension} icon={<Ruler />}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="length">{t.length}</Label>
                                <Input id="length" placeholder={t.lengthPlaceholder} type="number" value={roomDimensionInputs.length} onChange={e => handleRoomDimensionChange('length', e.target.value)} />

                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="width">{t.width}</Label>
                                <Input id="width" placeholder={t.widthPlaceholder} type="number" value={roomDimensionInputs.width} onChange={e => handleRoomDimensionChange('width', e.target.value)} />

                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="ceilingHeight">{t.ceilingHeight}</Label>
                                <Input id="ceilingHeight" placeholder={t.ceilingHeightPlaceholder} type="number" value={roomDimensionInputs.ceilingHeight} onChange={e => handleRoomDimensionChange('ceilingHeight', e.target.value)} />

                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="area">{t.area}</Label>
                                <Input id="area" placeholder={t.areaPlaceholder} type="number" value={roomDimensionInputs.area} readOnly />

                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="floorNo">{t.floorNo}</Label>
                                <Input id="floorNo" placeholder={t.floorNoPlaceholder} type="number" value={roomDimensionInputs.floorNo} onChange={e => handleRoomDimensionChange('floorNo', e.target.value)} />

                            </div>
                        </div>
                    </FormCard>
                    <FormCard title={t.locationInfo} icon={<MapPin />}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            <div className="space-y-1">
                                <Label htmlFor="country">{t.country}</Label>
                                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                                    <SelectTrigger id="country"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Thailand">Thailand</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedCountry === 'Thailand' && (
                                <div className="space-y-1">
                                    <Label htmlFor="city">{t.city}</Label>
                                    <Select value={formData.locationInfo.city} onValueChange={v => handleInputChange('locationInfo', 'city', v)}>
                                        <SelectTrigger id="city"><SelectValue placeholder={t.cityPlaceholder} /></SelectTrigger>
                                        <SelectContent>{[...Object.keys(comprehensiveLocationData), "Other"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            )}

                            {selectedCountry === 'Other' && (
                                <div className="space-y-1">
                                    <Label htmlFor="customCity">{t.otherCityName}</Label>
                                    <Input id="customCity" placeholder={t.otherCityNamePlaceholder} value={formData.locationInfo.city} onChange={e => handleInputChange('locationInfo', 'city', e.target.value)} />
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Label htmlFor="timeZone">{t.timeZone}</Label>
                                    <a
                                        href='https://ashrae-meteo.info/v2.0/'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className="cursor-pointer text-muted-foreground hover:text-blue-600 transition-colors"
                                    >
                                        <Info className="h-4 w-4" />
                                    </a>
                                </div>
                                <Select value={formData.locationInfo.timeZone} onValueChange={v => handleInputChange('locationInfo', 'timeZone', v)}>
                                    <SelectTrigger id="timeZone"><SelectValue /></SelectTrigger>
                                    <SelectContent>{timeZones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="calMonth">{t.calMonth}</Label>
                                <Select value={formData.locationInfo.calMonth} onValueChange={v => handleInputChange('locationInfo', 'calMonth', v)}>
                                    <SelectTrigger id="calMonth"><SelectValue placeholder={t.calMonthPlaceholder} /></SelectTrigger>
                                    <SelectContent>{months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="longitude">{t.longitude}</Label>
                                <Input id="longitude" placeholder={t.longitudePlaceholder} type="number" value={formData.locationInfo.longitude} onChange={e => handleInputChange('locationInfo', 'longitude', e.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="lonHemisphere">{t.lonHemisphere}</Label>
                                <Select value={formData.locationInfo.lonHemisphere} onValueChange={v => handleInputChange('locationInfo', 'lonHemisphere', v)}>
                                    <SelectTrigger id="lonHemisphere"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="E">E</SelectItem><SelectItem value="W">W</SelectItem></SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="latitude">{t.latitude}</Label>
                                <Input id="latitude" placeholder={t.latitudePlaceholder} type="number" value={formData.locationInfo.latitude} onChange={e => handleInputChange('locationInfo', 'latitude', e.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="altitude">{t.altitude}</Label>
                                <Input id="altitude" placeholder={t.altitudePlaceholder} type="number" value={formData.locationInfo.altitude} onChange={e => handleInputChange('locationInfo', 'altitude', e.target.value)} />
                            </div>
                            <div className="space-y-1 item-center">
                                <div className='flex '>
                                    <Label htmlFor="taub">{t.taub}</Label>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Info className="ml-2 mb-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-blue-600" />
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[850px]">

                                            <h3 className="text-lg font-semibold">Beam Optical Depth (τb)</h3>
                                            <img src={tb} alt="Beam Optical Depth (τb)" className=" w-full" />
                                        </DialogContent>
                                    </Dialog></div>
                                <Input id="taub" placeholder={t.taubPlaceholder} value={formData.locationInfo.taub} onChange={e => handleInputChange('locationInfo', 'taub', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <div className='flex '>
                                    <Label htmlFor="taud">{t.taud}</Label>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Info className=" mb-2 ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-blue-600" />
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[850px]">
                                            <h3 className="text-lg font-semibold">Diffuse Optical Depth (τd)</h3>
                                            <img src={td} alt="Diffuse Optical Depth" className=" w-full" />
                                        </DialogContent>
                                    </Dialog></div>
                                <Input id="taud" placeholder={t.taudPlaceholder} value={formData.locationInfo.taud} onChange={e => handleInputChange('locationInfo', 'taud', e.target.value)} />

                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="roomTemp">{t.roomTemp}</Label>
                                <Input id="roomTemp" placeholder={t.roomTempPlaceholder} type="number" value={formData.locationInfo.roomTemp} onChange={e => handleInputChange('locationInfo', 'roomTemp', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="roomHumidity">{t.roomHumidity}</Label>
                                <Input id="roomHumidity" placeholder={t.roomHumidityPlaceholder} type="number" value={formData.locationInfo.roomHumidity} onChange={e => handleInputChange('locationInfo', 'roomHumidity', e.target.value)} />
                            </div>
                                <div className="space-y-1 md:col-span-2">
                            <Label htmlFor="interiorZone">{t.interiorZone}</Label>
                            <Select value={formData.locationInfo.interiorZone} onValueChange={v => handleInputChange('locationInfo', 'interiorZone', v)}>
                            <SelectTrigger id="interiorZone"><SelectValue placeholder={t.interiorZonePlaceholder} /></SelectTrigger>
                                <SelectContent>{interiorZoneOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                        </div>
                            <p className="flex md:col-span-4 text-sm text-red-500 mt-2">{t.manualInputGuidance}
                                <a
                                    href='https://www.wunderground.com/history'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className="ml-2 cursor-pointer text-muted-foreground hover:text-blue-600 transition-colors"
                                >
                                    <Info className="h-4 w-4" />
                                </a>
                            </p>
                            {formData.locationInfo.city && (
                                <div className="md:col-span-4">
                                    <HourlyInputTable
                                        t={t}
                                        tempData={formData.locationInfo.outsideAirTemp}
                                        humidData={formData.locationInfo.outsideAirHumidity}
                                        onTempChange={(newData) => handleInputChange('locationInfo', 'outsideAirTemp', newData)}
                                        onHumidChange={(newData) => handleInputChange('locationInfo', 'outsideAirHumidity', newData)}
                                    />
                                </div>
                            )}
                        </div>
                    </FormCard>

                    <FormCard title={t.wall} icon={<BrickWall />}>
                        <div className="mb-4 space-y-1">
                            <Label htmlFor="wall-count">{t.numberOfWalls}</Label>
                            <Input id="wall-count" type="number" min="0" value={wallCount} onChange={e => setWallCount(parseInt(e.target.value, 10) || 0)} className="w-24" />

                        </div>
                        {formData.walls.map((wall, index) => (
                            <div key={wall.id} className="p-4 border rounded-lg bg-slate-50 mb-4">
                                <h4 className="font-semibold text-sm text-slate-600 mb-2">{t.wallNum}{index + 1}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.orientation}</Label>
                                        <Select value={wall.orientation} onValueChange={v => handleDynamicItemChange('walls', wall.id, 'orientation', v)}>
                                            <SelectTrigger><SelectValue placeholder={t.orientationPlaceholder} /></SelectTrigger>
                                            <SelectContent>{orientations.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.psi}</Label>
                                        <Input placeholder={t.psiPlaceholder} value={wall.psi} onChange={e => handleDynamicItemChange('walls', wall.id, 'psi', e.target.value)} disabled={wall.orientation !== 'Custom'} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.wallType}</Label>
                                        <Select value={wall.wallType} onValueChange={v => handleDynamicItemChange('walls', wall.id, 'wallType', v)}>
                                            <SelectTrigger><SelectValue placeholder={t.wallTypePlaceholder} /></SelectTrigger>
                                            <SelectContent>{wallTypeOptions.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
  <div className="flex items-center space-x-2 mt-2">
    <Label htmlFor={`uFactor-${wall.id}`} className="text-xs">
      {t.uFactor}
    </Label>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://ufactor-calculator.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn more about U-Factor"
          >
            <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to calculate U-Factor.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <Input
    id={`uFactor-${wall.id}`} 
    placeholder={t.uFactorAutoDesc}
    value={wall.uFactor}
    onChange={e => handleDynamicItemChange('walls', wall.id, 'uFactor', e.target.value)}
  />
</div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.wallArea}</Label>
                                        <Input type="number" placeholder={t.wallAreaPlaceholder} value={wall.area} onChange={e => handleDynamicItemChange('walls', wall.id, 'area', e.target.value)} />

                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.surfaceColor}</Label>
                                        <Select value={wall.surfaceColor} onValueChange={v => handleDynamicItemChange('walls', wall.id, 'surfaceColor', v)}>
                                            <SelectTrigger><SelectValue placeholder={t.surfaceColorPlaceholder} /></SelectTrigger>
                                            <SelectContent>{surfaceColorOptions.map(color => (<SelectItem key={color} value={color}>{color}</SelectItem>))}</SelectContent>
                                        </Select>

                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.alphaHo}</Label>
                                        <Input placeholder={t.alphaHoAutoDesc} value={wall.alpha_ho} readOnly disabled />

                                    </div>
                                    <div className="space-y-1">
                                    <Label className="text-xs">{t.interiorZone}</Label>
                                    <Input
                                    value={wall.interiorZone}
                                    readOnly
                                    placeholder="Set from Location Info"
                                    className="bg-slate-100" 
                                    />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </FormCard>

                    <FormCard title={t.window} icon={<Grid2x2 />}>
                        <div className="mb-4 space-y-1">
                            <Label htmlFor="window-count">{t.numberOfWindows}</Label>
                            <Input id="window-count" type="number" min="0" value={windowCount} onChange={e => setWindowCount(parseInt(e.target.value, 10) || 0)} className="w-24" />

                        </div>
                        {formData.windows.map((win, index) => (
                            <div key={win.id} className="p-4 border rounded-lg bg-slate-50 mb-4">
                                <h4 className="font-semibold text-sm text-slate-600 mb-2">{t.windowNum}{index + 1}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.orientation}</Label>
                                        <Select value={win.orientation} onValueChange={v => handleDynamicItemChange('windows', win.id, 'orientation', v)}>
                                            <SelectTrigger><SelectValue placeholder={t.orientationPlaceholder} /></SelectTrigger>
                                            <SelectContent>{orientations.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                        </Select>

                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.psi}</Label>
                                        <Input placeholder={t.psiPlaceholder} value={win.psi} onChange={e => handleDynamicItemChange('windows', win.id, 'psi', e.target.value)} disabled={win.orientation !== 'Custom'} />

                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.glassType}</Label>
                                        <Select value={win.glassType} onValueChange={v => handleDynamicItemChange('windows', win.id, 'glassType', v)}>
                                            <SelectTrigger><SelectValue placeholder={t.glassTypePlaceholder} /></SelectTrigger>
                                            <SelectContent>{glassTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                        </Select>

                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.blinds}</Label>
                                        <Select value={win.blinds} onValueChange={v => handleDynamicItemChange('windows', win.id, 'blinds', v)}>
                                            <SelectTrigger><SelectValue placeholder={t.blindsPlaceholder} /></SelectTrigger>
                                            <SelectContent><SelectItem value="No Blinds">No Blinds</SelectItem><SelectItem value="With Blinds">With Blinds</SelectItem></SelectContent>
                                        </Select>

                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Label className="text-xs">{t.uFactor}</Label>


                                            <Dialog>
                                                <DialogTrigger asChild>

                                                    <Info className="h-4 w-4 cursor-pointer text-gray-500 hover:text-blue-600" />
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[700px]">

                                                    <h3 className="text-lg font-semibold">Windows U-Factor(W/m²·K)</h3>
                                                    <img src={Ufactor} alt="Windows U-Factor Diagram" className=" w-full" />
                                                </DialogContent>
                                            </Dialog>

                                        </div>
                                        <Input
                                            placeholder={t.uFactorManualPlaceholder}
                                            type="number"
                                            value={win.uFactor}
                                            onChange={e => handleDynamicItemChange('windows', win.id, 'uFactor', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{t.windowArea}</Label>
                                        <Input type="number" placeholder={t.windowAreaPlaceholder} value={win.area} onChange={e => handleDynamicItemChange('windows', win.id, 'area', e.target.value)} />

                                    </div>
                                    
                                    <div className="space-y-1">
    <Label className="text-xs">{t.interiorZone}</Label>
    <Input
      value={win.interiorZone}
      readOnly
      placeholder="Set from Location Info"
      className="bg-slate-100" 
    />
</div>
                                </div>
                            </div>
                        ))}
                    </FormCard>

                    <FormCard title={t.roof} icon={<Home />}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">{t.roofType}</Label>
                                <Select value={formData.roof.roofType} onValueChange={v => handleInputChange('roof', 'roofType', v)}>
                                    <SelectTrigger><SelectValue placeholder={t.roofTypePlaceholder} /></SelectTrigger>
                                    <SelectContent>{roofTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>

                            </div>
                            <div className="space-y-1">
  <div className="flex items-center space-x-2 mt-2">
    <Label htmlFor="uFactor" className="text-xs">
      {t.uFactor}
    </Label>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://ufactor-calculator.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn more about U-Factor"
          >
            <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to calculate U-Factor.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <Input
    id="uFactor" 
    placeholder={t.uFactorAutoDesc}
    value={formData.roof.uFactor}
    onChange={e => handleInputChange('roof', 'uFactor', e.target.value)}
  />
</div>

                            <div className="space-y-1">
                                <Label className="text-xs">{t.roofArea}</Label>
                                <Input type="number" placeholder={t.roofAreaPlaceholder} value={formData.roof.area} onChange={e => handleInputChange('roof', 'area', e.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">{t.surfaceColor}</Label>
                                <Select value={formData.roof.surfaceColor} onValueChange={v => handleInputChange('roof', 'surfaceColor', v)}>
                                    <SelectTrigger><SelectValue placeholder={t.surfaceColorPlaceholder} /></SelectTrigger>
                                    <SelectContent>{surfaceColorOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>

                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t.alphaHo}</Label>
                                <Input placeholder={t.alphaHoAutoDesc} value={alphaHoMap[formData.roof.surfaceColor] || ''} readOnly disabled />

                            </div>
                            <div className="space-y-1">
    <Label className="text-xs">{t.interiorZone}</Label>
    <Input
      value={formData.roof.interiorZone}
      readOnly
      placeholder="Set from Location Info"
      className="bg-slate-100" 
    />
</div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t.surfaceAngle}</Label>
                                <Input placeholder={t.surfaceAnglePlaceholder} value={formData.roof.surfaceAngle} onChange={e => handleInputChange('roof', 'surfaceAngle', e.target.value)} />
                            </div>
                        </div>
                    </FormCard>

                    {formData.ceilings.map(item => (
                        <CeilingInput
                            t={t}
                            key={item.id}
                            data={item}
                            onDataChange={handleCfpChange}
                            materialTypeOptions={materialTypeOptions}
                            interiorZoneOptions={interiorZoneOptions}
                        />
                    ))}
                    {formData.floors.map(item => (
                        <FloorInput
                            t={t}
                            key={item.id}
                            data={item}
                            onDataChange={handleCfpChange}
                            materialTypeOptions={materialTypeOptions}
                            interiorZoneOptions={interiorZoneOptions}
                        />
                    ))}

                    <FormCard title={t.partition} icon={<Divide />}>
                        <div className="mb-4 space-y-1">
                            <Label htmlFor="partition-count">{t.numberOfPartitions}</Label>
                            <Input id="partition-count" type="number" min="0" value={partitionCount} onChange={e => setPartitionCount(parseInt(e.target.value, 10) || 0)} className="w-24" />

                        </div>
                        {formData.partitions.map((item, index) => (
                            <div key={item.id} className="p-4 border rounded-lg bg-slate-50 mb-4">
                                <h4 className="font-semibold text-sm text-slate-600 mb-2">{t.partitionNum}{index + 1}</h4>
                                <PartitionInput
                                    t={t}
                                    data={item}
                                    onDataChange={handleCfpChange}
                                    materialTypeOptions={materialTypeOptions}
                                    interiorZoneOptions={interiorZoneOptions}
                                />
                            </div>
                        ))}
                    </FormCard>

                    <FormCard title={t.people} icon={<User />}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1 md:col-span-4">
                                <div className="space-y-1 md:col-span-4">
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor='people-count' className='text-sm font-medium'>{t.peopleCount}</Label>
                                        <a
                                            href='https://roongzaa007.github.io/CO2_Calculator_V1.1.0/'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className="cursor-pointer text-gray-500 hover:text-blue-700 transition-colors"
                                        >
                                            <Info className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                                <Input id="people-count" placeholder={t.peopleCountPlaceholder} type="number" value={formData.people.count} onChange={e => handleInputChange('people', 'count', e.target.value)} />
                            </div>
                            <div className="space-y-1 md:col-span-4">
                                <Label className="text-xs ">{t.activity}</Label>
                                <Select value={formData.people.activity} onValueChange={v => handleInputChange('people', 'activity', v)}>
                                    <SelectTrigger><SelectValue placeholder={t.activityPlaceholder} /></SelectTrigger>
                                    <SelectContent>{activityOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1 md:col-span-4">
    <Label className="text-xs">{t.interiorZone}</Label>
    <Input
      value={formData.people.interiorZone}
      readOnly
      placeholder="Set from Location Info"
      className="bg-slate-100" 
    />
</div>
                        </div>
                        <ScheduleTable t={t} title={t.people} schedule={formData.people.schedule} onScheduleChange={(index, value) => handleScheduleChange('people', index, value)} />
                        <p className="text-xs text-gray-500 mt-2">{t.peopleScheduleDesc}</p>
                    </FormCard>

                    <FormCard title={t.lighting} icon={<Lightbulb />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">{t.lightHeatGain}</Label>
                                <Input placeholder={t.lightHeatGainPlaceholder} value={formData.lighting.heatGain} onChange={e => handleInputChange('lighting', 'heatGain', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t.LType}</Label>
                                <Select value={formData.lighting.coolingType} onValueChange={v => handleInputChange('lighting', 'coolingType', v)}>
                                    <SelectTrigger><SelectValue placeholder={t.LTypePlaceholder} /></SelectTrigger>
                                    <SelectContent>{Loptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                            <Label className="text-xs">{t.interiorZone}</Label>
                            <Input
                            value={formData.lighting.interiorZone}
                            readOnly
                            placeholder="Set from Location Info"
                            className="bg-slate-100" 
                            />
                        </div>
                        </div>
                        <ScheduleTable t={t} title={t.lighting} schedule={formData.lighting.schedule} onScheduleChange={(index, value) => handleScheduleChange('lighting', index, value)} />
                        <p className="text-xs text-gray-500 mt-2">{t.lightingScheduleDesc}</p>
                    </FormCard>

                    <FormCard title={t.equipments} icon={<Backpack />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">{t.sensibleHeat}</Label>
                                <Input placeholder={t.latentHeatPlaceholder} value={formData.equipments.sensibleHeat} onChange={e => handleInputChange('equipments', 'sensibleHeat', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t.latentHeat}</Label>
                                <Input placeholder={t.latentHeatPlaceholder} value={formData.equipments.latentHeat} onChange={e => handleInputChange('equipments', 'latentHeat', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t.coolingType}</Label>
                                <Select value={formData.equipments.coolingType} onValueChange={v => handleInputChange('equipments', 'coolingType', v)}>
                                    <SelectTrigger><SelectValue placeholder={t.coolingTypePlaceholder} /></SelectTrigger>
                                    <SelectContent>{coolingTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t.interiorZone}</Label>
                                <Input
                                value={formData.equipments.interiorZone}
                                readOnly
                             placeholder="Set from Location Info"
                            className="bg-slate-100" 
                            />
                        </div>
                        </div>
                        <ScheduleTable t={t} title={t.equipments} schedule={formData.equipments.schedule} onScheduleChange={(index, value) => handleScheduleChange('equipments', index, value)} />
                        <p className="text-xs text-gray-500 mt-2">{t.equipmentScheduleDesc}</p>
                    </FormCard>

                    <FormCard title={t.outsideAir} icon={<Wind />}>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="oa-flow" className="text-sm font-medium">{t.oaFlowRate}</Label>
                                <a
                                    href='https://roongzaa007.github.io/CO2_Calculator_V1.1.0/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className="cursor-pointer text-gray-500 hover:text-blue-700 transition-colors"
                                >
                                    <Info className="h-4 w-4" />
                                </a>
                            </div>
                            <Input
                                id="oa-flow"
                                placeholder={t.oaFlowRate}
                                value={formData.outsideAir.flowRate}
                                onChange={e => handleInputChange('outsideAir', 'flowRate', e.target.value)}
                            />
                        </div>
                        <div className="mt-6">
                            <ScheduleTable
                                t={t}
                                title={t.outsideAir}
                                schedule={formData.outsideAir.schedule}
                                onScheduleChange={(index, value) => handleScheduleChange('outsideAir', index, value)}
                            />
                            <p className="text-xs text-gray-500 mt-2">{t.airusageProfileDesc}</p>
                        </div>
                    </FormCard>

                </div>
                <FormCard title="Safety Factors" icon={<Shield />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="duct-sf">Duct Loss (%)</Label>
                            <Input
                                id="duct-sf"
                                type="number"
                                min="0"
                                value={safetyFactors.duct}
                                onChange={e => handleSafetyFactorChange('duct', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="overall-sf">Overall Safety Factor (%)</Label>
                            <Input
                                id="overall-sf"
                                type="number"
                                min="0"
                                value={safetyFactors.overall}
                                onChange={e => handleSafetyFactorChange('overall', e.target.value)}
                            />
                        </div>
                    </div>
                </FormCard>
                <div className="flex flex-row justify-center items-center gap-4 py-6">
                    <Button
                        size="lg"
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-slate-400"
                        onClick={handleCalculate}
                        disabled={loading}
                    >
                        {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Calculator className="w-6 h-6" />}
                        {loading ? t.calculatingButton : t.calculateButton}
                    </Button>
                </div>
                {error && (
                    <FormCard title={t.errorCardTitle} icon={<ServerCrash className="text-red-500" />}>
                        <p className="text-red-600 font-mono bg-red-50 p-4 rounded-md">{error}</p>
                    </FormCard>
                )}
                {calculationResults && (
                    <div className="space-y-6">
                        <ResultsDisplay
                            t={t}
                            projectInfo={formData.projectInfo}
                            locationInfo={formData.locationInfo}
                            categoryDetails={calculationResults.categoryDetails}
                            roomDimension={roomDimensionInputs}
                            safetyFactors={safetyFactors}
                            designLoad={calculationResults.designLoad}
                            designSensibleLoad={calculationResults.designSensibleLoad}
                            designLatentLoad={calculationResults.designLatentLoad}
                            categoryPeakLoads={calculationResults.categoryPeakLoads}
                            categoryPeakSensibleLoads={calculationResults.categoryPeakSensibleLoads}
                            categoryPeakLatentLoads={calculationResults.categoryPeakLatentLoads}
                            categoryHourlyLoads={calculationResults.categoryHourlyLoads}
                            categoryHourlySensibleLoads={calculationResults.categoryHourlySensibleLoads}
                            categoryHourlyLatentLoads={calculationResults.categoryHourlyLatentLoads}
                            categoryCounts={categoryCounts}
                            projectHourlyTotalLoads={calculationResults.projectHourlyTotalLoads}
                            projectHourlySensibleLoads={calculationResults.projectHourlySensibleLoads}
                            projectHourlyLatentLoads={calculationResults.projectHourlyLatentLoads}
                        />
                    </div>
                )}
            </div>
        </div>

    );
};

export default CoolingLoad;