import React, { useState, useEffect } from 'react';
import { Download, Upload, FileSpreadsheet, XCircle, Loader2, Thermometer, Zap, BarChart2, Activity, Percent, CheckCircle, LoaderPinwheel, BadgeDollarSign, List, RefreshCcw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import * as XLSX from 'xlsx';
import LanguageToggle from "../contexts/LanguageToggle";
import { useLanguage } from "../contexts/LanguageContext";
import axios from 'axios';
import { toast } from 'sonner';


import { COUNTRIES } from '../data/countries'; 


const timeRangeKeysBackend = [
    '06.00-12.00', '06.00-15.00', '06.00-18.00', '06.00-21.00', '06.00-24.00',
    '06.00-03.00', '06.00-06.00',
    '09.00-15.00', '09.00-18.00', '09.00-21.00', '09.00-24.00',
    '09.00-03.00', '09.00-06.00', '09.00-09.00',
    '12.00-18.00', '12.00-21.00', '12.00-24.00',
    '12.00-03.00', '12.00-06.00', '12.00-09.00', '12.00-12.00',
    '15.00-21.00', '15.00-24.00',
    '15.00-03.00', '15.00-06.00', '15.00-09.00', '15.00-12.00', '15.00-15.00',
    '18.00-24.00',
    '18.00-03.00', '18.00-06.00', '18.00-09.00', '18.00-12.00', '18.00-15.00', '18.00-18.00',
    '21.00-03.00', '21.00-06.00', '21.00-09.00', '21.00-12.00', '21.00-15.00', '21.00-18.00', '21.00-21.00',
    '24.00-06.00', '24.00-09.00', '24.00-12.00', '24.00-15.00', '24.00-18.00', '24.00-21.00', '24.00-24.00'
];


const timeRangeDisplayValues = [
    '6:00 AM - 12:00 PM', '6:00 AM - 3:00 PM', '6:00 AM - 6:00 PM', '6:00 AM - 9:00 PM', '6:00 AM - 12:00 AM (midnight)',
    '6:00 AM - 3:00 AM (next day)', '6:00 AM - 6:00 AM (next day)',
    '9:00 AM - 3:00 PM', '9:00 AM - 6:00 PM', '9:00 AM - 9:00 PM', '9:00 AM - 12:00 AM (midnight)',
    '9:00 AM - 3:00 AM (next day)', '9:00 AM - 6:00 AM (next day)', '9:00 AM - 9:00 AM (next day)',
    '12:00 PM - 6:00 PM', '12:00 PM - 9:00 PM', '12:00 PM - 12:00 AM (midnight)',
    '12:00 PM - 3:00 AM (next day)', '12:00 PM - 6:00 AM (next day)', '12:00 PM - 9:00 AM (next day)', '12:00 PM - 12:00 PM (next day)',
    '3:00 PM - 9:00 PM', '3:00 PM - 12:00 AM (midnight)',
    '3:00 PM - 3:00 AM (next day)', '3:00 PM - 6:00 AM (next day)', '3:00 PM - 9:00 AM (next day)', '3:00 PM - 12:00 PM (next day)', '3:00 PM - 3:00 PM (next day)',
    '6:00 PM - 12:00 AM (midnight)',
    '6:00 PM - 3:00 AM (next day)', '6:00 PM - 6:00 AM (next day)', '6:00 PM - 9:00 AM (next day)', '6:00 PM - 12:00 PM (next day)', '6:00 PM - 3:00 PM (next day)', '6:00 PM - 6:00 PM (next day)',
    '9:00 PM - 3:00 AM (next day)', '9:00 PM - 6:00 AM (next day)', '9:00 PM - 9:00 AM (next day)', '9:00 PM - 12:00 PM (next day)', '9:00 PM - 3:00 PM (next day)', '9:00 PM - 6:00 PM (next day)', '9:00 PM - 9:00 PM (next day)',
    '12:00 AM (next day) - 6:00 AM (next day)', '12:00 AM (next day) - 9:00 AM (next day)', '12:00 AM (next day) - 12:00 PM (next day)', '12:00 AM (next day) - 3:00 PM (next day)', '12:00 AM (next day) - 6:00 PM (next day)', '12:00 AM (next day) - 9:00 PM (next day)', '12:00 AM (next day) - 12:00 AM (next day)'
];

// Create a mapping object for easy lookup
const timeRangeMapping = timeRangeKeysBackend.reduce((acc, key, index) => {
    acc[timeRangeDisplayValues[index]] = key;
    return acc;
}, {} as Record<string, string>);


const reverseTimeRangeMapping = timeRangeDisplayValues.reduce((acc, display, index) => {
    acc[timeRangeKeysBackend[index]] = display;
    return acc;
}, {} as Record<string, string>);


const timeRanges_hourArrays = {
    '06.00-12.00': Array.from({ length: 12 - 6 }, (_, i) => i + 6),
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL_CALCULATE_SUMMARY = `${API_BASE_URL}/calculate-seer-range-summary`;
const API_URL_LIST_FILES = `${API_BASE_URL}/api/files`;

const INITIAL_BIN_TEMP = 21;
const INITIAL_DES = 13443.83;
const INITIAL_C_FULL = 13443.83;
const INITIAL_C_HALF = 6721.915;
const INITIAL_P_FULL = 940;
const INITIAL_P_HALF = 427;
const INITIAL_COIL_INLET_DRY_BULB = 27.0;
const INITIAL_COIL_INLET_WET_BULB = 19.4;
const INITIAL_ELECTRICITY_RATE = 4.00;
const INITIAL_WORKING_DAY_PER_YEAR = 365;

interface ArchivedFile {
    id: string;
    name: string;
    original_name: string;
    uploadedAt: string;
}

interface Country {
    id: string;      
    name: string; 
}

interface CalculationResult {
    overall_seer: number;
    total_sumLCST_Wh: number;
    total_sumCCSE_kwh: number;
    total_cost_per_year: number;
    temperature_distribution_hours: Record<string, number>;
    load_factor?: number;
    energy_consumption_kwh?: number;
    uploaded_file_id?: string;
}


const UploadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadedFilesList, setUploadedFilesList] = useState<{ id: string, name: string, uploadedAt: string }[]>([]);
    const [selectedArchivedFileId, setSelectedArchivedFileId] = useState<string | null>(null);
    const [calculatedOnce, setCalculatedOnce] = useState(false);
    const { lang } = useLanguage();

    const [mode, setMode] = useState<'Fixed' | 'Variable'>('Fixed');
    const [binTempInput, setBinTempInput] = useState<number>(INITIAL_BIN_TEMP);
    const [timeRangeDisplayInput, setTimeRangeDisplayInput] = useState<string>('6:00 AM - 6:00 PM');
    const [designCoolingLoadInput, setDesignCoolingLoadInput] = useState<number>(INITIAL_DES);
    const [fullCapacityInput, setFullCapacityInput] = useState<number>(INITIAL_C_FULL);
    const [pFullInput, setPfullInput] = useState<number>(INITIAL_P_FULL);
    const [pHalfInput, setPhalfInput] = useState<number>(INITIAL_P_HALF);
    const [coilInletDryBulbInput, setCoilInletDryBulbInput] = useState<number>(INITIAL_COIL_INLET_DRY_BULB);
    const [coilInletWetBulbInput, setCoilInletWetBulbInput] = useState<number>(INITIAL_COIL_INLET_WET_BULB);
    const [electricityRateInput, setElectricityRateInput] = useState<number>(INITIAL_ELECTRICITY_RATE);
    const [workingDayPerYearInput, setWorkingDayPerYearInput] = useState<number>(INITIAL_WORKING_DAY_PER_YEAR);

    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

    const [calculatedResults, setCalculatedResults] = useState<{
        fixed_mode_results: CalculationResult | null;
        variable_mode_results: CalculationResult | null;
        parameters_used: Record<string, any> | null;
    }>({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });

    const [selectedUploadMethod, setSelectedUploadMethod] = useState<'new' | 'existing'>('new'); 

    
    useEffect(() => {
        if (selectedUploadMethod === 'existing') {
            fetchUploadedFiles();
        }
    }, [selectedUploadMethod]);

    
    useEffect(() => {
        setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });
        setCalculatedOnce(false); 
    }, [binTempInput, timeRangeDisplayInput, designCoolingLoadInput, fullCapacityInput, pFullInput, pHalfInput, coilInletDryBulbInput, coilInletWetBulbInput, electricityRateInput, workingDayPerYearInput]);

    
    useEffect(() => {
        setCalculatedOnce(false);
        
        if (calculatedResults.fixed_mode_results || calculatedResults.variable_mode_results) {
            toast.info(lang === 'th' ? "เปลี่ยนประเภทคอมเพรสเซอร์แล้ว โปรดคำนวณใหม่เพื่อให้ได้ผลลัพธ์ที่ถูกต้องสำหรับโหมดใหม่" : "Compressor type changed. Please recalculate to see results for the new mode.");
        }
    }, [mode]);


    const text = {
        en: {
            title: "Calculate SEER and Energy Consumption",
            desc: "Upload a CSV or Excel file containing system operation data, and this tool will automatically calculate SEER and energy Consumption.",
            usage: "Usage Instructions",
            step1: "Step 1 -",
            step2: "Step 2 -",
            step3: "Step 3 -",
            step4: "Step 4 -",
            download: "Prepare your temperature data file (.xlsx or .csv). View available sample data here:",
            template: "Data Template (.xlsx)",
            open: "Fill in the air conditioner information",
            coldesc: "The template file should contain two columns: 'datetime' (e.g.,YYYY-MM-DD HH:MM:SS) and 'temp' (temperature in °C). Please ensure these column names are exact. Fill in your system's hourly temperature and timestamp data.",
            fillall: "Fill in all columns completely. The tool will calculate SEER and energy Consumption based on your input parameters below.",
            selectfile: 'Select File" below and select the .xlsx or .csv file you prepared. Then, enter the country, city, and year for the file name, and click "Upload File." The system will automatically calculate the following values:',
            choosefile: "Choose File",
            uploadAndCalculate: "Upload & Calculate",
            seer: "SEER (Seasonal Energy Efficiency Ratio)",
            energy: "Energy Consumption",
            eff: "Energy Efficiency (%)",
            total: "Total Cooling Output/Consumption",
            processing: "Processing...",
            done: "File processed successfully",
            resultfile: 'The calculated results are displayed above.',
            formula: "Formulas used for calculation:",
            seerformula: "• SEER = LCST / CCSE × 3.412",
            lcstformula: "• LCST = Lc × Total Hours (or Qfull × Total Hours if Lc > Qfull)",
            ccseformula: "• CCSE = Pfull × Total Hours (or Phalf × Total Hours if Lc ≤ Qhalf in Variable mode)",
            langBtn: "TH",
            mode: "Compressor type:",
            fixedTypetext: "Fixed Type",
            variableTypetext: "Variable Type",
            fixedType: "Fixed Type❄️",
            variableType: "Variable Type☃️",
            binTemp: "Outdoor Temperature (°C):",
            timeRange: "Time Range:",
            designCoolingLoad: "Design Cooling Load (Btu/hr):",
            fullCapacity: "Full Capacity (Btu/hr)",
            halfCapacity: "Half Capacity (Btu/hr)",
            powerAtFullLoadFixed: "Power at Full Load Fixed (W)",
            powerAtFullLoadVariable: "Power at Full Load Variable (W)",
            powerAtPartLoadVariable: "Power at Part Load Variable (W)",
            coilInletDryBulb: "Coil Inlet Dry Bulb (°C):",
            calculate: "Calculate",
            calculateAgain: "Calculate Again",
            currentCalc: "Current Calculation Parameters & Results",
            operatingDaysInRange: "Operating Days (Selected Range)",
            operatingDaysSpecificBin: "Operating Days (Specific Bin)",
            lcst: "Load Calculation for Seasonal Total (LCST)",
            ccse: "Cooling Consumption for Seasonal Energy (CCSE)",
            fcsp: "FCSP:",
            totalHours: "Total Matched Hours:",
            loadFactor: "Load Factor",
            energyConsumptionPerDay: "Energy Consumption per Day (kWh/day)",
            electricityRate: "Electricity Rate (Baht/kWh)",
            energyConsumption: "Energy Consumption (kWh)",
            workingDayPerYear: "Working Day Per Year",
            orSelectArchived: "Or select an existing file:",
            selectArchivedFile: "Select a previously uploaded file",
            noArchivedFiles: "No files have been uploaded and saved yet.",
            refreshList: "Refresh List",
            electricityCostPerYear: "Electricity cost per year (Baht/year)",
            note: "NOTE:",
            seerDefinition: "SEER is an index used to measure the energy efficiency of an air conditioner over the entire cooling season. It is calculated by comparing the total amount of cooling provided (Btu) to the total electrical energy consumed during the same period (Wh).",
            select: "Select an existing Dataset",
            saveConfirmation: "This action will upload and permanently store the selected file on the server. Do you want to proceed? The file will be named as [Country]_[City]_[Year]_[OriginalFilename].",
            saveFileButton: "Save File",
            savingFileButton: "Saving...",
            confirmSaveTitle: "Confirm File Upload & Calculation",
            confirmSaveDescription: "By proceeding, you agree to upload the selected file to the server and initiate the SEER calculation. The file will be named as [Country]_[City]_[Year]_[OriginalFilename].",
            confirmSaveConfirm: "Confirm & Proceed",
            confirmSaveCancel: "Cancel",
            country: "Country:",
            city: "City:",
            year: "Year:",
            selectCountry: "Select Country",
            enterCity: "Enter City",
            enterYear: "Enter Year (e.g., 2024)",
            agreeTerms: "I agree to upload this file and acknowledge that it will be permanently stored on the server and used for SEER calculation.",
            fileRenameNote: "File will be saved as [Country]_[City]_[Year]_[OriginalFilename]",
            ExistingFile: "Select Existing Dataset",
            UploadNewFile: "Upload New File and Calculate Results"
        },
        th: {
            title: "คำนวณ SEER และการใช้พลังงาน",
            desc: "อัปโหลดไฟล์ CSV หรือ Excel ที่มีข้อมูลการทำงานของระบบ เครื่องมือนี้จะคำนวณ SEER และการใช้พลังงานให้อัตโนมัติ",
            usage: "วิธีใช้งาน",
            step1: "ขั้นที่ 1 -",
            step2: "ขั้นที่ 2 -",
            step3: "ขั้นที่ 3 -",
            step4: "ขั้นตอนที่ 4 -",
            download: "เตรียมไฟล์ข้อมูลอุณหภูมิของคุณ (.xlsx หรือ .csv) เปิดดูข้อมูลตัวอย่างที่ใช้ได้ที่นี่:",
            template: "เทมเพลตข้อมูล (.xlsx)",
            open: "กรอกข้อมูลของเครื่องปรับอากาศ",
            coldesc: "ไฟล์เทมเพลตควรมีสองคอลัมน์: 'datetime' (เช่นYYYY-MM-DD HH:MM:SS) และ 'temp' (อุณหภูมิเป็น °C) โปรดตรวจสอบให้แน่ใจว่าชื่อคอลัมน์ถูกต้อง กรอกข้อมูลอุณหภูมิและเวลาการทำงานรายชั่วโมงของระบบของคุณ",
            fillall: "กรอกข้อมูลให้ครบทุกคอลัมน์ ระบบจะคำนวณ SEER และการใช้พลังงานตามข้อมูลที่คุณป้อนด้านล่าง",
            selectfile: 'เลือกไฟล์เพื่ออัปโหลดโดยคลิกปุ่ม "Choose File" ด้านล่าง แล้วเลือกไฟล์ .xlsx หรือ .csv ที่คุณเตรียมไว้ จากนั้นระบุประเทศ เมือง และปีสำหรับตั้งชื่อไฟล์ แล้วคลิก "อัปโหลดไฟล์" ระบบจะคำนวณค่าต่อไปนี้ให้อัตโนมัติ:',
            choosefile: "Choose File",
            uploadAndCalculate: "อัปโหลดและคำนวณ",
            seer: "SEER (อัตราส่วนประสิทธิภาพพลังงานตามฤดูกาล)",
            energy: "การใช้พลังงาน",
            eff: "ประสิทธิภาพพลังงาน (%)",
            total: "ผลรวม Cooling Output/Consumption",
            processing: "กำลังประมวลผล...",
            done: "ประมวลผลไฟล์เสร็จสิ้น!",
            resultfile: 'ผลลัพธ์การคำนวณจะแสดงอยู่ด้านบน',
            formula: "สูตรที่ใช้ในการคำนวณ:",
            seerformula: "• SEER = LCST / CCSE × 3.412",
            lcstformula: "• LCST = Lc × ชั่วโมงรวม (หรือ Qfull × ชั่วโมงรวม หาก Lc > Qfull)",
            ccseformula: "• CCSE = Pfull × ชั่วโมงรวม (หรือ Phalf × ชั่วโมงรวม หาก Lc ≤ Qhalf ในโหมด Variable)",
            langBtn: "EN",
            mode: "Compressor type:",
            fixedTypetext: "ประเภท Fixed",
            variableTypetext: "ประเภท Variable",
            fixedType: "ประเภท Fixed Speed❄️",
            variableType: "ประเภท Variable☃️",
            binTemp: "อุณหภูมิภายนอก (°C):",
            timeRange: "ช่วงเวลา:",
            designCoolingLoad: "ภาระการทำความเย็นออกแบบ (Btu/hr):",
            fullCapacity: "ความสามารถทำความเย็นเต็มพิกัด (Btu/hr):",
            halfCapacity: "ความสามารถทำความเย็นครึ่งพิกัด (Bttu/hr):",
            powerAtFullLoadFixed: "กำลังไฟฟ้าที่สภาวะทำความเย็นเต็มพิกัด (W)",
            powerAtFullLoadVariable: "กำลังไฟฟ้าที่สภาวะทำความเย็นเต็มพิกัด (W)",
            powerAtPartLoadVariable: "กำลังไฟฟ้าที่สภาวะทำความเย็นบางส่วน (W)",
            coilInletDryBulb: "อุณหภูมิกระเปาะแห้งทางเข้าคอยล์ (°C)",
            calculate: "คำนวณ",
            calculateAgain: "คำนวณอีกครั้ง",
            currentCalc: "พารามิเตอร์และผลลัพธ์การคำนวณปัจจุบัน",
            operatingDaysInRange: "จำนวนวันทำงาน (ช่วงที่เลือก)",
            operatingDaysSpecificBin: "จำนวนวันทำงาน (Bin ที่ระบุ):",
            lcst: "ผลรวมภาระการทำความเย็นตามฤดูกาล (LCST)",
            ccse: "ปริมาณการใช้พลังงานไฟฟ้าตามฤดูกาล (CCSE)",
            fcsp: "FCSP:",
            totalHours: "ชั่วโมงที่ตรงกันทั้งหมด",
            loadFactor: "ตัวประกอบภาระ",
            energyConsumptionPerDay: "ปริมาณการใช้พลังงานไฟฟ้าต่อวัน (kWh/วัน)",
            electricityRate: "อัตราค่าไฟฟ้า (บาท/kWh)",
            energyConsumption: "การใช้พลังงาน (kWh)",
            workingDayPerYear: "จำนวนวันทำงานต่อปี",
            orSelectArchived: "หรือเลือกไฟล์ที่มีอยู่:",
            selectArchivedFile: "เลือกไฟล์ที่เคยอัปโหลด",
            noArchivedFiles: "ยังไม่มีไฟล์ที่อัปโหลดและบันทึกไว้",
            refreshList: "รีเฟรชรายการ",
            electricityCostPerYear: "ค่าไฟฟ้าต่อปี (บาท/ปี)",
            note: "หมายเหตุ:",
            seerDefinition: "SEER คือดัชนีที่ใช้วัดประสิทธิภาพการใช้พลังงานของเครื่องปรับอากาศตลอดฤดูทำความเย็น โดยคำนวณจากปริมาณความเย็นทั้งหมดที่ให้ (Btu) เทียบกับพลังงานไฟฟ้าทั้งหมดที่ใช้ในช่วงเวลาเดียวกัน (Wh) หรือ Btu/Wh",
            select: "เลือกชุดข้อมูลที่มีอยู่",
            saveConfirmation: "This action will upload and permanently store the selected file on the server. Do you want to proceed? The file will be named as [Country]_[City]_[Year]_[OriginalFilename].",
            saveFileButton: "บันทึกไฟล์",
            savingFileButton: "กำลังบันทึก...",
            confirmSaveTitle: "ยืนยันการอัปโหลดและคำนวณ",
            confirmSaveDescription: "By proceeding, you agree to upload the selected file to the server and initiate the SEER calculation. The file will be named as [Country]_[City]_[Year]_[OriginalFilename].",
            confirmSaveConfirm: "Confirm & Proceed",
            confirmSaveCancel: "Cancel",
            country: "ประเทศ:",
            city: "เมือง:",
            year: "ปี:",
            selectCountry: "เลือกประเทศ",
            enterCity: "ป้อนชื่อเมือง",
            enterYear: "ป้อนปี (เช่น 2024)",
            agreeTerms: "ฉันยินยอมให้อัปโหลดไฟล์นี้และรับทราบว่าจะถูกจัดเก็บอย่างถาวรบนเซิร์ฟเวอร์และใช้สำหรับการคำนวณ SEER",
            fileRenameNote: "ไฟล์จะถูกบันทึกเป็น [ประเทศ]_[เมือง]_[ปี]_[ชื่อไฟล์เดิม]",
            ExistingFile: "เลือกชุดข้อมูลที่มีอยู่",
            UploadNewFile: "อัปโหลดไฟล์ใหม่ และ คำนวณผลลัพธ์"
        }
    };

    const fetchUploadedFiles = async () => {
        setProcessing(true);
        try {
            const response = await axios.get(API_URL_LIST_FILES);
            const files = response.data
                .filter((file: any) => file && (file.mongo_id || file._id))
                .map((file: any) => ({
                    id: file.mongo_id || file._id, 
                    name: file.original_name,
                    uploadedAt: file.uploaded_at,
                }))
                .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, lang === 'th' ? 'th' : 'en'));

            setUploadedFilesList(files);
        } catch (e) {
            setUploadedFilesList([]);
            toast.error(lang === 'th' ? 'ไม่สามารถดึงรายการไฟล์ที่อัปโหลดได้' : 'Failed to fetch uploaded files list.');
        } finally {
            setProcessing(false);
        }
    };

    const createAndDownloadTemplate = (type: string) => {
        let wb = XLSX.utils.book_new();

        if (type === 'Data-Template') {
            const headers = [
                ['datetime', 'temp']
            ];
            const exampleData = [
                ['2024-01-01T00:00', 5],
                ['2024-01-01T01:00', 5.4],
                ['2024-01-01T02:00', 5.1],
                ['2024-01-01T03:00', 4.7],
                ['2024-01-01T04:00', 4.4],
                ['2024-01-01T05:00', 3.9],
                ['2024-01-01T06:00', 3.8],
                ['2024-01-01T07:00', 3.5],
                ['2024-01-01T08:00', 3.9],
                ['2024-01-01T09:00', 4.9],
                ['2024-01-01T10:00', 6.4],
                ['2024-01-01T11:00', 7.2],
                ['2024-01-01T12:00', 6.3],
                ['2024-01-01T13:00', 7.4],
                ['2024-01-01T14:00', 7.4],
                ['2024-01-01T15:00', 6.8],
                ['2024-01-01T16:00', 6.4],
                ['2024-01-01T17:00', 5.7],
                ['2024-01-01T18:00', 5.2],
                ['2024-01-01T19:00', 4.9],
                ['2024-01-01T20:00', 4.7],
                ['2024-01-01T21:00', 4.4],
                ['2024-01-01T22:00', 3.7],
                ['2024-01-01T23:00', 4.2],
                ['2024-01-02T00:00', 4.8],
                ['2024-01-02T01:00', 4.4],
                ['2024-01-02T02:00', 3.8],
                ['2024-01-02T03:00', 3],
                ['2024-01-02T04:00', 2.6],
                ['2024-01-02T05:00', 2.6],
                ['2024-01-02T06:00', 2.5],
                ['2024-01-02T07:00', 2.7],
                ['2024-01-02T08:00', 3.2],
                ['2024-01-02T09:00', 4.1],
                ['2024-01-02T10:00', 4.7],
                ['2024-01-02T11:00', 4.9],
                ['2024-01-02T12:00', 4.8],
                ['2024-01-02T13:00', 5],
                ['2024-01-02T14:00', 4.9],
                ['2024-01-02T15:00', 4.9],
                ['2024-01-02T16:00', 5],
                ['2024-01-02T17:00', 5.1],
                ['2024-01-02T18:00', 5.5],
                ['2024-01-02T19:00', 6.4],
                ['2024-01-02T20:00', 7],
                ['2024-01-02T21:00', 7],
                ['2024-01-02T22:00', 7.3],
                ['2024-01-02T23:00', 8],
                ['2024-01-03T00:00', 8.1],
                ['2024-01-03T01:00', 8.3],
                ['2024-01-03T02:00', 8.6],
                ['2024-01-03T03:00', 8.4],
                ['2024-01-03T04:00', 9],
                ['2024-01-03T05:00', 8.8],
                ['2024-01-03T06:00', 8.6],
                ['2024-01-03T07:00', 8.6],
                ['2024-01-03T08:00', 8.8],
                ['2024-01-03T09:00', 9.2],
                ['2024-01-03T10:00', 9.7],
                ['2024-01-03T11:00', 10],
                ['2024-01-03T12:00', 10],
                ['2024-01-03T13:00', 10.6],
                ['2024-01-03T14:00', 10.1],
                ['2024-01-03T15:00', 9.3],
                ['2024-01-03T16:00', 8.9],
                ['2024-01-03T17:00', 8.4],
                ['2024-01-03T18:00', 8.5],
                ['2024-01-03T19:00', 8.4],
                ['2024-01-03T20:00', 8.5],
                ['2024-01-03T21:00', 7.5],
                ['2024-01-03T22:00', 7.3],
                ['2024-01-03T23:00', 7],
                ['2024-01-04T00:00', 7.1],
                ['2024-01-04T01:00', 7.3],
                ['2024-01-04T02:00', 7.1],
                ['2024-01-04T03:00', 7.1],
                ['2024-01-04T04:00', 7.2],
                ['2024-01-04T05:00', 7.1],
                ['2024-01-04T06:00', 7],
                ['2024-01-04T07:00', 6.4],
                ['2024-01-04T08:00', 5.5],
                ['2024-01-04T09:00', 4.8],
                ['2024-01-04T10:00', 4.2],
                ['2024-01-04T11:00', 3.7],
                ['2024-01-04T12:00', 3.3],
                ['2024-01-04T13:00', 2.5],
                ['2024-01-04T14:00', 2.5],
                ['2024-01-04T15:00', 2.2],
                ['2024-01-04T16:00', 1.6],
                ['2024-01-04T17:00', 1.1],
                ['2024-01-04T18:00', 0.5],
                ['2024-01-04T19:00', -0.3],
                ['2024-01-04T20:00', -2.2],
                ['2024-01-04T21:00', -1],
                ['2024-01-04T22:00', -0.2],
                ['2024-01-04T23:00', -0.6],
                ['2024-01-05T00:00', -0.4],
                ['2024-01-05T01:00', 0.3],
                ['2024-01-05T02:00', 0.3],
                ['2024-01-05T03:00', 0.4],
                ['2024-01-05T04:00', 0.4],
                ['2024-01-05T05:00', 0.4],
                ['2024-01-05T06:00', 0.5],
                ['2024-01-05T07:00', 0.5],
                ['2024-01-05T08:00', 0.5],
                ['2024-01-05T09:00', 0.6],
                ['2024-01-05T10:00', 0.7],
                ['2024-01-05T11:00', 0.4],
                ['2024-01-05T12:00', 0.2],
                ['2024-01-05T13:00', 0.5],
                ['2024-01-05T14:00', 0.5],
                ['2024-01-05T15:00', 0.4],
                ['2024-01-05T16:00', 0.4],
                ['2024-01-05T17:00', 0.6],
                ['2024-01-05T18:00', 0.8],
                ['2024-01-05T19:00', 0.9],
                ['2024-01-05T20:00', 0.9],
                ['2024-01-05T21:00', 0.6],
                ['2024-01-05T22:00', 0.8],
                ['2024-01-05T23:00', 1],
                ['2024-01-06T00:00', 1],
                ['2024-01-06T01:00', 0.1],
                ['2024-01-06T02:00', -0.3],
                ['2024-01-06T03:00', -0.5],
                ['2024-01-06T04:00', -0.3],
                ['2024-01-06T05:00', 0],
                ['2024-01-06T06:00', 0.3],
                ['2024-01-06T07:00', 0.3],
                ['2024-01-06T08:00', 0.3],
                ['2024-01-06T09:00', 0.2],
                ['2024-01-06T10:00', 0.1],
                ['2024-01-06T11:00', 0],
                ['2024-01-06T12:00', 0],
                ['2024-01-06T13:00', -0.6],
                ['2024-01-06T14:00', -0.8],
                ['2024-01-06T15:00', -1.1],
                ['2024-01-06T16:00', -1.2],
                ['2024-01-06T17:00', -1.2],
                ['2024-01-06T18:00', -1.2],
                ['2024-01-06T19:00', -1.3],
                ['2024-01-06T20:00', -1.5],
                ['2024-01-06T21:00', -1.7],
                ['2024-01-06T22:00', -1.8],
                ['2024-01-06T23:00', -1.8],
                ['2024-01-07T00:00', -2],
                ['2024-01-07T01:00', -2.3],
                ['2024-01-07T02:00', -2.6],
                ['2024-01-07T03:00', -2.9],
                ['2024-01-07T04:00', -3.4],
                ['2024-01-07T05:00', -4.1],
                ['2024-01-07T06:00', -4.3],
                ['2024-01-07T07:00', -4.3],
                ['2024-01-07T08:00', -3.8],
                ['2024-01-07T09:00', -2.1],
                ['2024-01-07T10:00', -1.3],
                ['2024-01-07T11:00', -1],
                ['2024-01-07T12:00', -0.9],
                ['2024-01-07T13:00', -0.3],
                ['2024-01-07T14:00', -0.5],
                ['2024-01-07T15:00', -0.9],
                ['2024-01-07T16:00', -1],
                ['2024-01-07T17:00', -2.5],
                ['2024-01-07T18:00', -3.9],
                ['2024-01-07T19:00', -4.5],
                ['2024-01-07T20:00', -5.4],
            ];
            const ws = XLSX.utils.aoa_to_sheet([...headers, ...exampleData]);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'Template_Input_Data.xlsx');
            toast.info(lang === 'th' ? 'ดาวน์โหลดเทมเพลตแล้ว' : 'Template downloaded!');
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            if (fileExtension === 'csv' || fileExtension === 'xlsx') {
                setSelectedFile(file);
                setUploadError(null);
                setUploadSuccess(false);
                setCalculatedOnce(false); 
                setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });
                setSelectedArchivedFileId(null); 
                toast.info(lang === 'th' ? `เลือกไฟล์: ${file.name}` : `File selected: ${file.name}`);
            } else {
                setSelectedFile(null);
                const errorMessage = lang === 'th' ? 'ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ .csv หรือ .xlsx' : 'Invalid file type. Please upload a .csv or .xlsx file.';
                setUploadError(errorMessage);
                setUploadSuccess(false);
                toast.error(errorMessage);
            }
        }
    };

    const handleUploadAndCalculate = async () => {
        setUploadError(null); 

        if (!agreeToTerms) {
            const errorMessage = lang === 'th' ? 'กรุณาติ๊กช่อง "ฉันยินยอม..." ก่อนดำเนินการต่อ' : 'Please check "I agree..." before proceeding.';
            setUploadError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        if (!selectedFile) {
            const errorMessage = lang === 'th' ? 'กรุณาเลือกไฟล์ใหม่เพื่ออัปโหลด' : 'Please select a new file to upload.';
            setUploadError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        if (!selectedCountry || !selectedCity || selectedCity.trim() === '' || !selectedYear) {
            const errorMessage = lang === 'th' ? 'กรุณาเลือกประเทศ ระบุเมือง และระบุปีให้ครบถ้วนก่อนอัปโหลด' : 'Please select country, enter city, and enter year before uploading.';
            setUploadError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        
        await performCalculation(selectedFile, null);
    };

    const handleCalculateExisting = async () => {
        setUploadError(null); 

        if (!selectedArchivedFileId) {
            const errorMessage = lang === 'th' ? 'กรุณาเลือกไฟล์ที่มีอยู่เพื่อคำนวณ' : 'Please select an existing file to calculate.';
            setUploadError(errorMessage);
            toast.error(errorMessage);
            return;
        }

       
        await performCalculation(null, selectedArchivedFileId);
    };

    const performCalculation = async (file: File | null, archivedFileId: string | null) => {
        setProcessing(true);
        setUploadProgress(0);
        setUploadError(null);
        setUploadSuccess(false);
        setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });

        const formData = new FormData();
        let isNewFileUploadAttempt = false; 

        if (file) {
            isNewFileUploadAttempt = true;
            formData.append('file', file);
            formData.append('country', selectedCountry);    
            formData.append('city', selectedCity);
            formData.append('year', selectedYear.toString());
        } else if (archivedFileId) {
            formData.append('existing_file_id', archivedFileId);
        } else {
            setUploadError('No file selected for calculation.');
            setProcessing(false);
            return;
        }

        formData.append('mode', mode); // Ensure mode is always sent
        formData.append('bin_temp', binTempInput.toString());
        formData.append('time_range', timeRangeMapping[timeRangeDisplayInput] || '06.00-18.00'); // Fallback to a default if mapping fails
        formData.append('Coil_inlet_dry_bulb', isNaN(coilInletDryBulbInput) ? INITIAL_COIL_INLET_DRY_BULB.toString() : coilInletDryBulbInput.toString());
        formData.append('Coil_inlet_wet_bulb', isNaN(coilInletWetBulbInput) ? INITIAL_COIL_INLET_WET_BULB.toString() : coilInletWetBulbInput.toString());
        formData.append('full_Capacity', isNaN(fullCapacityInput) ? "0" : fullCapacityInput.toString());
        formData.append('Designcoolingload', isNaN(designCoolingLoadInput) ? "0" : designCoolingLoadInput.toString());
        formData.append('p_full', isNaN(pFullInput) ? "0" : pFullInput.toString());
        formData.append('electricity_rate', electricityRateInput.toString());
        formData.append('working_day_per_year', workingDayPerYearInput.toString());

        const halfCapacityValue = fullCapacityInput / 2;
        formData.append('half_Capacity', mode === 'Variable' ? (isNaN(halfCapacityValue) ? "0" : halfCapacityValue.toString()) : "0");
        formData.append('p_half', mode === 'Variable' ? (isNaN(pHalfInput) ? "0" : pHalfInput.toString()) : "0");

        const targetUrl = API_URL_CALCULATE_SUMMARY; // Always call this endpoint

        try {
            const response = await axios.post(targetUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            if (response.status === 200) {
                const { fixed_mode_results, variable_mode_results, parameters_used, uploaded_file_id } = response.data;
                setCalculatedResults({
                    fixed_mode_results,
                    variable_mode_results,
                    parameters_used,
                });
                setUploadSuccess(true);
                setCalculatedOnce(true);

               
                if (isNewFileUploadAttempt && uploaded_file_id) {
                    await fetchUploadedFiles(); 
                    setSelectedArchivedFileId(uploaded_file_id); 
                    setSelectedFile(null);
                    toast.success(lang === 'th' ? 'ไฟล์ถูกอัปโหลดและคำนวณสำเร็จ!' : 'File uploaded and calculated successfully!');
                    
                   
                    setSelectedUploadMethod('existing'); 

                } else { 
                    toast.success(lang === 'th' ? 'คำนวณสำเร็จ!' : 'Calculation successful!');
                }

            } else {
                const errorMessage = `Server error: ${response.status} - ${response.statusText}`;
                setUploadError(errorMessage);
                toast.error(errorMessage);
            }

        }   
        catch (error: any) {
            console.error('Error in file operation:', error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    const errorMessage = lang === 'th' ? 'ชื่อไฟล์นี้มีอยู่แล้ว กรุณาเปลี่ยนชื่อไฟล์และลองอีกครั้ง' : 'File with this name already exists. Please rename the file and try again.';
                    setUploadError(errorMessage);
                    toast.error(errorMessage);
                } else {
                    const errorMessage = `Error: ${error.response.data.detail || error.message}`;
                    setUploadError(errorMessage);
                    toast.error(errorMessage);
                }
            } else {
                const errorMessage = `Operation failed: ${error.message}`;
                setUploadError(errorMessage);
                toast.error(errorMessage);
            }
            setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });
        } finally {
            setProcessing(false);
            setTimeout(() => setUploadProgress(0), 1500);
        }
    };


    const handleRefreshFiles = () => {
        setSelectedArchivedFileId(null);
        setSelectedFile(null);
        setUploadError(null);
        setUploadSuccess(false);
        setCalculatedOnce(false);
        setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });
        setAgreeToTerms(false);
        fetchUploadedFiles();
        toast.info(lang === 'th' ? 'รีเฟรชรายการไฟล์แล้ว' : 'File list refreshed!');
    };

    const ResultCard = ({ title, results, lang, text }: { title: string, results: CalculationResult | null, lang: string, text: any }) => {
        if (!results) return null;
        return (
            <div className="p-4 border rounded-lg bg-gray-50/50">
                <h5 className="font-bold text-lg mb-3 text-gray-700 text-center">{title}</h5>
                <div className="space-y-2 text-base text-gray-600">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            <span className="font-medium">{text[lang].seer}:</span>
                        </div>
                        <span className="font-bold text-lg text-green-600">{results.overall_seer?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <Thermometer className="w-5 h-5 mr-2 text-purple-500" />
                            <span className="font-medium">{text[lang].lcst} (Wh):</span>
                        </div>
                        <span className="font-semibold">{results.total_sumLCST_Wh?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-orange-500" />
                            <span className="font-medium">{text[lang].ccse} (kWh):</span>
                        </div>
                        <span className="font-semibold">{results.total_sumCCSE_kwh?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    {results.energy_consumption_kwh !== undefined && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-cyan-500" />
                                <span className="font-medium">{text[lang].energyConsumption}:</span>
                            </div>
                            <span className="font-semibold">{results.energy_consumption_kwh.toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <BadgeDollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                            <span className="font-medium">{text[lang].electricityCostPerYear}:</span>
                        </div>
                        <span className="font-semibold text-red-600">฿{results.total_cost_per_year?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {results.load_factor !== undefined && (
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                                <LoaderPinwheel className="w-5 h-5 mr-2 text-teal-500" />
                                <span className="font-medium">{text[lang].loadFactor}:</span>
                            </div>
                            <span className="font-semibold text-teal-600">{results.load_factor.toFixed(2)}</span>
                        </div>
                    )}

                </div>
            </div>
        );
    };

    return (
        <Card className='w-full max-w-4xl bg-gray-50 p-5 shadow-sm border border-gray-200'>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-semibold text-gray-600 text-center">
                        {text[lang].title}
                    </CardTitle>
                </div>
                <p className="text-gray-600 mb-4 text-center">
                    {text[lang].desc}
                </p>
                <hr className="my-6" />
            </CardHeader>
            <CardContent className="space-y-8">
                <h3 className="text-xl font-medium text-gray-600 text-center">{text[lang].usage}</h3>

                <div className="space-y-6">
                    <div>
                        <div>
                            <div className="flex items-start space-x-3">
                                <span className="font-semibold text-gray-600 min-w-[80px]">{text[lang].step1}</span>
                                <div>
                                    <p className="text-gray-600 mb-2"> {text[lang].download}<a href="#" onClick={() => createAndDownloadTemplate('Data-Template')} className="text-blue-600 hover:underline inline-flex items-center mr-4">
                                        <Download className="w-4 h-4 mr-1" />
                                        Templatefile(.xlsx)
                                    </a></p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-blue-50 p-4 text-sm text-gray-600 space-y-2 rounded-md">
                                <p>
                                    {text[lang].coldesc}
                                </p>
                                <p className="italic">
                                    {text[lang].fillall}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <div className="flex items-start space-x-3">
                                <span className="font-semibold text-gray-600 min-w-[80px]">{text[lang].step2}</span>
                                <div>
                                    <p className="text-gray-600 mb-2"> {text[lang].open}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-md text-gray-600 bg-gray-100">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="mode">{text[lang].mode}</Label>
                                    <RadioGroup value={mode} onValueChange={(value: 'Fixed' | 'Variable') => setMode(value)} className="flex space-x-4">
                                        <div className="flex items-center space-x-2 mt-3">
                                            <RadioGroupItem value="Fixed" id="mode-fixed" />
                                            <Label htmlFor="mode-fixed">{text[lang].fixedTypetext}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-3">
                                            <RadioGroupItem value="Variable" id="mode-variable" />
                                            <Label htmlFor="mode-variable">{text[lang].variableTypetext}</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="binTemp">{text[lang].binTemp}</Label>
                                    <Input
                                        id="binTemp"
                                        type="number"
                                        value={binTempInput}
                                        onChange={(e) => setBinTempInput(parseFloat(e.target.value))}
                                        step="1.0"
                                        className={binTempInput === INITIAL_BIN_TEMP ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5 col-span-1 md:col-span-2">
                                    <Label htmlFor="timeRange">{text[lang].timeRange}</Label>
                                    <Select value={timeRangeDisplayInput} onValueChange={setTimeRangeDisplayInput}>
                                        <SelectTrigger id="timeRange">
                                            <SelectValue placeholder="Select time range" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {timeRangeDisplayValues.map(displayValue => (
                                                <SelectItem key={displayValue} value={displayValue}>{displayValue}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="electricityRate">{text[lang].electricityRate}</Label>
                                    <Input
                                        id="electricityRate"
                                        type="number"
                                        value={electricityRateInput}
                                        onChange={(e) => setElectricityRateInput(parseFloat(e.target.value))}
                                        step="0.01"
                                        className={electricityRateInput === INITIAL_ELECTRICITY_RATE ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="workingDayPerYear">{text[lang].workingDayPerYear}</Label>
                                    <Input
                                        id="workingDayPerYear"
                                        type="number"
                                        value={workingDayPerYearInput}
                                        onChange={(e) => setWorkingDayPerYearInput(parseInt(e.target.value, 10))}
                                        className={workingDayPerYearInput === INITIAL_WORKING_DAY_PER_YEAR ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="coilInletDryBulb">{text[lang].coilInletDryBulb}</Label>
                                    <Input
                                        id="coilInletDryBulb"
                                        type="number"
                                        value={coilInletDryBulbInput}
                                        onChange={(e) => setCoilInletDryBulbInput(parseFloat(e.target.value))}
                                        step="0.1"
                                        className={coilInletDryBulbInput === INITIAL_COIL_INLET_DRY_BULB ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="coilInletWetBulb">Coil Inlet Wet Bulb (°C):</Label>
                                    <Input
                                        id="coilInletWetBulb"
                                        type="number"
                                        value={coilInletWetBulbInput}
                                        onChange={(e) => setCoilInletWetBulbInput(parseFloat(e.target.value))}
                                        step="0.1"
                                        className={coilInletWetBulbInput === INITIAL_COIL_INLET_WET_BULB ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="designCoolingLoad">{text[lang].designCoolingLoad}</Label>
                                    <Input
                                        id="designCoolingLoad"
                                        type="number"
                                        value={designCoolingLoadInput}
                                        onChange={(e) => setDesignCoolingLoadInput(parseFloat(e.target.value))}
                                        step="any"
                                        className={designCoolingLoadInput === INITIAL_DES ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="fullCapacity">{text[lang].fullCapacity}</Label>
                                    <Input
                                        id="fullCapacity"
                                        type="number"
                                        value={fullCapacityInput}
                                        onChange={(e) => setFullCapacityInput(parseFloat(e.target.value))}
                                        step="any"
                                        className={fullCapacityInput === INITIAL_C_FULL ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>

                                {mode === 'Variable' && (
                                    <>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="halfCapacity">{text[lang].halfCapacity}</Label>
                                            <Input id="halfCapacity" type="number" value={(fullCapacityInput / 2).toFixed(2)} disabled className="text-gray-500 bg-gray-200" />
                                        </div>

                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="pHalf">{text[lang].powerAtPartLoadVariable}</Label>
                                            <Input
                                                id="pHalf"
                                                type="number"
                                                value={pHalfInput}
                                                onChange={(e) => setPhalfInput(parseFloat(e.target.value))}
                                                step="any"
                                                className={pHalfInput === INITIAL_P_HALF ? 'text-gray-500' : 'text-gray-900'}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="pFull">
                                        {mode === 'Fixed'
                                            ? text[lang].powerAtFullLoadFixed
                                            : text[lang].powerAtFullLoadVariable}
                                    </Label>
                                    <Input
                                        id="pFull"
                                        type="number"
                                        value={pFullInput}
                                        onChange={(e) => setPfullInput(parseFloat(e.target.value))}
                                        step="any"
                                        className={pFullInput === INITIAL_P_FULL ? 'text-gray-500' : 'text-gray-900'}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div>
                            <div className="flex items-start space-x-3">
                                <span className="font-semibold text-gray-600 min-w-[80px]">{text[lang].step3}</span>
                                <div>
                                    <p className="text-gray-600 mb-2">{text[lang].selectfile}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-4 text-blue-600 "> 
                                <Checkbox
                                    id="agree-terms"
                                    checked={agreeToTerms}
                                    onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
                                />
                                <label
                                    htmlFor="agree-terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-600"
                                >
                                    {text[lang].agreeTerms}
                                </label>
                            </div>
                        </div>

                        
                        <RadioGroup   
                            value={selectedUploadMethod}    
                            onValueChange={(value: 'new' | 'existing') => {
                                setSelectedUploadMethod(value);
                                setUploadError(null);   
                                setUploadSuccess(false);    
                                setCalculatedOnce(false); 
                                setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null }); 
                                
                                if (value === 'new') {
                                    setSelectedArchivedFileId(null);    
                                    
                                } else {    
                                    setSelectedFile(null);    
                                    setSelectedCountry('');
                                    setSelectedCity('');
                                    setSelectedYear(new Date().getFullYear());
                                }
                            }}    
                            className="flex flex-col md:flex-row gap-4 mb-4 justify-center" 
                        >
                            
                            <Card    
                                className={`flex-1 cursor-pointer transition-all duration-200 p-4   
                                    ${selectedUploadMethod === 'new'    
                                        ? 'border-gray-200' 
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                onClick={() => setSelectedUploadMethod('new')}
                            >
                                <div className="flex items-center justify-center gap-2">    
                                    <RadioGroupItem value="new" id="upload-new" className="h-5 w-5" />    
                                    <Label htmlFor="upload-new" className="text-base font-bold text-gray-700 cursor-pointer text-center">    
                                        {text[lang].UploadNewFile}
                                    </Label>
                                </div>
                            </Card>

                            
                            <Card    
                                className={`flex-1 cursor-pointer transition-all duration-200 p-4   
                                    ${selectedUploadMethod === 'existing'    
                                        ? 'border-gray-200' 
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                onClick={() => setSelectedUploadMethod('existing')}
                            >
                                <div className="flex items-center justify-center gap-2">    
                                    <RadioGroupItem value="existing" id="select-existing" className="h-5 w-5" />    
                                    <Label htmlFor="select-existing" className="text-base font-bold text-gray-700 cursor-pointer text-center">    
                                        {text[lang].ExistingFile}
                                    </Label>
                                </div>
                            </Card>
                        </RadioGroup>

                        
                        {selectedUploadMethod === 'new' && (
                            <Card className="w-full p-4 border rounded-lg bg-gray-100 shadow-sm"> 
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-700">{text[lang].UploadNewFile}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <input
                                        type="file"
                                        accept=".csv, .xlsx"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                    {selectedFile && (
                                        <>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="country-select">{text[lang].country}</Label>
                                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                                    <SelectTrigger id="country-select">
                                                        <SelectValue placeholder={text[lang].selectCountry} />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-60 overflow-y-auto">
                                                        {COUNTRIES.length > 0 ? (
                                                            COUNTRIES.map(country => (
                                                                <SelectItem key={country.id} value={country.id}>
                                                                    {country.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <div className="p-2 text-sm text-gray-500">{lang === 'th' ? 'ไม่พบข้อมูลประเทศ' : 'No countries found'}</div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="city-input">{text[lang].city}</Label>
                                                <Input
                                                    id="city-input"
                                                    type="text"
                                                    value={selectedCity}
                                                    onChange={(e) => setSelectedCity(e.target.value)}
                                                    placeholder={text[lang].enterCity}
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="year-input">{text[lang].year}</Label>
                                                <Input
                                                    id="year-input"
                                                    type="number"
                                                    value={selectedYear}
                                                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                                    placeholder={text[lang].enterYear}
                                                    min="1900"
                                                    max="2100"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 italic">{text[lang].fileRenameNote}</p>
                                        </>
                                    )}
                                    {processing && uploadProgress > 0 && selectedFile && (
                                        <div className="mt-2 w-full">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                                            </div>
                                            <p className="text-xs text-center text-gray-500 mt-1">{uploadProgress}%</p>
                                        </div>
                                    )}
                                    {selectedFile && (
                                        <p className="text-sm text-gray-600">{text[lang].choosefile}: <span className="font-medium">{selectedFile.name}</span></p>
                                    )}
                                    {uploadError && selectedUploadMethod === 'new' && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <XCircle className="w-4 h-4 mr-2" /> {uploadError}
                                        </div>
                                    )}
                                    {uploadSuccess && selectedUploadMethod === 'new' && (
                                        <div className="flex items-center text-green-600 text-sm">
                                            <CheckCircle className="w-4 h-4 mr-2" /> {text[lang].done}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleUploadAndCalculate}
                                        disabled={
                                            processing ||
                                            !agreeToTerms || 
                                            !selectedFile ||
                                            !selectedCountry || selectedCity.trim() === '' || !selectedYear
                                        }
                                        className="w-full flex items-center justify-center gap-2"
                                        title={
                                            !agreeToTerms ? (lang === 'th' ? "โปรดยอมรับเงื่อนไข" : "Please agree to terms") :
                                            (!selectedFile ? (lang === 'th' ? "กรุณาเลือกไฟล์" : "Please select a file") :
                                            (!selectedCountry || !selectedCity || selectedCity.trim() === '' || !selectedYear ? (lang === 'th' ? "โปรดกรอกข้อมูลประเทศ เมือง และปีให้ครบถ้วน" : "Please fill in country, city, and year") :
                                            (calculatedOnce && selectedUploadMethod === 'new' ? (lang === 'th' ? "ค่าถูกคำนวณแล้ว กดเพื่อคำนวณอีกครั้ง" : "Values already calculated. Click to calculate again.") : ""))) 
                                        }
                                    >
                                        {processing && selectedFile ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> {text[lang].processing}</>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" /> {calculatedOnce && selectedUploadMethod === 'new' ? text[lang].calculateAgain : text[lang].uploadAndCalculate}
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {selectedUploadMethod === 'existing' && (
                            <Card className="w-full p-4 border rounded-lg bg-gray-100 shadow-sm"> 
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-700">{text[lang].ExistingFile}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={selectedArchivedFileId ?? ""}
                                            onValueChange={(value) => {
                                                setSelectedArchivedFileId(value);
                                                setSelectedFile(null); 
                                                setUploadError(null);
                                                setUploadSuccess(false);
                                                setCalculatedOnce(false); 
                                                setCalculatedResults({ fixed_mode_results: null, variable_mode_results: null, parameters_used: null });
                                                setSelectedCountry('');
                                                setSelectedCity('');
                                                setSelectedYear(new Date().getFullYear());
                                                toast.info(lang === 'th' ? `เลือกไฟล์ที่เก็บถาวร: ${uploadedFilesList.find(f => f.id === value)?.name}` : `Archived file selected: ${uploadedFilesList.find(f => f.id === value)?.name}`);
                                            }}
                                        >
                                            <SelectTrigger disabled={processing || uploadedFilesList.length === 0}>
                                                <SelectValue placeholder={text[lang].select} />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                {uploadedFilesList.length > 0 ? (
                                                    uploadedFilesList.map(file => (
                                                        <SelectItem key={file.id} value={file.id}>
                                                            {file.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-gray-500">ไม่มีไฟล์</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            onClick={handleRefreshFiles}
                                            disabled={processing}
                                            title={text[lang].refreshList}
                                        >
                                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={handleCalculateExisting}
                                        disabled={processing || !selectedArchivedFileId} 
                                        className="w-full flex items-center justify-center gap-2"
                                        title={!selectedArchivedFileId ? (lang === 'th' ? "โปรดเลือกไฟล์ที่เก็บถาวร" : "Please select an archived file") : (calculatedOnce && selectedUploadMethod === 'existing' ? (lang === 'th' ? "ค่าถูกคำนวณแล้ว กดเพื่อคำนวณอีกครั้ง" : "Values already calculated. Click to calculate again.") : "")} 
                                    >
                                        {processing && selectedArchivedFileId ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> {text[lang].processing}</>
                                        ) : (
                                            <>
                                                <List className="w-4 h-4" /> {calculatedOnce && selectedUploadMethod === 'existing' ? text[lang].calculateAgain : text[lang].calculate} {(selectedArchivedFileId && uploadedFilesList.find(f => f.id === selectedArchivedFileId)?.name) ? `(${uploadedFilesList.find(f => f.id === selectedArchivedFileId)?.name.substring(0, 15)}...)` : ''}
                                            </>
                                        )}
                                    </Button>
                                    {uploadError && selectedUploadMethod === 'existing' && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <XCircle className="w-4 h-4 mr-2" /> {uploadError}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {calculatedResults.fixed_mode_results && (
                        <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-200 mb-5">
                            <h4 className="text-xl font-semibold text-gray-600 mb-4 border-b pb-3">{text[lang].currentCalc}</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {mode === 'Fixed' && calculatedResults.fixed_mode_results && (
                                    <ResultCard title={text[lang].fixedType} results={calculatedResults.fixed_mode_results} lang={lang} text={text} />
                                )}
                                {mode === 'Variable' && calculatedResults.variable_mode_results && (
                                    <ResultCard title={text[lang].variableType} results={calculatedResults.variable_mode_results} lang={lang} text={text} />
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <span className="font-semibold text-gray-600 min-w-[80px]"></span>
                        <div>
                            <div className="bg-blue-50 border p-4 text-sm text-gray-600 space-y-2 rounded-md">
                                <p className="text-gray-600 mb-1 font-semibold">
                                    {text[lang].note}
                                </p>
                                <p>{text[lang].seerDefinition}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default UploadPage;