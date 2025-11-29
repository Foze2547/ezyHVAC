import React, { useState, useRef, ChangeEvent, useEffect } from 'react';

import { Upload, X, Calculator, Eye, Download, Plus, Trash2, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";

interface ColorInput {
  id: string;
  color: string;
  cfm: string;
  length: string;
  width: string;
  height: string;
  friction: string;
  isManualWidth: boolean;
  isManualHeight: boolean;
}

interface CalculationResult {
  id: string;
  color: string;
  cfm: number;
  length: number;
  width: number;
  height: number;
  friction: number;
  velocity: number;
  giSheetArea: number;
  giNumber: string;
}

interface SummaryTableRow {
  id: string;
  zincNumber: string;
  totalArea: string;
  extraPercent: string;
  unitCost?: string;
  totalCost?: string;
}

interface VentHeaderItem {
  width: string;
  height: string;
  dustSize: string;
  headCount: string;
  zincAmount: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ImageCalculator = () => {
  const { lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastUploadedFileRef = useRef<File | null>(null);
  // Units: 'ip' for I-P (inH2O/100ft, CFM) and 'si' for SI (Pa/m, L/s)
  const [unitMode, setUnitMode] = useState<'ip' | 'si'>('ip');
  // Default Unit Cost maps per GI number for each unit system
  const DEFAULT_UNIT_COSTS_IP: Record<string, string> = { '26': '40', '24': '43', '22': '48', '20': '59', '18': '75' };
  const DEFAULT_UNIT_COSTS_SI: Record<string, string> = { '26': '400', '24': '430', '22': '480', '20': '590', '18': '750' };
  // Helper to create default Summary rows with prefilled Unit Cost based on current unit mode
  const makeDefaultSummaryRows = (mode: 'ip' | 'si'): SummaryTableRow[] => {
    const map = mode === 'ip' ? DEFAULT_UNIT_COSTS_IP : DEFAULT_UNIT_COSTS_SI;
    return [
      { id: 'summary-1', zincNumber: '26', totalArea: '', extraPercent: '25', unitCost: map['26'] || '', totalCost: '' },
      { id: 'summary-2', zincNumber: '24', totalArea: '', extraPercent: '25', unitCost: map['24'] || '', totalCost: '' },
      { id: 'summary-3', zincNumber: '22', totalArea: '', extraPercent: '25', unitCost: map['22'] || '', totalCost: '' },
      { id: 'summary-4', zincNumber: '20', totalArea: '', extraPercent: '25', unitCost: map['20'] || '', totalCost: '' },
      { id: 'summary-5', zincNumber: '18', totalArea: '', extraPercent: '25', unitCost: map['18'] || '', totalCost: '' },
    ];
  };
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedColors, setDetectedColors] = useState<string[]>([]);
  const [colorInputs, setColorInputs] = useState<ColorInput[]>([]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [frictionRate, setFrictionRate] = useState<string>('');
  const [refLengthM, setRefLengthM] = useState<string>('26');
  // New: store last backend ROI used (for debug/transparency) and toggle
  const [backendROI, setBackendROI] = useState<{x1:number;y1:number;x2:number;y2:number}|null>(null);
  const [useBackendAnalyzer, setUseBackendAnalyzer] = useState<boolean>(true);
  const [summaryRows, setSummaryRows] = useState<SummaryTableRow[]>(() => makeDefaultSummaryRows(unitMode));
  // Cost controls
  const [hangerPercent, setHangerPercent] = useState<string>('40');
  const [insulationUnitCost, setInsulationUnitCost] = useState<string>(unitMode === 'ip' ? '32' : '320');
  const [ventHeaders, setVentHeaders] = useState<VentHeaderItem[]>([
    { width: '', height: '', dustSize: '', headCount: '', zincAmount: '' }
  ]);

  // Helper: stable rounding to 2 decimals avoiding binary .5 artifacts
  const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

  const text = {
    en: {
      title: "Image-Duct Length Calculator",
      description: "Upload the ductwork drawing that highlights different duct sizes using color coding, including the black reference line at the bottom-right corner of the image.",
      uploadImage: "Upload",
      dragDrop: "Drag and drop an image here, or click to select",
      colorDetected: "Colors Detected",
      cfmInput: "Airflow (cfm)",
      flowLps: "Airflow (L/s)",
      lengthInput: "Length (m)",
      widthInput: "Width (in.)",
      heightInput: "Height (in.)",
      frictionInput: "Friction",
      velocityResult: "Velocity (fpm)",
      velocityResultSI: "Velocity (m/s)",
      giSheetAreaResult: "GI.Sheet Area",
      giNumberResult: "GI. Number",
      calculate: "Calculate All",
      results: "Calculation Results",
      color: "Color",
      cfm: "CFM",
      length: "Length (m)",
      result: "Result",
      noImage: "Please upload an image first",
      clear: "Clear All",
      downloadResults: "Download Results",
      downloadSummary: "Download Summary",
      addRow: "Add Row",
      deleteRow: "Delete Row",
      actions: "Actions",
      editColor: "Click to edit color",
      frictionRateInput: "Friction rate",
  frictionRateUnit: "(in.wc/100ft)",
  frictionRateUnitSI: "(Pa/m)",
      summaryTable: "Summary Table",
      zincNumber: "GI. Number",
      totalArea: "Total Area",
      extraPercent: "Allowance %",
  adjustedTotal: "Total with Allowance",
      sheetCount: "No. of Sheets",
      ventHeaderSize: "Size",
      headCount: "No. of Outlets",
      dustSize: "Duct Connection (in.)",
      zincAmountFromCalc: "GI. Sheet",
      squareFeet: "square feet",
      ventHeaderDropdown: "Vent Header Information",
      uploadHelp: "What image should I upload?",
      uploadHelpDesc: "Use a clear plan with distinct colored lines for each duct run, a high-contrast background, and minimal shadows. Recommended formats: PNG or JPG. Suggested resolution ≥ 1000 px on the longer side.",
      sampleCorrect: "Example of a correct image",
      seeExample: "(see example)",
    },
    th: {
      title: "เครื่องคำนวณความยาวท่อจากภาพ",
      description: "อัพโหลดแบบแปลนท่อลมที่มีการเน้นขนาดท่อต่างๆ ด้วยการใช้สี รวมถึงเส้นอ้างอิง",
      uploadImage: "อัพโหลด",
      dragDrop: "ลากและวางภาพที่นี่ หรือคลิกเพื่อเลือก",
      colorDetected: "สีที่ตรวจพบ",
      cfmInput: "อัตราการไหล (cfm)",
      flowLps: "อัตราการไหล (ลิตร/วินาที)",
      lengthInput: "ความยาว (ม.)",
      widthInput: "ความกว้าง (นิ้ว)",
      heightInput: "ความสูง (นิ้ว)",
      frictionInput: "ค่าความเสียดทาน (Friction)",
      velocityResult: "ความเร็ว (fpm)",
      velocityResultSI: "ความเร็ว (ม./วินาที)",
      giSheetAreaResult: "ปริมาณสังกะสี (GI.Sheet Area)",
      giNumberResult: "เบอร์สังกะสี",
      calculate: "คำนวณทั้งหมด",
      results: "ผลการคำนวณ",
      color: "สี",
      cfm: "CFM",
      length: "ความยาว (ม.)",
      result: "ผลลัพธ์",
      noImage: "กรุณาอัพโหลดภาพก่อน",
      clear: "ล้างทั้งหมด",
      downloadResults: "ดาวน์โหลดผลลัพธ์",
      downloadSummary: "ดาวน์โหลดสรุป",
      addRow: "เพิ่มแถว",
      deleteRow: "ลบแถว",
      actions: "การจัดการ",
      editColor: "คลิกเพื่อแก้ไขสี",
      frictionRateInput: "ค่าความเสียดทาน",
  frictionRateUnit: "(in.wc/100ft)",
  frictionRateUnitSI: "(Pa/m)",
      summaryTable: "ตารางสรุป",
      zincNumber: "เบอร์สังกะสี",
      totalArea: "พื้นที่รวม",
      extraPercent: "เปอร์เซ็นต์เผื่อ",
      adjustedTotal: "รวมเผื่อ",
      sheetCount: "จำนวนแผ่น",
      ventHeaderSize: "ขนาด",
      headCount: "จำนวนหัวจ่าย",
      dustSize: "Duct Connection (นิ้ว)",
      zincAmountFromCalc: "GI. Sheet",
      squareFeet: "ตารางฟุต",
      ventHeaderDropdown: "ข้อมูลหัวจ่ายลม",
      uploadHelp: "ควรอัปโหลดรูปแบบไหน?",
      uploadHelpDesc: "ควรใช้แบบแปลน/ภาพที่มีเส้นสีแทนท่อลมแต่ละเส้นชัดเจน พื้นหลังตัดกัน แสงเงาน้อย แนะนำไฟล์ PNG หรือ JPG และความละเอียดด้านยาว ≥ 1000 พิกเซล",
      sampleCorrect: "ตัวอย่างรูปที่ถูกต้อง",
      seeExample: "ดูตัวอย่าง",
    }
  };

  // --- Unit conversions and formulas ---
  const CFM_PER_LPS = 2.119; // 1 L/s = 2.119 CFM
  const LPS_PER_CFM = 1 / CFM_PER_LPS; // 1 CFM = 0.471947 L/s
  const FR_RATIO_SI_PER_IP = 8.17; // Pa/m per (in.wc/100ft)
  // Reference length conversion factor: 1 m = 3.28 ft (as requested)
  const FT_PER_M = 3.28;
  // Convert friction rate between IP (in.wc/100ft) and SI (Pa/m)
  const ipToSiFR = (inWc_per_100ft: number) => inWc_per_100ft * FR_RATIO_SI_PER_IP; // Pa/m
  const siToIpFR = (pa_per_m: number) => pa_per_m / FR_RATIO_SI_PER_IP; // in.wc/100ft

  // IP (18): D(in) = ( FR_ip / (0.12317 * Q_cfm^1.82) )^(-1/4.86)
  // Already defined below as computeEquivalentDiameterIP
  // SI (18 in image): D(mm) = ( FR_si / (26352202 * Q_Lps^1.82) )^(-1/4.86)
  // We return inches for internal rectangle math.
  const computeEquivalentDiameterSI_toIn = (FR_Pa_per_m: number, Q_Lps: number): number => {
    if (!(FR_Pa_per_m > 0) || !(Q_Lps > 0)) return NaN;
    const denom = 26352202 * Math.pow(Q_Lps, 1.82);
    const base = FR_Pa_per_m / denom;
    const D_mm = Math.pow(base, -1 / 4.86);
    return D_mm / 25.4;
  };

  // Switch unit mode and convert current inputs accordingly
  const handleSwitchUnit = (mode: 'ip' | 'si') => {
    if (mode === unitMode) return;
    // Convert friction rate displayed value
    const frVal = parseFloat(frictionRate);
    if (!isNaN(frVal)) {
      const converted = mode === 'si' ? ipToSiFR(frVal) : siToIpFR(frVal);
      setFrictionRate(String(Number(converted.toFixed(2))));
    } else {
      // Default friction when switching to SI with no current value
      if (mode === 'si') {
        setFrictionRate('0.8');
      }
    }
    // Convert Reference length value automatically (no retyping)
    setRefLengthM(prev => {
      const v = parseFloat(prev);
      if (!isNaN(v) && v > 0) {
        // switching to SI means current was IP (ft) -> m; switching to IP means m -> ft
        const converted = mode === 'si' ? (v / FT_PER_M) : (v * FT_PER_M);
        return String(Number(converted.toFixed(2)));
      }
      return prev;
    });
    // Set Insulation & Accessories cost to fixed defaults per unit system
    setInsulationUnitCost(mode === 'ip' ? '32' : '320');
    // Convert each row's flow field between CFM and L/s, and clear L/W/H + manual flags
    setColorInputs(prev => prev.map(row => {
      const v = parseFloat(row.cfm);
      let nextCFMStr = row.cfm;
      if (!isNaN(v)) {
        if (mode === 'si') {
          const lps = v * LPS_PER_CFM;
          nextCFMStr = String(Number(lps.toFixed(2)));
        } else {
          const cfm = v * CFM_PER_LPS;
          nextCFMStr = String(Number(cfm.toFixed(2)));
        }
      }
      return {
        ...row,
        cfm: nextCFMStr,
        length: '',
        width: '',
        height: '',
        isManualWidth: false,
        isManualHeight: false,
      };
    }));
    // Clear previous results and backend ROI; user must enter new reference
    setResults([]);
    setBackendROI(null);
    // Update summary unitCost defaults respectfully: keep user-entered values, replace blanks or previous-defaults
    setSummaryRows(prev => {
      const oldMap = unitMode === 'ip' ? DEFAULT_UNIT_COSTS_IP : DEFAULT_UNIT_COSTS_SI;
      const newMap = mode === 'ip' ? DEFAULT_UNIT_COSTS_IP : DEFAULT_UNIT_COSTS_SI;
      return prev.map(r => {
        const gi = String(r.zincNumber || '').trim();
        const current = (r.unitCost ?? '').trim();
        const wasDefault = current === '' || current === (oldMap[gi] || '');
        return {
          ...r,
          unitCost: wasDefault ? (newMap[gi] || '') : r.unitCost,
        } as SummaryTableRow;
      });
    });
    setUnitMode(mode);
  };

  // Helper to update only lengths from backend clusters while preserving existing CFM and manual flags
  const applyMeasuredClustersToRows = (clusters: Array<{ dominant_hex?: string; sum_length_m?: number }>) => {
    setDetectedColors(clusters.map((c) => String(c.dominant_hex || '#808080')));
    setColorInputs((prev) => {
      // Map existing rows by color for quick lookup
      const byColor = new Map<string, ColorInput>();
      prev.forEach((row) => byColor.set(row.color.toLowerCase(), row));

      const nextRows: ColorInput[] = [];
      clusters.forEach((c, idx) => {
        const color = String(c.dominant_hex || '#808080').toLowerCase();
        const lengthVal = c && typeof c.sum_length_m === 'number' && c.sum_length_m > 0
          ? String(Number(c.sum_length_m).toFixed(2))
          : '';

        const existing = byColor.get(color);
        if (existing) {
          nextRows.push({ ...existing, length: lengthVal });
        } else {
          nextRows.push({
            id: `color-${idx}`,
            color,
            cfm: '',
            length: lengthVal,
            width: '',
            height: '',
            friction: '',
            isManualWidth: false,
            isManualHeight: false,
          });
        }
      });

      return nextRows.length > 0 ? nextRows : prev;
    });
  };

  // Centralized backend measurement call
  const measureWithBackend = async (file: File, refLength: string) => {
    try {
      const form = new FormData();
      form.append('file', file);
      if (refLength && !isNaN(Number(refLength))) {
        // Convert to meters if currently in IP (user enters ft)
        const refVal = Number(refLength);
        const meters = unitMode === 'ip' ? (refVal) : refVal;
        form.append('ref_length_m', String(meters));
      }
      const resp = await fetch(`${API_BASE_URL}/api/measure-image`, {
        method: 'POST',
        body: form,
      });
      if (!resp.ok) throw new Error(`backend ${resp.status}`);
      const data = await resp.json();
      const clusters = Array.isArray(data?.clusters) ? (data.clusters as any[]) : [];
      if (clusters.length > 0) {
        applyMeasuredClustersToRows(clusters);
      }
      if (data?.roi) setBackendROI(data.roi);
    } catch (err) {
      console.warn('Backend analyzer failed:', err);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;
        setUploadedImage(imageSrc);
        // Always extract local dominant colors for the color chips (UI unchanged)
        // This also initializes blank rows; we'll override rows with measured data if backend succeeds
        analyzeImageColors(imageSrc);
        // Prefer backend analyzer; fallback to local color analysis if backend fails
        if (useBackendAnalyzer) {
          lastUploadedFileRef.current = file;
          await measureWithBackend(file, refLengthM);
          setIsLoading(false);
          return;
        }
        // Fallback path
        // Local analysis already invoked above; just finish loading state
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-measure automatically when reference length changes
  useEffect(() => {
    const file = lastUploadedFileRef.current;
    if (!file || !uploadedImage || !useBackendAnalyzer) return;
    if (!refLengthM || isNaN(Number(refLengthM)) || Number(refLengthM) <= 0) return;
    setIsLoading(true);
    measureWithBackend(file, refLengthM).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refLengthM]);

  const analyzeImageColors = (imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractDominantColors(imageData);
      
      setDetectedColors(colors);
      initializeColorInputs(colors);
      setIsLoading(false);
    };
    img.src = imageSrc;
  };

  const extractDominantColors = (imageData: ImageData) => {
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      if (alpha < 128) continue;
      
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      const similarColor = findSimilarColor(hex, Array.from(colorMap.keys()));
      const key = similarColor || hex;
      
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
    
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  };

  const findSimilarColor = (color: string, existingColors: string[]) => {
    const threshold = 10;
    const [r1, g1, b1] = hexToRgb(color);
    
    for (const existing of existingColors) {
      const [r2, g2, b2] = hexToRgb(existing);
      const distance = Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
      if (distance < threshold) {
        return existing;
      }
    }
    return null;
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Helper: coerce a number to the nearest positive even integer (min 2 to avoid zero-area)
  const toEvenInt = (x: number): number => {
    if (!isFinite(x)) return NaN;
    const ev = Math.round(x / 2) * 2;
    return ev <= 0 ? 2 : ev;
  };

  // Helper: snap inches to nearest 25 mm increment (returns inches), min small positive
  const snapInchesTo25mm = (inches: number): number => {
    if (!isFinite(inches)) return NaN;
    const mm = inches * 25.4;
    const mmSnapped = Math.round(mm / 25) * 25; // snap to 25 mm grid
    const snappedInches = mmSnapped / 25.4;
    return snappedInches > 0 ? snappedInches : 0.1;
  };

  // Helper: Equivalent diameter from rectangle (inches) using De = 1.30*(ab)^0.625/(a+b)^0.25
  const computeDeFromRectInches = (a_in: number, b_in: number): number => {
    if (!(a_in > 0) || !(b_in > 0)) return NaN;
    return 1.30 * Math.pow(a_in * b_in, 0.625) / Math.pow(a_in + b_in, 0.25);
  };

  // Helper: Compute Fr from De and Q
  // IP: Fr(in.wc/100ft) = 0.12317 * Q_cfm^1.82 * D_in^(-4.86)
  const computeFrictionIPFromDe = (D_in: number, Q_cfm: number): number => {
    if (!(D_in > 0) || !(Q_cfm > 0)) return NaN;
    return 0.12317 * Math.pow(Q_cfm, 1.82) * Math.pow(D_in, -4.86);
  };
  // SI: Fr(Pa/m) = 26352202 * Q_Lps^1.82 * D_mm^(-4.86)
  const computeFrictionSIFromDe = (D_in: number, Q_Lps: number): number => {
    if (!(D_in > 0) || !(Q_Lps > 0)) return NaN;
    const D_mm = D_in * 25.4;
    return 26352202 * Math.pow(Q_Lps, 1.82) * Math.pow(D_mm, -4.86);
  };

  // IP (18): D = ( FR / (0.12317 * Q^1.82) )^(-1/4.86)
  // FR: in. of water/100 ft, Q: cfm, returns D in inches (equivalent diameter)
  const computeEquivalentDiameterIP = (FR_in_wg_per_100ft: number, Q_cfm: number): number => {
    if (!(FR_in_wg_per_100ft > 0) || !(Q_cfm > 0)) return NaN;
    const denom = 0.12317 * Math.pow(Q_cfm, 1.82);
    const base = FR_in_wg_per_100ft / denom;
    return Math.pow(base, -1 / 4.86);
  };

  const initializeColorInputs = (colors: string[]) => {
    const inputs: ColorInput[] = colors.map((color, index) => ({
      id: `color-${index}`,
      color,
      cfm: '',
      length: '',
      width: '',
      height: '',
      friction: '',
      isManualWidth: false,
      isManualHeight: false
    }));
    setColorInputs(inputs);
  };
  
  useEffect(() => {
    if (colorInputs.length > 0) {
      const updatedResults: CalculationResult[] = [];
      
      colorInputs.forEach(input => {
        if (input.cfm && input.length) {
          const flowVal = parseFloat(input.cfm);
          // For sizing, compute De depending on unit
          const cfm = unitMode === 'si' ? flowVal * CFM_PER_LPS : flowVal;
          let length = parseFloat(input.length);
          if (unitMode === 'ip' && isFinite(length)) {
            // User enters ft in I-P mode; convert to meters for formulas
            length = length / 3.28;
          }
          
          // Compute De using correct formula per unit
          const FRDisplay = parseFloat(frictionRate) || 0.1; // shown in UI
          const De = unitMode === 'ip'
            ? computeEquivalentDiameterIP(FRDisplay, cfm)
            : computeEquivalentDiameterSI_toIn(FRDisplay, flowVal);
          if (!isFinite(De) || De <= 0) return;
          
          // Compute width and height (auto/manual)
          let width: number;
          let height: number;
          
          if (input.isManualHeight && input.height) {
            height = parseFloat(input.height);
            
            if (input.isManualWidth && input.width) {
              width = parseFloat(input.width);
            } else if (!input.isManualWidth) {
              // Solve width from De and given height (Newton)
              const target = De;
              let a = height;
              for (let i = 0; i < 10; i++) {
                const f = 1.30 * Math.pow(a * height, 0.625) / Math.pow(a + height, 0.25) - target;
                const df = 1.30 * (
                  0.625 * Math.pow(a * height, -0.375) * height / Math.pow(a + height, 0.25) -
                  0.25 * Math.pow(a * height, 0.625) / Math.pow(a + height, 1.25)
                );
                if (Math.abs(f) < 0.001 || Math.abs(df) < 0.001) break;
                a = Math.max(0.1, a - f / df);
              }
              width = Math.max(0.1, a);
              // Enforce even integers
              width = toEvenInt(width);
              updateColorInputWithoutTrigger(input.id, 'width', String(width));
            } else {
              return;
            }
          } else if (input.isManualWidth && input.width) {
            width = toEvenInt(parseFloat(input.width));
            
            if (!input.isManualHeight) {
              // Solve height from De and given width (Newton)
              const target = De;
              let b = width;
              for (let i = 0; i < 10; i++) {
                const f = 1.30 * Math.pow(width * b, 0.625) / Math.pow(width + b, 0.25) - target;
                const df = 1.30 * (
                  0.625 * Math.pow(width * b, -0.375) * width / Math.pow(width + b, 0.25) -
                  0.25 * Math.pow(width * b, 0.625) / Math.pow(width + b, 1.25)
                );
                if (Math.abs(f) < 0.001 || Math.abs(df) < 0.001) break;
                b = Math.max(0.1, b - f / df);
              }
              height = Math.max(0.1, b);
              height = unitMode === 'ip' ? toEvenInt(height) : snapInchesTo25mm(height);
              updateColorInputWithoutTrigger(input.id, 'height', String(height));
            } else {
              return;
            }
          } else if (!input.isManualWidth && !input.isManualHeight) {
            // Auto select rectangle with AR=2:1, W ≈ 1.317*De, H = W/2
            width = 1.317 * De;
            height = width / 2;
            // Enforce even integers
            if (unitMode === 'ip') {
              width = toEvenInt(width);
              height = toEvenInt(height);
            } else {
              width = snapInchesTo25mm(width);
              height = snapInchesTo25mm(height);
            }
            updateColorInputWithoutTrigger(input.id, 'width', String(width));
            updateColorInputWithoutTrigger(input.id, 'height', String(height));
          } else {
            // Manual mode but missing value
            return;
          }

          const area_in2 = (width * height);
          const velocity = unitMode === 'ip'
            ? (144 * cfm / area_in2)
            : (() => {
                const area_m2 = area_in2 * 0.00064516; // in^2 -> m^2
                const q_m3s = flowVal * 0.001; // L/s -> m^3/s
                return q_m3s / area_m2; // m/s
              })();
          // giSheetArea uses fixed formula: [0.545*(W+H)+1]*L
          const giSheetArea = (0.545 * (width + height) + 1) * length;

          // Compute friction from De (derived from W,H)
          const De_from_WH = computeDeFromRectInches(width, height);
          const frictionCalc = unitMode === 'ip'
            ? computeFrictionIPFromDe(De_from_WH, cfm)
            : computeFrictionSIFromDe(De_from_WH, flowVal);
          
          let giNumber = '';
          if (width <= 12 && height <= 12) {
            giNumber = '26';
          } else if (width <= 30 && height <= 30) {
            giNumber = '24';
          } else if (width <= 54 && height <= 54) {
            giNumber = '22';
          } else if (width <= 84 && height <= 84) {
            giNumber = '20';
          } else {
            giNumber = '18';
          }
          
          const newResult: CalculationResult = {
            id: input.id,
            color: input.color,
            cfm, // stored as CFM-equivalent internally
            length,
            width,
            height,
            friction: frictionCalc,
            velocity,
            giSheetArea,
            giNumber
          };
          
          updatedResults.push(newResult);
        }
      });
      
      setResults(updatedResults);
    }
  }, [frictionRate, colorInputs, unitMode]);

  const updateColorInputWithoutTrigger = (id: string, field: 'width' | 'height', value: string) => {
    setColorInputs(prev => prev.map(input =>
      input.id === id ? { ...input, [field]: value } : input
    ));
  };

  // Touch-friendly increment/decrement for width/height (useful on iPad)
  const adjustDimension = (id: string, field: 'width' | 'height', dir: 1 | -1) => {
    setColorInputs(prev => prev.map(r => {
      if (r.id !== id) return r;
      const cur = parseFloat(r[field] || '0') || 0;
      if (unitMode === 'ip') {
        const next = toEvenInt(cur + dir * 2);
        return { ...r, [field]: String(next) };
      } else {
        // In SI mode, underlying value is stored in inches; adjust by 25 mm steps
        const curMm = Math.round(cur * 25.4);
        const nextMm = Math.max(0, curMm + dir * 25);
        const nextIn = nextMm / 25.4;
        return { ...r, [field]: String(nextIn) };
      }
    }));
  };

  const updateColorInput = (id: string, field: 'color' | 'cfm' | 'length' | 'width' | 'height' | 'friction' | 'isManualWidth' | 'isManualHeight', value: string | boolean) => {
    // Sanitize width/height to even integers when user edits them
    let nextValue: string | boolean = value;
    if ((field === 'width' || field === 'height') && typeof value === 'string' && value !== '') {
      const n = Number(value);
      if (!isNaN(n)) {
        nextValue = unitMode === 'ip' ? String(toEvenInt(n)) : String(n);
      }
    }
    let updatedInputs = colorInputs.map(input =>
      input.id === id ? { ...input, [field]: nextValue } : input
    );
    
    // ป้องกันไม่ให้ manual mode เปิดพร้อมกัน
    if (field === 'isManualWidth' && value === true) {
      // เมื่อเปิด manual width ให้ปิด manual height
      updatedInputs = updatedInputs.map(input =>
        input.id === id ? { ...input, isManualWidth: true, isManualHeight: false } : input
      );
    } else if (field === 'isManualHeight' && value === true) {
      // เมื่อเปิด manual height ให้ปิด manual width
      updatedInputs = updatedInputs.map(input =>
        input.id === id ? { ...input, isManualHeight: true, isManualWidth: false } : input
      );
    }
    
    setColorInputs(updatedInputs);
    
    const updatedInput = updatedInputs.find(input => input.id === id);
    if (updatedInput && updatedInput.cfm && updatedInput.length) {
      const flowVal = parseFloat(updatedInput.cfm);
      const cfm = unitMode === 'si' ? flowVal * CFM_PER_LPS : flowVal;
      let length = parseFloat(updatedInput.length);
      if (unitMode === 'ip' && isFinite(length)) {
        length = length / 3.28; // ft -> m for formulas
      }
      
      // Compute De from FR and Q using correct formula (IP or SI)
      const FRDisplay = parseFloat(frictionRate) || 0.1;
      const De = unitMode === 'ip'
        ? computeEquivalentDiameterIP(FRDisplay, cfm)
        : computeEquivalentDiameterSI_toIn(FRDisplay, flowVal);
      if (!isFinite(De) || De <= 0) {
        setResults(prev => prev.filter(result => result.id !== id));
        return;
      }
      
      // คำนวณ width และ height
  let width: number;
  let height: number;
      
      if (updatedInput.isManualHeight && updatedInput.height) {
        height = parseFloat(updatedInput.height);
        height = unitMode === 'ip' ? toEvenInt(height) : snapInchesTo25mm(height);
        
        if (updatedInput.isManualWidth && updatedInput.width) {
          width = parseFloat(updatedInput.width);
          width = unitMode === 'ip' ? toEvenInt(width) : snapInchesTo25mm(width);
        } else if (!updatedInput.isManualWidth) {
          // Solve width from De and given height (Newton)
          const target = De;
          let a = height;
          for (let i = 0; i < 10; i++) {
            const f = 1.30 * Math.pow(a * height, 0.625) / Math.pow(a + height, 0.25) - target;
            const df = 1.30 * (
              0.625 * Math.pow(a * height, -0.375) * height / Math.pow(a + height, 0.25) -
              0.25 * Math.pow(a * height, 0.625) / Math.pow(a + height, 1.25)
            );
            if (Math.abs(f) < 0.001 || Math.abs(df) < 0.001) break;
            a = Math.max(0.1, a - f / df);
          }
          width = Math.max(0.1, a);
          width = unitMode === 'ip' ? toEvenInt(width) : snapInchesTo25mm(width);
        } else {
          // manual width แต่ยังไม่ได้กรอกค่า - ไม่คำนวณ
          setResults(prev => prev.filter(result => result.id !== id));
          return;
        }
      } else if (updatedInput.isManualWidth && updatedInput.width) {
        width = parseFloat(updatedInput.width);
        width = unitMode === 'ip' ? toEvenInt(width) : snapInchesTo25mm(width);
        
        if (!updatedInput.isManualHeight) {
          // Solve height from De and given width (Newton)
          const target = De;
          let b = width;
          for (let i = 0; i < 10; i++) {
            const f = 1.30 * Math.pow(width * b, 0.625) / Math.pow(width + b, 0.25) - target;
            const df = 1.30 * (
              0.625 * Math.pow(width * b, -0.375) * width / Math.pow(width + b, 0.25) -
              0.25 * Math.pow(width * b, 0.625) / Math.pow(width + b, 1.25)
            );
            if (Math.abs(f) < 0.001 || Math.abs(df) < 0.001) break;
            b = Math.max(0.1, b - f / df);
          }
          height = Math.max(0.1, b);
          height = unitMode === 'ip' ? toEvenInt(height) : snapInchesTo25mm(height);
        } else {
          // manual height แต่ยังไม่ได้กรอกค่า - ไม่คำนวณ
          setResults(prev => prev.filter(result => result.id !== id));
          return;
        }
      } else if (!updatedInput.isManualWidth && !updatedInput.isManualHeight) {
        // Auto rectangle AR=2:1
        width = 1.317 * De;
        height = width / 2;
        if (unitMode === 'ip') {
          width = toEvenInt(width);
          height = toEvenInt(height);
        } else {
          width = snapInchesTo25mm(width);
          height = snapInchesTo25mm(height);
        }
      } else {
        // มี manual mode แต่ยังไม่ได้กรอกค่า - ไม่คำนวณ
        setResults(prev => prev.filter(result => result.id !== id));
        return;
      }

      // Write back the coerced even integers to inputs so UI reflects the rule
      updateColorInputWithoutTrigger(updatedInput.id, 'width', isNaN(width) ? '' : String(width));
      updateColorInputWithoutTrigger(updatedInput.id, 'height', isNaN(height) ? '' : String(height));
      
      const area_in2 = (width * height);
      const velocity = unitMode === 'ip'
        ? (144 * cfm / area_in2)
        : (() => {
            const area_m2 = area_in2 * 0.00064516;
            const q_m3s = flowVal * 0.001;
            return q_m3s / area_m2;
          })();
  // giSheetArea uses fixed formula: [0.545*(W+H)+1]*L
      const giSheetArea = (0.545 * (width + height) + 1) * length;
      // Compute friction from actual W,H
      const De_from_WH = computeDeFromRectInches(width, height);
      const frictionCalc = unitMode === 'ip'
        ? computeFrictionIPFromDe(De_from_WH, cfm)
        : computeFrictionSIFromDe(De_from_WH, flowVal);
      
      let giNumber = '';
      if (width <= 12 && height <= 12) {
        giNumber = '26';
      } else if (width <= 30 && height <= 30) {
        giNumber = '24';
      } else if (width <= 54 && height <= 54) {
        giNumber = '22';
      } else if (width <= 84 && height <= 84) {
        giNumber = '20';
      } else {
        giNumber = '22';
      }
      
      const newResult: CalculationResult = {
        id: updatedInput.id,
        color: updatedInput.color,
        cfm,
        length,
        width,
        height,
        friction: frictionCalc,
        velocity,
        giSheetArea,
        giNumber
      };
      
      setResults(prev => {
        const filtered = prev.filter(result => result.id !== id);
        return [...filtered, newResult];
      });
    } else {
      setResults(prev => prev.filter(result => result.id !== id));
    }
  };

  const addNewRow = () => {
    const newId = `manual-${Date.now()}`;
    const newRow: ColorInput = {
      id: newId,
      color: '#808080',
      cfm: '',
      length: '',
      width: '',
      height: '',
      friction: '',
      isManualWidth: false,
      isManualHeight: false
    };
    setColorInputs(prev => [...prev, newRow]);
    // Summary row will be automatically added by useEffect
  };

  const deleteRow = (id: string) => {
    setColorInputs(prev => prev.filter(input => input.id !== id));
    setResults(prev => prev.filter(result => result.id !== id));
    // Summary row will be automatically removed by useEffect
  };

  const calculateAllResults = () => {
    if (!uploadedImage && colorInputs.length === 0) {
      alert(text[lang].noImage);
      return;
    }

    const calculatedResults: CalculationResult[] = colorInputs
      .filter(input => input.cfm && input.length)
      .map(input => {
        const flowVal = parseFloat(input.cfm);
        const cfm = unitMode === 'si' ? flowVal * CFM_PER_LPS : flowVal;
        let length = parseFloat(input.length);
        if (unitMode === 'ip' && isFinite(length)) {
          length = length / 3.28; // ft -> m for formulas
        }
        const FRDisplay = parseFloat(frictionRate) || 0.1;
        const De = unitMode === 'ip'
          ? computeEquivalentDiameterIP(FRDisplay, cfm)
          : computeEquivalentDiameterSI_toIn(FRDisplay, flowVal);
        if (!isFinite(De) || De <= 0) {
          return null as unknown as CalculationResult;
        }
        
        let width: number;
        let height: number;
        
        if (input.isManualHeight && input.height) {
          height = parseFloat(input.height);
          height = unitMode === 'ip' ? toEvenInt(height) : snapInchesTo25mm(height);
          
          if (input.isManualWidth && input.width) {
            width = parseFloat(input.width);
            width = unitMode === 'ip' ? toEvenInt(width) : snapInchesTo25mm(width);
          } else {
            // คำนวณ width จาก De เมื่อ height เป็น manual
            const target = De;
            let a = height;
            for (let i = 0; i < 10; i++) {
              const f = 1.30 * Math.pow(a * height, 0.625) / Math.pow(a + height, 0.25) - target;
              const df = 1.30 * (
                0.625 * Math.pow(a * height, -0.375) * height / Math.pow(a + height, 0.25) -
                0.25 * Math.pow(a * height, 0.625) / Math.pow(a + height, 1.25)
              );
              if (Math.abs(f) < 0.001 || Math.abs(df) < 0.001) break;
              a = Math.max(0.1, a - f / df);
            }
            width = Math.max(0.1, a);
            width = unitMode === 'ip' ? toEvenInt(width) : snapInchesTo25mm(width);
          }
        } else if (input.isManualWidth && input.width) {
          width = parseFloat(input.width);
          width = unitMode === 'ip' ? toEvenInt(width) : snapInchesTo25mm(width);
          
          const target = De;
          let b = width;
          for (let i = 0; i < 10; i++) {
            const f = 1.30 * Math.pow(width * b, 0.625) / Math.pow(width + b, 0.25) - target;
            const df = 1.30 * (
              0.625 * Math.pow(width * b, -0.375) * width / Math.pow(width + b, 0.25) -
              0.25 * Math.pow(width * b, 0.625) / Math.pow(width + b, 1.25)
            );
            if (Math.abs(f) < 0.001 || Math.abs(df) < 0.001) break;
            b = Math.max(0.1, b - f / df);
          }
          
          height = Math.max(0.1, b);
          height = unitMode === 'ip' ? toEvenInt(height) : snapInchesTo25mm(height);
        } else {
          // คำนวณทั้ง width และ height อัตโนมัติ โดยใช้สูตร W = 2*H = 1.317*D
          const D = De;
          
          // จากสูตร W = 1.317*D และ W = 2*H
          width = 1.317 * D;
          height = width / 2;
          if (unitMode === 'ip') {
            width = toEvenInt(width);
            height = toEvenInt(height);
          } else {
            width = snapInchesTo25mm(width);
            height = snapInchesTo25mm(height);
          }
        }

        const area_in2 = (width * height);
        const velocity = unitMode === 'ip'
          ? (144 * cfm / area_in2)
          : (() => {
              const area_m2 = area_in2 * 0.00064516;
              const q_m3s = flowVal * 0.001;
              return q_m3s / area_m2;
            })();
  // giSheetArea uses fixed formula: [0.545*(W+H)+1]*L
  const giSheetArea = (0.545 * (width + height) + 1) * length;
        // Friction from W,H
        const De_from_WH = computeDeFromRectInches(width, height);
        const frictionCalc = unitMode === 'ip'
          ? computeFrictionIPFromDe(De_from_WH, cfm)
          : computeFrictionSIFromDe(De_from_WH, flowVal);
        
        let giNumber = '';
        if (width <= 12 && height <= 12) {
          giNumber = '26';
        } else if (width <= 30 && height <= 30) {
          giNumber = '24';
        } else if (width <= 54 && height <= 54) {
          giNumber = '22';
        } else if (width <= 84 && height <= 84) {
          giNumber = '20';
        } else {
          giNumber = '22';
        }
        
        return {
          id: input.id,
          color: input.color,
          cfm,
          length,
          width,
          height,
          friction: frictionCalc, // computed from De and Q in current unit
          velocity,
          giSheetArea,
          giNumber
        };
      })
      .filter(Boolean) as CalculationResult[];

    setResults(calculatedResults);
  };

  // Clear all inputs, results, and UI state
  const clearAll = () => {
    setUploadedImage(null);
    setDetectedColors([]);
    setColorInputs([]);
    setResults([]);
    setFrictionRate('');
    setSummaryRows(makeDefaultSummaryRows(unitMode));
    setHangerPercent('40');
    setInsulationUnitCost(unitMode === 'ip' ? '32' : '320');
  setVentHeaders([{ width: '', height: '', dustSize: '', headCount: '', zincAmount: '' }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download results as CSV
  const downloadResults = () => {
    if (results.length === 0) return;
    const headers = [
      'Color',
      unitMode === 'ip' ? 'CFM Value' : 'Flow (L/s)',
      unitMode === 'ip' ? 'Length (ft)' : 'Length (m)',
      unitMode === 'ip' ? 'Width (in)' : 'Width (mm)',
      unitMode === 'ip' ? 'Height (in)' : 'Height (mm)',
      unitMode === 'ip' ? 'Friction (in.wc/100ft)' : 'Friction (Pa/m)',
      unitMode === 'ip' ? 'Velocity (fpm)' : 'Velocity (m/s)',
      unitMode === 'ip' ? 'GI Sheet Area (ft^2)' : 'GI Sheet Area (m^2)',
      'GI. Number'
    ];
    const rows = results.map(r => {
      const flow = unitMode === 'ip' ? Number(r.cfm.toFixed(2)) : Number((r.cfm * LPS_PER_CFM).toFixed(2));
      const lengthOut = unitMode === 'ip' ? Number((r.length * 3.28).toFixed(2)) : Number(r.length.toFixed(2));
      const widthOut = unitMode === 'ip' ? Number(r.width.toFixed(2)) : Math.round(r.width * 25.4);
      const heightOut = unitMode === 'ip' ? Number(r.height.toFixed(2)) : Math.round(r.height * 25.4);
      const frictionOut = Number(r.friction.toFixed(2));
      const velocityOut = Number(r.velocity.toFixed(2));
      const areaOut = (unitMode === 'ip' ? r.giSheetArea : r.giSheetArea / 10.764).toFixed(2);
      const arr = [
        r.color,
        flow,
        lengthOut,
        widthOut,
        heightOut,
        frictionOut,
        velocityOut,
        areaOut,
        r.giNumber,
      ];
      const quote = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      return arr.map(quote).join(',');
    });
    const ts = new Date();
    const tsName = `${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}_${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}`;
    const csv = [headers.map(h=>`"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculation-results_${tsName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download summary table as CSV (includes Adjusted Total, Unit Cost, Total Cost, and totals section)
  const downloadSummary = () => {
    if (summaryRows.length === 0) return;
    const areaUnit = unitMode === 'ip' ? 'ft^2' : 'm^2';
    const perUnit = unitMode === 'ip' ? 'per ft^2' : 'per m^2';
    const locale = lang === 'th' ? 'th-TH' : 'en-US';
    const nf = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const f2 = (n: number) => nf.format(round2(n));
    const q = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    // Metadata section (helps readability when opened in Excel)
    const ts = new Date();
    const tsStr = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}-${String(ts.getDate()).padStart(2, '0')} ${String(ts.getHours()).padStart(2, '0')}:${String(ts.getMinutes()).padStart(2, '0')}`;
    const unitLabel = unitMode === 'ip' ? (lang === 'th' ? 'I-P (ฟุต/นาที, ฟุต²)' : 'I-P (fpm, ft²)') : (lang === 'th' ? 'SI (ม./วินาที, ม²)' : 'SI (m/s, m²)');
    const notes = lang === 'th'
      ? 'หมายเหตุ: ปริมาณ GI เบอร์ 22 รวมพื้นที่ช่องรับ/จ่ายลม'
      : 'Note: GI No.22 area includes air inlet/outlet additions';

    const metaLines = [
      [lang === 'th' ? 'ไฟล์สรุป' : 'Summary Export'],
      [lang === 'th' ? 'วันที่' : 'Date', tsStr],
      [lang === 'th' ? 'หน่วย' : 'Units', unitLabel],
      [notes],
      [''], // blank line
    ].map(arr => arr.map(q).join(','));

    // Table headers
    const headers = [
      text[lang].zincNumber,
      `${text[lang].totalArea} (${areaUnit})`,
      text[lang].extraPercent,
      `${text[lang].adjustedTotal} (${areaUnit})`,
      `${lang === 'th' ? 'ต้นทุนต่อหน่วย' : 'Unit Cost'} (${perUnit})`,
      `${lang === 'th' ? 'ราคารวม' : 'Total Cost'}`,
    ];

    // Table rows
    const rows = summaryRows.map((row) => {
      const baseFt2 = parseFloat(row.totalArea) || 0;
      const pct = parseFloat(row.extraPercent) || 0;
      const adjustedFt2 = baseFt2 * (1 + pct / 100);
      const baseDisp = unitMode === 'ip' ? baseFt2 : baseFt2 / 10.764;
      const adjustedDisp = unitMode === 'ip' ? adjustedFt2 : adjustedFt2 / 10.764;
      const adjustedRounded = round2(adjustedDisp);
      const unitCost = parseFloat(row.unitCost || '');
      const areaForCost = adjustedRounded; // match UI rounding
      const totalCost = isFinite(unitCost) && unitCost > 0 ? areaForCost * unitCost : 0;
      const arr = [
        row.zincNumber,
        baseDisp > 0 ? f2(baseDisp) : '',
        isFinite(pct) ? `${pct}` : '',
        adjustedRounded > 0 ? f2(adjustedRounded) : '',
        isFinite(unitCost) && unitCost > 0 ? f2(unitCost) : '',
        totalCost > 0 ? f2(totalCost) : '',
      ];
      return arr.map(q).join(',');
    });

    // Totals section (aligned with table columns)
    const sumAdjustedArea = summaryRows.reduce((acc, row) => {
      const baseFt2 = parseFloat(row.totalArea) || 0;
      const pct = parseFloat(row.extraPercent) || 0;
      const adjustedFt2 = baseFt2 * (1 + pct / 100);
      const adjustedDisp = unitMode === 'ip' ? adjustedFt2 : adjustedFt2 / 10.764;
      return acc + round2(adjustedDisp);
    }, 0);

    const baseTotals = summaryRows.reduce((acc, row) => {
      const baseFt2 = parseFloat(row.totalArea) || 0;
      const pct = parseFloat(row.extraPercent) || 0;
      const adjustedFt2 = baseFt2 * (1 + pct / 100);
      const adjustedDisp = unitMode === 'ip' ? adjustedFt2 : adjustedFt2 / 10.764;
      const unitCost = parseFloat(row.unitCost || '');
      const total = isFinite(unitCost) && unitCost > 0 ? round2(adjustedDisp) * unitCost : 0;
      return acc + total;
    }, 0);

    const hangerPct = parseFloat(hangerPercent) || 0;
    const hangerCost = baseTotals * (hangerPct / 100);
    const insUnit = parseFloat(insulationUnitCost) || 0;
    const insulationCost = insUnit * sumAdjustedArea; // already in display area unit
    const grandTotal = baseTotals + hangerCost + insulationCost;

    const totalsLines: string[] = [];
    // Overall totals row: show adjusted area sum in column 4 and cost sum in column 6
    totalsLines.push([
      lang === 'th' ? 'รวม' : 'Total',
      '',
      '',
      sumAdjustedArea > 0 ? f2(sumAdjustedArea) : '',
      '',
      baseTotals > 0 ? f2(baseTotals) : '',
    ].map(q).join(','));

    // Hanger row: percentage in Allowance % column, cost in Total Cost
    totalsLines.push([
      lang === 'th' ? 'Hanger , Support & Accessories' : 'Hanger , Support & Accessories',
      '',
      isFinite(hangerPct) && hangerPct > 0 ? `${hangerPct}` : '',
      '',
      '',
      hangerCost > 0 ? f2(hangerCost) : '',
    ].map(q).join(','));

    // Insulation row: unit cost in Unit Cost column, cost in Total Cost
    totalsLines.push([
      lang === 'th' ? 'Insulation & Accessories cost' : 'Insulation & Accessories cost',
      '',
      '',
      '',
      isFinite(insUnit) && insUnit > 0 ? `${f2(insUnit)} ${perUnit}` : '',
      insulationCost > 0 ? f2(insulationCost) : '',
    ].map(q).join(','));

    // Grand total row
    totalsLines.push([
      lang === 'th' ? 'Grand Total' : 'Grand Total',
      '',
      '',
      '',
      '',
      f2(grandTotal),
    ].map(q).join(','));

    const csv = [
      ...metaLines,
      headers.map(q).join(','),
      ...rows,
      '',
      ...totalsLines,
    ].join('\r\n');

    // Prepend BOM to ensure Excel displays UTF-8 (Thai) correctly
    const csvWithBom = `\ufeff${csv}`;
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const tsName = `${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}_${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}`;
    a.download = `summary-table_${tsName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Functions for summary table management
  const updateSummaryRow = (index: number, field: keyof Omit<SummaryTableRow, 'id'>, value: string) => {
    // ป้องกันการแก้ไข zincNumber
    if (field === 'zincNumber') return;
    
    setSummaryRows(prev => prev.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    ));
  };

  // When switching unit mode, set a default insulation unit cost if empty
  useEffect(() => {
    setInsulationUnitCost(prev => {
      if (prev && prev.trim() !== '') return prev;
      return unitMode === 'ip' ? '32' : '320';
    });
  }, [unitMode]);

  // Functions for vent header management (multi-row)
  const updateVentHeader = (index: number, field: keyof VentHeaderItem, value: string) => {
    setVentHeaders(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as VentHeaderItem;
      return next;
    });
  };

  const addVentHeaderRow = () => {
    setVentHeaders(prev => [...prev, { width: '', height: '', dustSize: '', headCount: '', zincAmount: '' }]);
  };

  const removeVentHeaderRow = (index: number) => {
    setVentHeaders(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Auto-calculate zinc amount for each vent header row
  // Area formula base: 0.545 * (W + H + 4) * L, where
  // - W,H are in inches (stored internally)
  // - L is effective connection length from Ds per unit:
  //   IP: L = (Ds(in) + 2) * 0.025 (m)
  //   SI: L = (Ds(mm) + 50) / 1000 (m)
  useEffect(() => {
    setVentHeaders(prev => {
      let changed = false;
      const next = prev.map(item => {
        const W = parseFloat(item.width);
        const H = parseFloat(item.height);
        const DS = parseFloat(item.dustSize);
        const N = parseFloat(item.headCount);
        let zincAmount = '';
        if (isFinite(W) && isFinite(H) && isFinite(DS) && isFinite(N) && W > 0 && H > 0 && DS > 0 && N > 0) {
          // Compute effective length (meters) from Ds according to unit system
          const length_m = unitMode === 'ip'
            ? ((DS + 2) * 0.025) // per requirement
            : (((DS * 25.4) + 50) / 1000); // DS is stored in inches; convert to mm then apply
          zincAmount = (0.545 * (W + H + 4) * length_m * N).toFixed(2);
        }
        if (zincAmount !== item.zincAmount) {
          changed = true;
          return { ...item, zincAmount } as VentHeaderItem;
        }
        return item;
      });
      return changed ? next : prev;
    });
  }, [unitMode, ventHeaders.map(v => `${v.width}|${v.height}|${v.dustSize}|${v.headCount}`).join(',')]);


  // Helper: compute Total Area using fixed formula [0.545*(W+H)+1]*L
  // W, H in inches (from results), L as provided in row length (m). Do not modify constants.
  const computeTotalArea = (W: number, H: number, L: number): number => {
    if (!(W > 0) || !(H > 0) || !(L > 0)) return 0;
    return (0.545 * (W + H) + 1) * L;
  };

  // Auto-calculate and populate Total Area per GI Number NO. in the summary table.
  // This sums the Total Area for all rows whose result.giNumber matches the summary row's GI Number.
  // For GI Number '22', also add the Vent Header zinc amount (from calculation).
  useEffect(() => {
    if (!summaryRows || summaryRows.length === 0) return;
    setSummaryRows(prev => prev.map(row => {
      const gi = String(row.zincNumber || '').trim();
      let sum = results
        .filter(r => String(r.giNumber || '').trim() === gi)
        .reduce((acc, r) => acc + computeTotalArea(r.width, r.height, r.length), 0);
      // Add zinc amount only for GI Number 22 (sum across all vent header rows)
      if (gi === '22') {
        const zincSum = ventHeaders.reduce((acc, vh) => {
          const z = parseFloat(vh.zincAmount);
          return acc + (isFinite(z) && z > 0 ? z : 0);
        }, 0);
        sum += zincSum;
      }
      return {
        ...row,
        totalArea: sum > 0 ? sum.toFixed(2) : ''
      };
    }));
  }, [results, ventHeaders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="mb-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            {text[lang].title}
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 flex items-center gap-2">
            <span>{text[lang].description}</span>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  title={text[lang].seeExample}
                >
                  {text[lang].seeExample}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <h3 className="text-lg font-semibold mb-2">{text[lang].uploadHelp}</h3>
                <p className="text-sm text-slate-600 mb-4">{text[lang].uploadHelpDesc}</p>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">{text[lang].sampleCorrect}</div>
                  <img
                    src="/Ex.jpg"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                    alt={text[lang].sampleCorrect}
                    className="w-full max-h-[60vh] object-contain rounded border"
                  />
                  <p className="text-xs text-slate-500">{lang === 'th' ? 'หากไม่เห็นรูปตัวอย่าง ให้เพิ่มไฟล์ชื่อ Ex.jpg ที่โฟลเดอร์ public' : 'If the sample image does not appear, add a file named Ex.jpg under /public.'}</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700 inline-flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {text[lang].uploadImage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full h-48 object-contain mx-auto rounded"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAll();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-slate-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p>{text[lang].dragDrop}</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

      {/* แสดงสีที่ตรวจพบเฉพาะเมื่อมีการอัพโหลดรูป */}
      {uploadedImage && detectedColors.length > 0 && (
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {text[lang].colorDetected}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {detectedColors.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-16 rounded border shadow-sm mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs font-mono text-slate-600">{color}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* แสดงเฟรมการคำนวณเฉพาะเมื่อมีการอัพโหลดรูปหรือมีข้อมูลในตาราง */}
      {(uploadedImage || colorInputs.length > 0) && (
        <Card className="mb-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-700 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Input Values & Results
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearAll} className="text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {text[lang].clear}
            </Button>
            {results.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadResults}
                className="text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {text[lang].downloadResults}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
            {/* Unit toggle above Reference length */}
            <div className="flex items-center gap-6 mb-3">
              <button
                onClick={() => handleSwitchUnit('ip')}
                className={`pb-1 text-sm font-semibold ${unitMode === 'ip' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
              >
                I-P Units
              </button>
              <button
                onClick={() => handleSwitchUnit('si')}
                className={`pb-1 text-sm font-semibold ${unitMode === 'si' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
              >
                SI Units
              </button>
            </div>
            {/* Reference length (m) below the toggle */}
            <div className="flex flex-col gap-2"> {/* Restore default font size */}
              <label className="text-blue-700 cursor-pointer" htmlFor="referenceLength">
                Reference length ({unitMode === 'ip' ? 'ft' : 'm'}):
              </label>
              <input
                id="referenceLength"
                type="number"
                className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={refLengthM}
                onChange={e => setRefLengthM(e.target.value)}
              />
              <label className="text-blue-700 cursor-pointer" htmlFor="frictionRate">
                Friction rate ({unitMode === 'ip' ? 'in.wc/100ft' : 'Pa/m'}):
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="ml-1 text-gray-400 cursor-pointer hover:text-blue-600" title="Click for more information">&#9432;</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px]">
                    <h3 className="text-lg font-semibold">{unitMode === 'ip' ? 'Friction rate' : 'Friction rate'}</h3>
                    <img src="/fr.jpg" alt="Friction rate" className="w-full" />
                  </DialogContent>
                </Dialog>
              </label>
              <input
                id="frictionRate"
                type="number"
                className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={frictionRate}
                onChange={e => setFrictionRate(e.target.value)}
              />
            </div>
          </div>
          
          {colorInputs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{text[lang].color}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{unitMode === 'ip' ? text[lang].cfmInput : text[lang].flowLps}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{
                        unitMode === 'ip'
                          ? (lang === 'th' ? 'ความยาว (ฟุต)' : 'Length (ft)')
                          : text[lang].lengthInput
                      }</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{unitMode === 'ip' ? text[lang].widthInput : (lang === 'th' ? 'ความกว้าง (มม.)' : 'Width (mm)')}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{unitMode === 'ip' ? text[lang].heightInput : (lang === 'th' ? 'ความสูง (มม.)' : 'Height (mm)')}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">
                        {text[lang].frictionInput} {unitMode === 'ip' ? '(in.wc/100ft)' : '(Pa/m)'}
                      </th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">
                        <div className="flex items-center">
                          {unitMode === 'ip' ? text[lang].velocityResult : text[lang].velocityResultSI}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Info className="ml-2 h-4 w-4 cursor-pointer text-slate-500 hover:text-blue-600" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[850px]">
                              <h3 className="text-lg font-semibold">{unitMode === 'ip' ? 'Velocity (fpm)' : 'Velocity (m/s)'}</h3>
                              <img src="/velocity.jpg" alt="Velocity (fpm)" className="w-full" />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">
                        {text[lang].giSheetAreaResult} {unitMode === 'ip' ? '(ft²)' : '(m²)'}
                      </th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">
                        <div className="flex items-center">
                          {text[lang].giNumberResult}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Info className="ml-2 h-4 w-4 cursor-pointer text-slate-500 hover:text-blue-600" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[850px]">
                              <h3 className="text-lg font-semibold">GI Number NO.</h3>
                              <img src="/no.png" alt="GI Number NO." className="w-full" />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{text[lang].actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorInputs.map((input) => {
                      const result = results.find(r => r.id === input.id);
                      return (
                        <tr key={input.id} className="hover:bg-slate-50">
                          <td className="border border-gray-200 p-3">
                            <div className="flex items-center">
                              <input
                                type="color"
                                value={input.color}
                                onChange={(e) => updateColorInput(input.id, 'color', e.target.value)}
                                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer hover:border-indigo-400 transition-colors"
                                title={text[lang].editColor}
                              />
                            </div>
                          </td>
                          <td className="border border-gray-200 p-3">
                            <Input
                              type="number"
                              placeholder="0"
                              value={input.cfm}
                              onChange={(e) => updateColorInput(input.id, 'cfm', e.target.value)}
                              className="w-full text-sm sm:min-w-92 min-w-[92px]"
                            />
                          </td>
                          <td className="border border-gray-200 p-3">
                            <Input
                              type="number"
                              placeholder="0"
                              step="0.1"
                              value={input.length}
                              onChange={(e) => updateColorInput(input.id, 'length', e.target.value)}
                              className="w-full text-sm sm:min-w-92 min-w-[92px]"
                            />
                          </td>
                          <td className="border border-gray-200 p-3">
                            <div className="flex items-center gap-2 w-25">
                              <div className="flex items-center gap-2 w-full">
                                <Input
                                  type="number"
                                  placeholder={unitMode === 'ip' ? 'Even' : (lang === 'th' ? 'มม.' : 'mm')}
                                  step={unitMode === 'ip' ? 2 : 25}
                                  value={unitMode === 'ip'
                                    ? input.width
                                    : (input.width ? String(Math.round(Math.round(parseFloat(input.width) * 25.4 / 25) * 25)) : '')}
                                  onChange={(e) => {
                                    if (unitMode === 'si') {
                                      const mmRaw = parseFloat(e.target.value);
                                      const mmVal = isNaN(mmRaw) ? NaN : Math.round(mmRaw / 25) * 25;
                                      const inches = isNaN(mmVal) ? '' : String(mmVal / 25.4);
                                      updateColorInput(input.id, 'width', inches);
                                    } else {
                                      updateColorInput(input.id, 'width', e.target.value);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      const dir = e.key === 'ArrowUp' ? 1 : -1;
                                      if (unitMode === 'ip') {
                                        const cur = parseFloat(input.width || '0') || 0;
                                        const next = toEvenInt(cur + dir * 2);
                                        updateColorInput(input.id, 'width', String(next));
                                      } else {
                                        const curMm = input.width ? Math.round(parseFloat(input.width) * 25.4) : 0;
                                        const snapped = Math.round(curMm / 25) * 25;
                                        const nextMm = Math.max(0, snapped + dir * 25);
                                        const inches = String(nextMm / 25.4);
                                        updateColorInput(input.id, 'width', inches);
                                      }
                                    } else if (input.isManualWidth && input.isManualHeight) {
                                      // Block typing when in manual mode; allow only arrow keys and spinner clicks
                                      const allowedKeys = ['Tab', 'Shift', 'Home', 'End'];
                                      if (!allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                      }
                                    }
                                  }}
                                  onBeforeInput={(e) => {
                                    if (input.isManualWidth && input.isManualHeight) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onPaste={(e) => {
                                    if (input.isManualWidth && input.isManualHeight) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className={`w-full text-sm sm:min-w-92 min-w-[92px] ${!(input.isManualWidth && input.isManualHeight) ? 'bg-blue-50 border-blue-200' : ''}`}
                                  disabled={!(input.isManualWidth && input.isManualHeight)}
                                />

                                {/* Touch +/- buttons for iPad users (show only in Manual mode) */}
                                {input.isManualWidth && input.isManualHeight ? (
                                  <div className="flex flex-col items-center gap-1 ml-1">
                                    <button
                                      type="button"
                                      aria-label="Increase width"
                                      onClick={() => adjustDimension(input.id, 'width', 1)}
                                      className="h-6 w-6 text-xs rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Decrease width"
                                      onClick={() => adjustDimension(input.id, 'width', -1)}
                                      className="h-6 w-6 text-xs rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                    >
                                      −
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setColorInputs(prev => prev.map(r => {
                                    if (r.id !== input.id) return r;
                                    // toggle manual mode for both dimensions
                                    const manual = !(r.isManualWidth && r.isManualHeight);
                                    let newWidth = r.width;
                                    let newHeight = r.height;
                                    if (!manual) {
                                      // revert to auto calculation (respect unit mode)
                                      const flowVal = parseFloat(r.cfm);
                                      const cfmVal = unitMode === 'si' ? flowVal * CFM_PER_LPS : flowVal;
                                      const FRDisplay = parseFloat(frictionRate) || 0.1;
                                      const De = unitMode === 'ip'
                                        ? computeEquivalentDiameterIP(FRDisplay, cfmVal)
                                        : computeEquivalentDiameterSI_toIn(FRDisplay, flowVal);
                                      if (isFinite(De) && De > 0) {
                                        newWidth = String(toEvenInt(1.317 * De));
                                        newHeight = String(toEvenInt(1.317 * De / 2));
                                      }
                                    }
                                    return {
                                      ...r,
                                      isManualWidth: manual,
                                      isManualHeight: manual,
                                      width: newWidth,
                                      height: newHeight
                                    };
                                  }));
                                }}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                  (input.isManualWidth && input.isManualHeight)
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                                title={(input.isManualWidth && input.isManualHeight) ? 'Switch to Auto' : 'Switch to Manual'}
                              >
                                {(input.isManualWidth && input.isManualHeight) ? 'M' : 'A'}
                              </button>
                            </div>
                          </td>
                          <td className="border border-gray-200 p-3">
                            <div className="flex items-center gap-2 w-25">
                              <div className="flex items-center gap-2 w-full">
                                <Input
                                  type="number"
                                  placeholder={unitMode === 'ip' ? 'Even' : (lang === 'th' ? 'มม.' : 'mm')}
                                  step={unitMode === 'ip' ? 2 : 25}
                                  value={unitMode === 'ip'
                                    ? input.height
                                    : (input.height ? String(Math.round(Math.round(parseFloat(input.height) * 25.4 / 25) * 25)) : '')}
                                  onChange={(e) => {
                                    if (unitMode === 'si') {
                                      const mmRaw = parseFloat(e.target.value);
                                      const mmVal = isNaN(mmRaw) ? NaN : Math.round(mmRaw / 25) * 25;
                                      const inches = isNaN(mmVal) ? '' : String(mmVal / 25.4);
                                      updateColorInput(input.id, 'height', inches);
                                    } else {
                                      updateColorInput(input.id, 'height', e.target.value);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      const dir = e.key === 'ArrowUp' ? 1 : -1;
                                      if (unitMode === 'ip') {
                                        const cur = parseFloat(input.height || '0') || 0;
                                        const next = toEvenInt(cur + dir * 2);
                                        updateColorInput(input.id, 'height', String(next));
                                      } else {
                                        const curMm = input.height ? Math.round(parseFloat(input.height) * 25.4) : 0;
                                        const snapped = Math.round(curMm / 25) * 25;
                                        const nextMm = Math.max(0, snapped + dir * 25);
                                        const inches = String(nextMm / 25.4);
                                        updateColorInput(input.id, 'height', inches);
                                      }
                                    } else if (input.isManualWidth && input.isManualHeight) {
                                      const allowedKeys = ['Tab', 'Shift', 'Home', 'End'];
                                      if (!allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                      }
                                    }
                                  }}
                                  onBeforeInput={(e) => {
                                    if (input.isManualWidth && input.isManualHeight) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onPaste={(e) => {
                                    if (input.isManualWidth && input.isManualHeight) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className={`w-full text-sm sm:min-w-92 min-w-[92px] ${!(input.isManualWidth && input.isManualHeight) ? 'bg-blue-50 border-blue-200' : ''}`}
                                  disabled={!(input.isManualWidth && input.isManualHeight)}
                                />

                                {/* Touch +/- buttons for iPad users (show only in Manual mode) */}
                                {input.isManualWidth && input.isManualHeight ? (
                                  <div className="flex flex-col items-center gap-1 ml-1">
                                    <button
                                      type="button"
                                      aria-label="Increase height"
                                      onClick={() => adjustDimension(input.id, 'height', 1)}
                                      className="h-6 w-6 text-xs rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Decrease height"
                                      onClick={() => adjustDimension(input.id, 'height', -1)}
                                      className="h-6 w-6 text-xs rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                                    >
                                      −
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="border border-gray-200 p-3">
                            {result ? (
                              <span className="font-mono font-bold text-orange-600 text-sm">
                                {result.friction.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {result ? (
                              <span className="font-mono font-bold text-blue-600 text-sm">
                                {result.velocity.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {result ? (
                              <span className="font-mono font-bold text-green-600 text-sm">
                                {(
                                  unitMode === 'ip'
                                    ? result.giSheetArea
                                    : result.giSheetArea / 10.764
                                ).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {result ? (
                              <span className="font-mono font-bold text-purple-600 text-sm">
                                {result.giNumber}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 p-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteRow(input.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-start">
                <Button 
                  onClick={addNewRow} 
                  variant="outline" 
                  className="text-sm flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4" />
                  {text[lang].addRow}
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-slate-500">
              <p className="mb-4 text-center">{lang === 'th' ? 'ยังไม่มีข้อมูลในตาราง' : 'No data in table'}</p>
              <div className="flex justify-start">
                <Button 
                  onClick={addNewRow} 
                  variant="outline" 
                  className="text-sm flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4" />
                  {text[lang].addRow}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Vent Header Information moved to main frame (before Summary Table) */}
      {(uploadedImage || colorInputs.length > 0) && (
        <Card className="mb-6 bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              {lang === 'th' ? 'ช่องรับลม / ช่องจ่ายลม' : 'Air Inlet / Outlet'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex flex-col gap-3 text-sm">
                {ventHeaders.map((vh, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-3">
                    <span className="font-medium text-gray-700">
                      {text[lang].ventHeaderSize}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder={unitMode === 'si' ? '0' : '0'}
                        step={unitMode === 'ip' ? 2 : 1}
                        value={unitMode === 'si' ? (vh.width ? String(Math.round(parseFloat(vh.width) * 25.4)) : '') : vh.width}
                        onChange={(e) => {
                          if (unitMode === 'si') {
                            const mmRaw = parseFloat(e.target.value);
                            const mmVal = isNaN(mmRaw) ? NaN : mmRaw;
                            const inches = isNaN(mmVal) ? '' : String(mmVal / 25.4);
                            updateVentHeader(idx, 'width', inches);
                          } else {
                            updateVentHeader(idx, 'width', e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            const dir = e.key === 'ArrowUp' ? 1 : -1;
                            if (unitMode === 'ip') {
                              const cur = parseFloat(vh.width || '0') || 0;
                              const next = toEvenInt(cur + dir * 2);
                              updateVentHeader(idx, 'width', String(next));
                            } else {
                              const curMm = vh.width ? Math.round(parseFloat(vh.width) * 25.4) : 0;
                              const nextMm = Math.max(0, curMm + dir * 1);
                              const inches = String(nextMm / 25.4);
                              updateVentHeader(idx, 'width', inches);
                            }
                          }
                        }}
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-gray-600">X</span>
                      <Input
                        type="number"
                        placeholder={unitMode === 'si' ? '0' : '0'}
                        step={unitMode === 'ip' ? 2 : 1}
                        value={unitMode === 'si' ? (vh.height ? String(Math.round(parseFloat(vh.height) * 25.4)) : '') : vh.height}
                        onChange={(e) => {
                          if (unitMode === 'si') {
                            const mmRaw = parseFloat(e.target.value);
                            const mmVal = isNaN(mmRaw) ? NaN : mmRaw;
                            const inches = isNaN(mmVal) ? '' : String(mmVal / 25.4);
                            updateVentHeader(idx, 'height', inches);
                          } else {
                            updateVentHeader(idx, 'height', e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            const dir = e.key === 'ArrowUp' ? 1 : -1;
                            if (unitMode === 'ip') {
                              const cur = parseFloat(vh.height || '0') || 0;
                              const next = toEvenInt(cur + dir * 2);
                              updateVentHeader(idx, 'height', String(next));
                            } else {
                              const curMm = vh.height ? Math.round(parseFloat(vh.height) * 25.4) : 0;
                              const nextMm = Math.max(0, curMm + dir * 1);
                              const inches = String(nextMm / 25.4);
                              updateVentHeader(idx, 'height', inches);
                            }
                          }
                        }}
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-gray-600">{unitMode === 'si' ? (lang === 'th' ? 'มม.' : 'mm') : (lang === 'th' ? 'นิ้ว' : 'in.')}</span>
                      {(() => {
                        const wIn = parseFloat(vh.width);
                        const hIn = parseFloat(vh.height);
                        if (isFinite(wIn) && isFinite(hIn) && wIn > 0 && hIn > 0) {
                          if (unitMode === 'ip') {
                            const wmm = Math.round(wIn * 25.4);
                            const hmm = Math.round(hIn * 25.4);
                          }
                        }
                        return null;
                      })()}
                    </div>

                    <span className="font-medium text-gray-700">
                      {unitMode === 'si'
                        ? (lang === 'th' ? 'Duct Connection (มม.)' : 'Duct Connection (mm)')
                        : text[lang].dustSize}
                    </span>
                    <Input
                      type="number"
                      placeholder={unitMode === 'si' ? '0' : '0'}
                      step={unitMode === 'si' ? 1 : undefined}
                      value={unitMode === 'si' ? (vh.dustSize ? String(Math.round(parseFloat(vh.dustSize) * 25.4)) : '') : vh.dustSize}
                      onChange={(e) => {
                        if (unitMode === 'si') {
                          const mmVal = parseFloat(e.target.value);
                          const inches = isNaN(mmVal) ? '' : String(mmVal / 25.4);
                          updateVentHeader(idx, 'dustSize', inches);
                        } else {
                          updateVentHeader(idx, 'dustSize', e.target.value);
                        }
                      }}
                      className="w-24 h-8 text-sm"
                    />
                    <span className="text-gray-600">{unitMode === 'si' ? (lang === 'th' ? 'มม.' : 'mm') : (lang === 'th' ? 'นิ้ว' : 'in.')}</span>

                    <span className="font-medium text-gray-700">
                      {text[lang].headCount}
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={vh.headCount}
                      onChange={(e) => updateVentHeader(idx, 'headCount', e.target.value)}
                      className="w-24 h-8 text-sm"
                    />

                    <span className="font-medium text-gray-700">
                      {text[lang].zincAmountFromCalc}
                    </span>
                    <Input
                      type="text"
                      placeholder="0"
                      value={unitMode === 'ip' ? vh.zincAmount : (vh.zincAmount ? String((parseFloat(vh.zincAmount) / 10.764).toFixed(2)) : '')}
                      readOnly
                      className="w-28 h-8 text-sm bg-blue-50 text-blue-800 font-mono font-semibold"
                    />
                    <span className="text-gray-600">{unitMode === 'ip' ? 'ft²' : 'm²'}</span>

                    {ventHeaders.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeVentHeaderRow(idx)} className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-1" /> {text[lang].deleteRow}
                      </Button>
                    )}
                  </div>
                ))}
                <div>
                  <Button variant="outline" size="sm" onClick={addVentHeaderRow} className="text-green-700 border-green-200 hover:bg-green-50">
                    <Plus className="w-4 h-4 mr-1" /> {text[lang].addRow}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Table - แสดงเฉพาะเมื่อมีการอัพโหลดรูปหรือมีข้อมูลในตาราง */}
      {(uploadedImage || colorInputs.length > 0) && (
      <Card className="mb-6 bg-white shadow-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            {text[lang].summaryTable}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadSummary}
              className="text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {text[lang].downloadSummary}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {summaryRows.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{text[lang].zincNumber}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{text[lang].totalArea} {unitMode === 'ip' ? '(ft²)' : '(m²)'}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{text[lang].extraPercent}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{text[lang].adjustedTotal} {unitMode === 'ip' ? '(ft²)' : '(m²)'}</th>
                      
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{lang === 'th' ? 'ต้นทุนต่อหน่วย' : 'Unit Cost'} {unitMode === 'ip' ? '($ per ft²)' : '($ per m²)'}</th>
                      <th className="border border-gray-200 p-3 text-left text-sm font-normal text-slate-700">{lang === 'th' ? 'ต้นทุนรวม' : 'Total Cost ($)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRows.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-3">
                          <Input
                            type="text"
                            value={row.zincNumber}
                            readOnly
                            className="w-full text-sm bg-slate-50 cursor-not-allowed"
                          />
                        </td>
                        <td className="border border-gray-200 p-3">
                          {(() => {
                            const baseFt2 = parseFloat(row.totalArea) || 0;
                            const display = baseFt2 > 0
                              ? (unitMode === 'ip' ? baseFt2.toFixed(2) : (baseFt2 / 10.764).toFixed(2))
                              : '';
                            return (
                              <Input
                                type="text"
                                placeholder={lang === 'th' ? 'คำนวณอัตโนมัติ' : 'Auto-calculated'}
                                value={display}
                                readOnly
                                className="w-full text-sm bg-slate-50 cursor-not-allowed"
                              />
                            );
                          })()}
                        </td>
                        <td className="border border-gray-200 p-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="25"
                              step="1"
                              value={row.extraPercent}
                              onChange={(e) => updateSummaryRow(index, 'extraPercent', e.target.value)}
                              className="w-full text-sm"
                            />
                            <span className="text-slate-500 text-sm">%</span>
                          </div>
                        </td>
                        <td className="border border-gray-200 p-3">
                          {(() => {
                            const baseFt2 = parseFloat(row.totalArea) || 0;
                            const pct = parseFloat(row.extraPercent) || 0;
                            const adjustedFt2 = baseFt2 * (1 + pct / 100);
                            const val = adjustedFt2 > 0
                              ? (unitMode === 'ip' ? adjustedFt2.toFixed(2) : (adjustedFt2 / 10.764).toFixed(2))
                              : '';
                            return (
                              <Input
                                type="text"
                                placeholder={lang === 'th' ? 'คำนวณอัตโนมัติ' : 'Auto-calculated'}
                                value={val}
                                readOnly
                                className="w-full text-sm bg-slate-50 cursor-not-allowed"
                              />
                            );
                          })()}
                        </td>
                        
                        {/* Unit Cost column */}
                        <td className="border border-gray-200 p-3">
                          {(() => {
                            const placeholder = unitMode === 'ip' ? (DEFAULT_UNIT_COSTS_IP[row.zincNumber] || '0') : (DEFAULT_UNIT_COSTS_SI[row.zincNumber] || '0');
                            return (
                              <Input
                                type="number"
                                placeholder={placeholder}
                                value={row.unitCost ?? ''}
                                onChange={(e) => updateSummaryRow(index, 'unitCost', e.target.value)}
                                className="w-full text-sm"
                              />
                            );
                          })()}
                        </td>
                        {/* Total Cost column */}
                        <td className="border border-gray-200 p-3">
                          {(() => {
                            const baseFt2 = parseFloat(row.totalArea) || 0;
                            const pct = parseFloat(row.extraPercent) || 0;
                            const adjustedFt2 = baseFt2 * (1 + pct / 100);
                            const unitCost = parseFloat(row.unitCost || '');
                            // Use displayed adjusted area (ft² in IP, m² in SI)
                            const adjustedDisp = unitMode === 'ip' ? adjustedFt2 : adjustedFt2 / 10.764;
                            const adjustedRounded = round2(adjustedDisp);
                            const total = isFinite(unitCost) && unitCost > 0 ? adjustedRounded * unitCost : 0;
                            return (
                              <Input
                                type="text"
                                value={total > 0 ? total.toFixed(2) : ''}
                                readOnly
                                className="w-full text-sm bg-slate-50 cursor-not-allowed"
                              />
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Footer totals aligned under Adjusted Total and Total Cost */}
                  <tfoot>
                    {(() => {
                      // Sum adjusted areas in display unit and sum total cost
                      const sums = summaryRows.reduce(
                        (acc, row) => {
                          const baseFt2 = parseFloat(row.totalArea) || 0;
                          const pct = parseFloat(row.extraPercent) || 0;
                          const adjustedFt2 = baseFt2 * (1 + pct / 100);
                          const adjustedDisp = unitMode === 'ip' ? adjustedFt2 : adjustedFt2 / 10.764;
                          const adjustedRounded = round2(adjustedDisp);
                          const unitCost = parseFloat(row.unitCost || '');
                          const rowTotal = isFinite(unitCost) && unitCost > 0 ? adjustedRounded * unitCost : 0;
                          acc.sumAdjusted += adjustedRounded;
                          acc.sumCost += rowTotal;
                          return acc;
                        },
                        { sumAdjusted: 0, sumCost: 0 }
                      );
                      return (
                        <tr className="bg-slate-50">
                          <td className="border border-gray-200 p-3 font-semibold text-slate-800" colSpan={3}>{lang === 'th' ? 'รวม' : 'Total'}</td>
                          <td className="border border-gray-200 p-3 text-right font-semibold text-slate-800">{sums.sumAdjusted > 0 ? sums.sumAdjusted.toFixed(2) : ''}</td>
                          <td className="border border-gray-200 p-3" />
                          <td className="border border-gray-200 p-3 text-right font-semibold text-slate-800">{sums.sumCost > 0 ? sums.sumCost.toFixed(2) : ''}</td>
                        </tr>
                      );
                    })()}
                  </tfoot>
                </table>
              </div>
              {/* Totals section */}
              {(() => {
                const baseTotals = summaryRows.reduce((acc, row) => {
                  const baseFt2 = parseFloat(row.totalArea) || 0;
                  const pct = parseFloat(row.extraPercent) || 0;
                  const adjustedFt2 = baseFt2 * (1 + pct / 100);
                  const adjustedDisp = unitMode === 'ip' ? adjustedFt2 : adjustedFt2 / 10.764;
                  const adjustedRounded = round2(adjustedDisp);
                  const unitCost = parseFloat(row.unitCost || '');
                  const total = isFinite(unitCost) && unitCost > 0 ? adjustedRounded * unitCost : 0;
                  return acc + total;
                }, 0);
                const hangerPct = parseFloat(hangerPercent) || 0;
                const hangerCost = baseTotals * (hangerPct / 100);
                const sumAdjustedFt2 = summaryRows.reduce((acc, row) => {
                  const baseFt2 = parseFloat(row.totalArea) || 0;
                  const pct = parseFloat(row.extraPercent) || 0;
                  const adjustedFt2 = baseFt2 * (1 + pct / 100);
                  return acc + adjustedFt2;
                }, 0);
                const insUnit = parseFloat(insulationUnitCost) || 0;
                const areaForIns = unitMode === 'ip' ? sumAdjustedFt2 : (sumAdjustedFt2 / 10.764);
                const insulationCost = insUnit * areaForIns;
                const grandTotal = baseTotals + hangerCost + insulationCost;
                return (
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{lang === 'th' ? 'Hanger , Support & Accessories (%)' : 'Hanger , Support & Accessories (%)'}</span>
                      <Input type="number" className="w-24 h-8" value={hangerPercent} onChange={(e) => setHangerPercent(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{lang === 'th' ? 'Insulation & Accessories cost' : 'Insulation & Accessories cost'}</span>
                      <Input type="number" className="w-28 h-8" value={insulationUnitCost} onChange={(e) => setInsulationUnitCost(e.target.value)} />
                      <span className="text-slate-500">{unitMode === 'ip' ? '$ per ft²' : '$ per m²'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {lang === 'th' ? 'Total insulation cost =' : 'Total insulation cost ='}<span className="font-mono text-emerald-700"> {insulationCost.toFixed(2)} $</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {lang === 'th' ? 'Summary:' : 'Summary:'}<span className="font-mono text-purple-700"> {grandTotal.toFixed(2)} $</span>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>{lang === 'th' ? 'ตารางสรุปจะปรากฏเมื่อมีข้อมูลในตารางหลัก' : 'Summary table will appear when main table has data'}</p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
      
      {isLoading && (
        <Alert className="mt-4">
          <AlertDescription>
            กำลังวิเคราะห์ภาพ กรุณารอสักครู่...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImageCalculator;