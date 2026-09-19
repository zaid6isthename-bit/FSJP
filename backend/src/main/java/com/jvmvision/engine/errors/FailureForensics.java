package com.jvmvision.engine.errors;

import java.util.LinkedHashMap;
import java.util.Map;

public class FailureForensics {

    public static Map<String, Object> analyze(SimulationException ex) {
        Map<String, Object> forensics = new LinkedHashMap<>();
        String type = ex.getExceptionType();
        int line = ex.getLine();
        String varName = ex.getVariableName() != null ? ex.getVariableName() : "expression";
        String op = ex.getAttemptedOperation() != null ? ex.getAttemptedOperation() : "operation";

        forensics.put("exceptionType", type);
        forensics.put("line", line);
        forensics.put("message", ex.getMessage());

        switch (type) {
            case "NullPointerException":
                forensics.put("reference", varName);
                forensics.put("value", "null");
                forensics.put("operation", op);
                forensics.put("rootCause", String.format("The reference '%s' is null. Cannot %s on an uninstantiated reference.", varName, op));
                forensics.put("whatToCheck", new String[] {
                        String.format("Ensure '%s' is instantiated with 'new' before accessing its fields or methods.", varName),
                        "Verify that previous method calls did not unexpectedly return null.",
                        String.format("Add a defensive check: 'if (%s != null) { ... }'.", varName)
                });
                break;

            case "ArithmeticException":
                forensics.put("reference", "divisor");
                forensics.put("value", "0");
                forensics.put("operation", op);
                forensics.put("rootCause", "Division or modulo by zero is undefined in integer arithmetic.");
                forensics.put("whatToCheck", new String[] {
                        "Inspect the denominator expression to verify why it evaluated to 0.",
                        "Add a guard check before dividing: 'if (divisor != 0) { ... }'.",
                        "If decimal division is desired, cast operands to double (e.g. 10.0 / 0 yields Infinity rather than crashing)."
                });
                break;

            case "ArrayIndexOutOfBoundsException":
                forensics.put("reference", "array index");
                forensics.put("operation", op);
                forensics.put("rootCause", "Array index falls outside the valid allocation bounds [0, length - 1].");
                forensics.put("whatToCheck", new String[] {
                        "Java arrays are 0-indexed: valid indices range from 0 to length - 1.",
                        "Check loop conditions: use 'i < array.length' instead of 'i <= array.length'.",
                        "Ensure the index calculation cannot produce negative values."
                });
                break;

            case "ExecutionLimitExceeded":
                forensics.put("reference", "execution step limit");
                forensics.put("operation", "execution safety watchdog");
                forensics.put("rootCause", "The program exceeded the safety threshold of maximum execution steps (loop iteration or recursion overflow).");
                forensics.put("whatToCheck", new String[] {
                        "Check for infinite loops (e.g. 'while (true)' without a terminating break).",
                        "Ensure loop counter variables (e.g. 'i++') are properly modified within loop bodies.",
                        "Verify recursion base cases to prevent unbounded stack frame generation."
                });
                break;

            default:
                forensics.put("reference", varName);
                forensics.put("operation", op);
                forensics.put("rootCause", ex.getMessage());
                forensics.put("whatToCheck", new String[] {
                        "Review the syntax and semantics at line " + line + ".",
                        "Verify all variable names and types match their declarations."
                });
                break;
        }

        return forensics;
    }
}
