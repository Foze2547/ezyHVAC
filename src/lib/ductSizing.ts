/**
 * HVAC Duct Sizing Library
 * 
 * A comprehensive library for HVAC duct sizing calculations including:
 * - Round duct diameter calculation from friction rate and airflow
 * - Rectangular duct sizing from round diameter
 * - Circular equivalent diameter calculation
 * - Air velocity calculations
 * 
 * Supports both SI and IP (Imperial) units with configurable constants.
 */

// Unit system enumeration
export enum UnitSystem {
  SI = 'SI',
  IP = 'IP'
}

// Default K constants for different unit systems
export const DEFAULT_K_CONSTANTS = {
  [UnitSystem.SI]: 26.3532202,   // For SI units (Pa/m, L/s, mm)
  [UnitSystem.IP]: 0.12317       // For IP units (in.wg/100ft, cfm, in)
} as const;

// Type definitions for input parameters
export interface RoundDuctParams {
  frictionRate: number;   // SI: Pa/m, IP: in.wg/100ft
  airflow: number;        // SI: L/s, IP: cfm
  unitSystem: UnitSystem;
  kConstant?: number;     // Optional custom K constant
}

export interface RectangularDuctDimensions {
  width: number;          // W in mm (SI) or inches (IP)
  height: number;         // H in mm (SI) or inches (IP)
}

export interface CircularEquivalentParams {
  width: number;          // a in mm (SI) or inches (IP)
  height: number;         // b in mm (SI) or inches (IP)
}

export interface AirVelocityParams {
  airflow: number;        // Q in cfm
  width: number;          // W in inches
  height: number;         // H in inches
}

/**
 * Calculate round duct diameter from friction rate and airflow
 * 
 * Formula: D = (FR / (K * Q^1.82))^(1/4.86)
 * 
 * @param params - Object containing friction rate, airflow, unit system, and optional K constant
 * @returns Duct diameter in mm (SI) or inches (IP)
 */
export function calculateRoundDuctDiameter(params: RoundDuctParams): number {
  const { frictionRate, airflow, unitSystem, kConstant } = params;
  
  // Use provided K constant or default for the unit system
  const K = kConstant ?? DEFAULT_K_CONSTANTS[unitSystem];
  
  // Validate inputs
  if (frictionRate <= 0 || airflow <= 0) {
    throw new Error('Friction rate and airflow must be positive values');
  }
  
  if (K <= 0) {
    throw new Error('K constant must be a positive value');
  }
  
  // Calculate diameter using the formula: D = (K * Q^1.82 / FR)^(1/4.86)
  // This gives more realistic results for HVAC applications
  const numerator = K * Math.pow(airflow, 1.82);
  const denominator = frictionRate;
  const ratio = numerator / denominator;
  const diameter = Math.pow(ratio, 1 / 4.86);
  
  return diameter;
}

/**
 * Calculate rectangular duct dimensions from round diameter
 * 
 * Uses aspect ratio W = 2*H and W = 1.317*D
 * Rounds UP to nearest EVEN integers for both W and H
 * 
 * @param roundDiameter - Round duct diameter in mm (SI) or inches (IP)
 * @returns Object with width and height dimensions
 */
export function calculateRectangularDuct(roundDiameter: number): RectangularDuctDimensions {
  if (roundDiameter <= 0) {
    throw new Error('Round diameter must be a positive value');
  }
  
  // Calculate raw dimensions
  const W_raw = 1.317 * roundDiameter;
  const H_raw = W_raw / 2;
  
  // Round UP to nearest EVEN integers
  const W_even = roundUpToEven(W_raw);
  const H_even = roundUpToEven(H_raw);
  
  return {
    width: W_even,
    height: H_even
  };
}

/**
 * Calculate circular equivalent diameter of a rectangular duct
 * 
 * Formula: De = 1.30 * (a*b)^0.625 / (a + b)^0.25
 * 
 * @param params - Object containing width (a) and height (b) of rectangular duct
 * @returns Circular equivalent diameter in same units as input
 */
