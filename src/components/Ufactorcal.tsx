import React, { useState, useMemo, useCallback } from 'react';

interface Material {
  name: string;
  value: number; 
  isFilm?: boolean; 
  isHeader?: boolean;
}

interface Layer {
  id: number;
  materialName: string;
  thickness: number; 
  kValue: string; 
}


const MATERIALS: Material[] = [
    { name: '--- Select Layer ---', value: 0 },

    { name: '--- Air Films & Cavities ---', value: 0, isHeader: true },
    { name: 'Outdoor air', value: 25, isFilm: true },
    { name: 'Indoor air - Vertical surface', value: 8.33, isFilm: true },
    { name: 'Indoor air - Horizontal surface', value: 6.25, isFilm: true },
    { name: 'Air in wall cavity', value: 6.67, isFilm: true },
    { name: 'Air in ceiling', value: 5.56, isFilm: true },
    
    { name: '--- Materials ---', value: 0, isHeader: true },
    { name: '--- Roof, Deck, Floor ---', value: 0, isHeader: true },
    { name: 'Concrete roof tiles', value: 0.993 },
    { name: 'Small corrugated tiles', value: 0.384 },
    { name: 'Large, corrugated fiber cement tiles', value: 0.441 },
    { name: 'Double corrugated fiber cement tiles', value: 0.395 },
    { name: 'Lightweight roof tiles', value: 0.341 },
    { name: 'Slate', value: 1.3 },
    { name: 'Asphalt', value: 0.11 },
    { name: 'Concrete', value: 1.442 },
    { name: 'Mortar', value: 0.72 },

    { name: '--- Ceiling ---', value: 0, isHeader: true },
    { name: 'Gypsum, Mineral and Fiber board', value: 0.17 },
    { name: 'Plaster board', value: 0.8 },

    { name: '--- Floor ---', value: 0, isHeader: true },
    { name: 'Vinyl tile', value: 0.573 },
    { name: 'Ceramic tile', value: 0.338 },
    { name: 'Marble stone', value: 1.25 },
    { name: 'Granite', value: 1.276 },
    { name: 'Slate (Floor)', value: 0.29 },
    { name: 'Terrazzo', value: 0.721 },
    { name: 'Parquet', value: 0.167 },
    { name: 'Laminate flooring', value: 0.115 },
    { name: 'Softwood', value: 1.7 },
    { name: 'Plywood', value: 0.15 },
    { name: 'Hardwood', value: 0.17 },

    { name: '--- Wall ---', value: 0, isHeader: true },
    { name: 'Brick', value: 0.473 },
    { name: 'Concrete block', value: 0.546 },
    { name: 'Lightweight concrete 620 kg/m³', value: 0.18 },
    { name: 'Plaster for lightweight concrete', value: 0.326 },
    { name: 'Fiber cement board', value: 0.084 },

    { name: '--- Glass ---', value: 0, isHeader: true },
    { name: 'Clear glass', value: 0.96 },
    { name: 'Reflective glass', value: 0.931 },

    { name: '--- Insulation ---', value: 0, isHeader: true },
    { name: 'Polystyrene (Styrofoam)', value: 0.038 },
    { name: 'Fiber glass', value: 0.042 },
    { name: 'Rockwool', value: 0.064 },
    { name: 'Polyurethane foam', value: 0.025 },
];


