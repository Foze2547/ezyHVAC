export interface ProvinceData {
  name: string;
  thai: string;
  fullCapacity: number;
  halfCapacity: number;
  fullPowerFixed: number;
  fullPowerVariable: number;
  halfPowerVariable: number;
  powerQuarterLoad: number;
  designCoolingLoad: number;
  outdoorTemp: number;
}

export const provinceDataMap: Record<string, ProvinceData> = {
  'Bangkok': {
    name: 'Bangkok',
    thai: 'กรุงเทพฯ',
    fullCapacity:  13443.83,
    halfCapacity: 6721.915,
    fullPowerFixed: 940,
    fullPowerVariable: 910,
    halfPowerVariable:  427.00 ,
    powerQuarterLoad: 37.00966013846765,
    designCoolingLoad: 13443.83,
    outdoorTemp: 35
  },
  'Chiangmai': {
    name: 'Chiangmai',
    thai: 'เชียงใหม่',
    fullCapacity: 13443.83,
    halfCapacity: 6856.89,
    fullPowerFixed: 940,
    fullPowerVariable: 910,
    halfPowerVariable: 427.00,
    powerQuarterLoad: 76.14009749454054,
    designCoolingLoad: 13443.83,
    outdoorTemp: 35
  },
  'Chiangrai': {
    name: 'Chiangrai',
    thai: 'เชียงราย',
    fullCapacity: 13443.83,
    halfCapacity: 6856.89,
    fullPowerFixed: 940,
    fullPowerVariable: 910,
    halfPowerVariable: 427.00,
    powerQuarterLoad: 117.57898051664617,
    designCoolingLoad: 13443.83,
    outdoorTemp: 35
  },
  'Songkla': {
    name: 'Songkla',
    thai: 'สงขลา',
    fullCapacity: 13443.83,
    halfCapacity: 6856.89,
    fullPowerFixed: 940,
    fullPowerVariable: 910,
    halfPowerVariable: 427.00,
    powerQuarterLoad: 161.5367931139873,
    designCoolingLoad: 13443.83,
    outdoorTemp: 35
  },
  'Phitsanulok': {
    name: 'Phitsanulok',
    thai: 'พิษณุโลก',
    fullCapacity: 13443.83,
    halfCapacity: 6856.89,
    fullPowerFixed: 940,
    fullPowerVariable: 910,
    halfPowerVariable: 427.00,
    powerQuarterLoad: 208.2504105258208,
    designCoolingLoad: 13443.83,
    outdoorTemp: 35
  },
  'Khonkaen': {
    name: 'Khonkaen',
    thai: 'ขอนแก่น',
    fullCapacity: 13443.83,
    halfCapacity:  6856.89,
    fullPowerFixed: 940,
    fullPowerVariable: 910,
    halfPowerVariable: 427.00,
    powerQuarterLoad: 257.98736948983617,
    designCoolingLoad: 13443.83,
    outdoorTemp: 35
  },
};

export const getProvinceData = (provinceName: string): ProvinceData | null => {
  return provinceDataMap[provinceName] || null;
};

export const getAllProvinces = (): ProvinceData[] => {
  return Object.values(provinceDataMap);
};
