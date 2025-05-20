// A map for user-friendly function names to Math object equivalents and custom logic.
const MATH_CONSTANTS_FUNCTIONS: Record<string, Function> = {
  'π': () => Math.PI,
  'e': () => Math.E,
  'sin': (angle: number, isRadians: boolean) => Math.sin(isRadians ? angle : angle * (Math.PI / 180)),
  'cos': (angle: number, isRadians: boolean) => Math.cos(isRadians ? angle : angle * (Math.PI / 180)),
  'tan': (angle: number, isRadians: boolean) => {
    const radAngle = isRadians ? angle : angle * (Math.PI / 180);
    if (Math.abs(Math.cos(radAngle)) < 1e-12) { 
      throw new Error("Tangent undefined"); // Will be caught and result in "Error"
    }
    return Math.tan(radAngle);
  },
  'log': (n: number) => Math.log10(n),
  'ln': (n: number) => Math.log(n),
  'sqrt': (n: number) => {
    if (n < 0) throw new Error("Sqrt of negative");
    return Math.sqrt(n);
  },
};

export function evaluateExpression(expression: string, isRadians: boolean): string {
  try {
    const scope: { [key: string]: any } = {};
    const funcArgNames: string[] = [];

    for (const key in MATH_CONSTANTS_FUNCTIONS) {
      const funcName = key.replace('π', 'PI_CONST').replace('e', 'E_CONST'); // Sanitize names for Function constructor
      funcArgNames.push(funcName);
      if (key === 'π' || key === 'e') {
        scope[funcName] = MATH_CONSTANTS_FUNCTIONS[key]();
      } else {
        scope[funcName] = (arg: number) => MATH_CONSTANTS_FUNCTIONS[key](arg, isRadians);
      }
    }
    
    let processedExpression = expression
      .replace(/π/g, 'PI_CONST')
      .replace(/e/g, 'E_CONST')
      .replace(/\^/g, '**');

    // Basic validation for allowed characters. This is not a full security measure.
    // Allowed: numbers, decimal points, operators +-*/%**, parentheses, known function names, E_CONST, PI_CONST.
    const allowedCharsRegex = /^[0-9\s.+\-*/%^()a-zA-Z_]*$/;
    if (!allowedCharsRegex.test(processedExpression)) {
        // Check specifically for our function names and constants
        const knownFunctionsAndConsts = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'PI_CONST', 'E_CONST'];
        let tempExpr = processedExpression;
        knownFunctionsAndConsts.forEach(f => {
            const regex = new RegExp(f, 'g');
            tempExpr = tempExpr.replace(regex, '');
        });
        // After removing known functions, check remaining characters
        if (!/^[0-9\s.+\-*/%^()]*$/.test(tempExpr)) {
             console.error("Potentially unsafe characters in expression:", processedExpression);
             return 'Error: Invalid chars';
        }
    }
    
    const funcValues = funcArgNames.map(key => scope[key]);
    
    // Use 'use strict' for slightly safer evaluation context
    const F = new Function(...funcArgNames, `"use strict"; return ${processedExpression}`);
    const result = F(...funcValues);

    if (typeof result !== 'number') {
      return 'Error: Invalid result type';
    }
    if (!Number.isFinite(result)) {
      if (Number.isNaN(result)) return "Error: NaN"; // Specific NaN for results like 0/0
      if (result === Infinity) return 'Infinity';
      if (result === -Infinity) return '-Infinity';
      return 'Error: Non-finite';
    }

    const resultString = Number(result.toFixed(10)).toString();
    
    if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-9 && result !== 0)) {
      return result.toExponential(5);
    }

    return resultString;

  } catch (error: any) {
    console.error("Evaluation error:", error.message);
    if (error.message.includes("Tangent undefined") || error.message.includes("Sqrt of negative")) {
        return "Error: Math domain";
    }
    if (error instanceof SyntaxError) {
        return "Error: Syntax";
    }
    return "Error";
  }
}