export function calculateCircularEquivalent(params: CircularEquivalentParams): number {
  const { width, height } = params;
  
  if (width <= 0 || height <= 0) {
    throw new Error('Width and height must be positive values');
  }
  
  // Calculate using the formula: De = 1.30 * (a*b)^0.625 / (a + b)^0.25
  const numerator = 1.30 * Math.pow(width * height, 0.625);
  const denominator = Math.pow(width + height, 0.25);
  const equivalentDiameter = numerator / denominator;
  
  return equivalentDiameter;
}

/**
 * Calculate air velocity in rectangular duct
 * 
 * Formula: V = 144 * Q / (W * H)
 * Result in fpm when Q is in cfm and W,H are in inches
 * 
 * @param params - Object containing airflow (cfm), width (inches), and height (inches)
 * @returns Air velocity in feet per minute (fpm)
 */
export function calculateAirVelocity(params: AirVelocityParams): number {
  const { airflow, width, height } = params;
  
  if (airflow <= 0 || width <= 0 || height <= 0) {
    throw new Error('Airflow, width, and height must be positive values');
  }
  
  // Calculate velocity using: V = 144 * Q / (W * H)
  const velocity = (144 * airflow) / (width * height);
  
  return velocity;
}

/**
 * Helper function to round a number UP to the nearest even integer
 * 
 * @param value - The number to round
 * @returns The nearest even integer that is >= value
 */
function roundUpToEven(value: number): number {
  const ceiledValue = Math.ceil(value);
  
  // If already even, return it
  if (ceiledValue % 2 === 0) {
    return ceiledValue;
  }
  
  // If odd, add 1 to make it even
  return ceiledValue + 1;
}

/**
 * Complete duct sizing calculation workflow
 * 
 * Given friction rate and airflow, calculates:
 * 1. Round duct diameter
 * 2. Equivalent rectangular duct dimensions
 * 3. Circular equivalent verification
 * 4. Air velocity (for IP units only)
 * 
 * @param params - Input parameters for the calculation
 * @returns Complete duct sizing results
 */
export interface CompleteDuctSizingResult {
  roundDiameter: number;
  rectangular: RectangularDuctDimensions;
  circularEquivalent: number;
  airVelocity?: number; // Only for IP units
  unitSystem: UnitSystem;
}

export function completeDuctSizing(params: RoundDuctParams): CompleteDuctSizingResult {
  // Step 1: Calculate round duct diameter
  const roundDiameter = calculateRoundDuctDiameter(params);
  
  // Step 2: Calculate rectangular duct dimensions
  const rectangular = calculateRectangularDuct(roundDiameter);
  
  // Step 3: Calculate circular equivalent for verification
  const circularEquivalent = calculateCircularEquivalent({
    width: rectangular.width,
    height: rectangular.height
  });
  
  // Step 4: Calculate air velocity (for IP units only)
  let airVelocity: number | undefined;
  if (params.unitSystem === UnitSystem.IP) {
    airVelocity = calculateAirVelocity({
      airflow: params.airflow,
      width: rectangular.width,
      height: rectangular.height
    });
  }
  
  return {
    roundDiameter,
    rectangular,
    circularEquivalent,
    airVelocity,
    unitSystem: params.unitSystem
  };
}

/**
 * Utility functions for unit conversions (optional helpers)
 */
export const UnitConversions = {
  // Pressure conversions
  paPerMToInWgPer100ft: (paPerM: number) => paPerM * 0.00401463,
  inWgPer100ftToPaPerM: (inWgPer100ft: number) => inWgPer100ft / 0.00401463,
  
  // Flow rate conversions
  lsToFfm: (ls: number) => ls * 2.11888,
  cfmToLs: (cfm: number) => cfm / 2.11888,
  
  // Length conversions
  mmToInches: (mm: number) => mm / 25.4,
  inchesToMm: (inches: number) => inches * 25.4
} as const;