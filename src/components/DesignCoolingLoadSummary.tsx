// ./components/DesignCoolingLoadSummary.tsx
import React from 'react';

// --- Type Definitions ---
interface ProjectInfo {
  projectName?: string;
  preparedBy?: string;
  roomName?: string;
}

interface DetailedLoad {
  sensible: number;
  latent: number;
}

interface DetailedLoads {
  [key: string]: DetailedLoad;
}

interface Props {
  projectInfo: ProjectInfo;
  detailedLoads: DetailedLoads;
}

// --- Helper Function ---
const formatNumber = (num: number): string => {
    if (typeof num !== 'number' || num === 0) return '0';
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


// --- Component ---
const DesignCoolingLoadSummary: React.FC<Props> = ({ projectInfo, detailedLoads }) => {
    const displayOrder: string[] = [
        'windows', 'walls', 'partitions', 'roof', 'ceilings', 'floors', 'lighting', 'equipments', 'people', 'outdoor'
    ];
    
    const categoryDisplayNames: { [key: string]: string } = {
        windows: 'Window Transmission',
        walls: 'Wall Transmission',
        partitions: 'Partitions',
        roof: 'Roof Transmission',
        ceilings: 'Ceiling',
        floors: 'Floor Transmission',
        lighting: 'Overhead Lighting',
        equipments: 'Room Equipment',
        people: 'People',
        outdoor: 'Infiltration / Ventilation'
    };

    // --- Calculations ---
    const totalSensible = Object.values(detailedLoads).reduce((sum, load) => sum + (load.sensible || 0), 0);
    const totalLatent = Object.values(detailedLoads).reduce((sum, load) => sum + (load.latent || 0), 0);
    const totalZoneLoads: DetailedLoad = { sensible: totalSensible, latent: totalLatent };
    
    const safetyFactor = 0.10; // 10%
    const safetyLoad: DetailedLoad = {
        sensible: totalZoneLoads.sensible * safetyFactor,
        latent: totalZoneLoads.latent * safetyFactor
    };

    const totalSystemLoads: DetailedLoad = {
        sensible: totalZoneLoads.sensible + safetyLoad.sensible,
        latent: totalZoneLoads.latent + safetyLoad.latent
    };

    const grandTotalCoolingLoad: number = totalSystemLoads.sensible + totalSystemLoads.latent;

    const roomSensibleHeatRatio: number = grandTotalCoolingLoad > 0 ? totalSystemLoads.sensible / grandTotalCoolingLoad : 0;

    return (
        <div id="printable-results" className="p-4 bg-white font-sans text-xs border border-gray-300">
            <div className="text-center mb-4">
                <h2 className="font-bold text-sm uppercase">AC System Design Load Summary for Climatic Region</h2>
            </div>
            <header className="flex justify-between mb-4 text-xs">
                <div>
                    <p><strong>Project Name:</strong> {projectInfo.projectName || 'N/A'}</p>
                    <p><strong>Prepared by:</strong> {projectInfo.preparedBy || 'N/A'}</p>
                    <p><strong>Room name:</strong> {projectInfo.roomName || 'N/A'}</p>
                </div>
                <div className="text-right">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</p>
                    <p><strong>Time:</strong> {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                </div>
            </header>

            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 p-2 text-left font-bold">DESIGN COOLING</th>
                        <th className="border border-gray-400 p-2 text-right font-bold">Details</th>
                        <th className="border border-gray-400 p-2 text-right font-bold">Sensible (W)</th>
                        <th className="border border-gray-400 p-2 text-right font-bold">Latent (W)</th>
                    </tr>
                </thead>
                <tbody>
                    {displayOrder.map(key => {
                        const load = detailedLoads[key] || { sensible: 0, latent: 0 };
                        const displayName = categoryDisplayNames[key] || key;
                        return (
                            <tr key={key}>
                                <td className="border border-gray-400 p-2">{displayName}</td>
                                <td className="border border-gray-400 p-2 text-right">-</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(load.sensible)}</td>
                                <td className="border border-gray-400 p-2 text-right">{formatNumber(load.latent)}</td>
                            </tr>
                        );
                    })}
                    
                    <tr className="font-bold bg-gray-100">
                        <td className="border border-gray-400 p-2">Total Zone Loads</td>
                        <td className="border border-gray-400 p-2 text-right">-</td>
                        <td className="border border-gray-400 p-2 text-right">{formatNumber(totalZoneLoads.sensible)}</td>
                        <td className="border border-gray-400 p-2 text-right">{formatNumber(totalZoneLoads.latent)}</td>
                    </tr>
                    
                    <tr>
                        <td className="border border-gray-400 p-2">Safety Factor</td>
                        <td className="border border-gray-400 p-2 text-right">10% / 10%</td>
                        <td className="border border-gray-400 p-2 text-right">{formatNumber(safetyLoad.sensible)}</td>
                        <td className="border border-gray-400 p-2 text-right">{formatNumber(safetyLoad.latent)}</td>
                    </tr>

                    <tr className="font-bold bg-gray-100">
                        <td className="border border-gray-400 p-2">Total System Loads</td>
                        <td className="border border-gray-400 p-2 text-right">-</td>
                        <td className="border border-gray-400 p-2 text-right">{formatNumber(totalSystemLoads.sensible)}</td>
                        <td className="border border-gray-400 p-2 text-right">{formatNumber(totalSystemLoads.latent)}</td>
                    </tr>
                     <tr className="font-bold bg-blue-100 text-blue-800">
                        <td className="border border-gray-400 p-2">Total Conditioning</td>
                        <td className="border border-gray-400 p-2 text-right">-</td>
                        <td colSpan={2} className="border border-gray-400 p-2 text-center">{formatNumber(grandTotalCoolingLoad)}</td>
                    </tr>
                    
                    <tr className="font-bold bg-yellow-100 text-yellow-800">
                        <td className="border border-gray-400 p-2">Room Sensible Heat Ratio</td>
                         <td className="border border-gray-400 p-2 text-right">-</td>
                        <td colSpan={2} className="border border-gray-400 p-2 text-center">
                            {isNaN(roomSensibleHeatRatio) ? 'N/A' : roomSensibleHeatRatio.toFixed(3)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DesignCoolingLoadSummary;