const Ufactorcal: React.FC = () => {
  const [assemblyType, setAssemblyType] = useState('Wall (Exterior)');
  const [layers, setLayers] = useState<Layer[]>([
    { id: Date.now() + 1, materialName: 'Outdoor air film', thickness: 0, kValue: '25' },
  ]);

  const inputClasses = "w-full px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-md font-kanit transition duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/25 focus:outline-none";
  const actionBtnClasses = "px-4 py-2 text-sm bg-gray-200 text-gray-800 border border-gray-300 rounded-md font-kanit cursor-pointer transition-all duration-300 hover:bg-gray-300";
  const removeBtnClasses = "px-2 py-1 text-xs font-bold text-white bg-red-500 border-none rounded-lg cursor-pointer flex items-center justify-center mx-auto hover:bg-red-600";
  const outputCellClasses = "p-2 font-medium text-center bg-blue-50 text-blue-600";
  
  const addLayer = () => {
    const newLayer: Layer = { id: Date.now(), materialName: '--- Select Layer ---', thickness: 10, kValue: '0' };
    setLayers([...layers, newLayer]);
  };

  const removeLayer = (id: number) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };

  const updateLayer = (id: number, field: keyof Omit<Layer, 'id'>, value: string | number) => {
    setLayers(layers.map(layer => {
        if (layer.id === id) {
            if (field === 'materialName') {
                const newMaterial = MATERIALS.find(m => m.name === value);
                const newValue = newMaterial ? String(newMaterial.value) : '0';
                return { ...layer, materialName: value as string, kValue: newValue };
            }
            return { ...layer, [field]: value };
        }
        return layer;
    }));
  };
  
  const calculateLayerRValue = useCallback((layer: Layer): number => {
    const material = MATERIALS.find(m => m.name === layer.materialName);
    if (!material || material.value === 0) return 0;
    

    if (material.isFilm) {
        const f = parseFloat(layer.kValue);
        return f > 0 ? 1 / f : 0;
    } 
    

    const k = parseFloat(layer.kValue);
    if (k > 0 && layer.thickness > 0) {
        const thicknessInMeters = layer.thickness / 1000;
        return thicknessInMeters / k;
    }

    return 0;
  }, []);

  const calculationResults = useMemo(() => {
    const rTotal = layers.reduce((total, layer) => total + calculateLayerRValue(layer), 0);
    const uValue = rTotal > 0 ? 1 / rTotal : 0;
    return { uValue };
  }, [layers, calculateLayerRValue]);


  return (
    <div className="min-h-screen bg-slate-100 font-kanit text-gray-800 text-xs flex items-center justify-center">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <main className="w-full max-w-3xl p-2 sm:p-2">
        <div className="flex flex-col p-2 bg-white border border-gray-200 shadow-lg md:p-3">
            <div className='mb-2'>
                <h1 className="text-lg font-semibold text-gray-800">U-Factor Calculator</h1>
            </div>

            <div className="mb-2 md:w-1/2 lg:w-1/3">
                <label htmlFor="assembly-type" className="block mb-1 font-medium text-gray-700">Assembly Type</label>
                <select 
                    id="assembly-type" 
                    value={assemblyType} 
                    onChange={(e) => setAssemblyType(e.target.value)} 
                    className={inputClasses}
                >
                    <option value="Roof">Roof</option>
                    <option value="Ceiling">Ceiling</option>
                    <option value="Floor">Floor</option>
                    <option value="Wall (Exterior)">Wall (Exterior)</option>
                    <option value="Partition">Partition</option>
                    <option value="Window">Window</option>
                </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
                <button className={actionBtnClasses} onClick={addLayer}>+ Add Layer</button>
            </div>
            <div className="flex-grow w-full overflow-x-auto">
                <table className="w-full border-collapse">
                <thead className="text-xs text-gray-600 bg-slate-100">
                    <tr>
                        <th className="p-1 text-center font-medium border border-gray-200">Del</th>
                        <th className="p-1 text-center font-medium border border-gray-200">No.</th>
                        <th className="p-1 text-center font-medium border border-gray-200">Layer Description</th>
                        <th className="p-1 text-center font-medium border border-gray-200">Thickness (mm)</th>
                        <th className="p-1 text-center font-medium border border-gray-200">
                            <span><i className="italic">k</i> Value (W/m·K)</span>
                        </th>
                        <th className="p-1 text-center font-medium border border-gray-200">R-Value (m²·K/W)</th>
                    </tr>
                </thead>
                <tbody>
                    {layers.map((layer, index) => {
                        const selectedMaterial = MATERIALS.find(m => m.name === layer.materialName);
                        const isFilm = selectedMaterial?.isFilm ?? false;
                        const layerRValue = calculateLayerRValue(layer);

                        return (
                            <tr key={layer.id} className="transition-colors duration-200 hover:bg-slate-50">
                            <td className="p-1 border border-gray-200"><button className={removeBtnClasses} onClick={() => removeLayer(layer.id)}>X</button></td>
                            <td className="p-2 text-center border border-gray-200">{index + 1}</td>
                                <td className="p-1 border border-gray-200 min-w-[220px]">
                                <select 
                                    className={inputClasses} 
                                    value={layer.materialName} 
                                    onChange={e => updateLayer(layer.id, 'materialName', e.target.value)}>
                                    {MATERIALS.map(opt => (
                                        opt.isHeader ?
                                        <option key={opt.name} disabled className="bg-gray-200 font-bold text-gray-600">
                                            {opt.name}
                                        </option> :
                                        <option key={opt.name} value={opt.name}>
                                            {opt.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="p-1 border border-gray-200 min-w-[100px]">
                                {isFilm ? (
                                    <div className="text-center text-gray-500">-</div>
                                ) : (
                                    <input 
                                        type="number" 
                                        className={`${inputClasses} text-right`} 
                                        value={layer.thickness}
                                        onChange={e => updateLayer(layer.id, 'thickness', e.target.value)}
                                        placeholder={'mm'}
                                        step="any" 
                                    />
                                )}
                            </td>
                            <td className="p-1 border border-gray-200 min-w-[100px]">
                                {isFilm ? (
                                    <div className="text-center text-gray-500">-</div>
                                ) : (
                                    <input
                                        type="number"
                                        className={`${inputClasses} text-right`}
                                        value={layer.kValue}
                                        onChange={e => updateLayer(layer.id, 'kValue', e.target.value)}
                                        step="any"
                                    />
                                )}
                            </td>
                            <td className={`${outputCellClasses} border border-gray-200 min-w-[100px] font-bold`}>
                                {layerRValue.toFixed(2)}
                            </td>
                            </tr>
                        )
                    })}
                </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between w-full p-2 mt-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm">
                    <span className="text-gray-600">Overall U-Factor for: </span>
                    <span className="text-blue-700">{assemblyType}</span>
                </div>
                <div className="text-right">
                    <span className="text-xl font-semibold leading-none text-gray-800">
                        {calculationResults.uValue.toFixed(2)}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 align-baseline">W/m²·K</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Ufactorcal;

