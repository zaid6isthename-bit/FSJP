package com.jvmvision.engine.interpreter;

import com.jvmvision.engine.ast.*;
import com.jvmvision.engine.errors.*;
import com.jvmvision.engine.runtime.*;
import com.jvmvision.engine.trace.*;

import java.util.*;

public class Interpreter {
    private final ProgramNode program;
    private final int maxEvents;
    private final int maxLoopIterations;
    private final int maxRecursionDepth;
    private final int maxOutputSize;

    private final Deque<StackFrame> callStack = new ArrayDeque<>();
    private final Map<Long, HeapObject> heap = new LinkedHashMap<>();
    private final Map<Long, HeapArray> arrays = new LinkedHashMap<>();
    private final StringBuilder output = new StringBuilder();
    private final List<ExecutionEvent> events = new ArrayList<>();

    private long nextObjectId = 1;
    private long nextArrayId = 1;
    private long nextFrameId = 1;
    private int eventSequence = 0;
    private int loopIterationCount = 0;
    private boolean hasReturned = false;

    public Interpreter(ProgramNode program, int maxEvents, int maxLoopIterations, int maxRecursionDepth, int maxOutputSize) {
        this.program = program;
        this.maxEvents = maxEvents > 0 ? maxEvents : 10000;
        this.maxLoopIterations = maxLoopIterations > 0 ? maxLoopIterations : 5000;
        this.maxRecursionDepth = maxRecursionDepth > 0 ? maxRecursionDepth : 100;
        this.maxOutputSize = maxOutputSize > 0 ? maxOutputSize : 102400;
    }

    public ExecutionTrace execute(String sessionId) {
        ClassNode mainClass = program.findMainClass();
        if (mainClass == null) {
            throw new SimulationException("MissingMainClass", "No executable class or main method found in program", 1, null, "locate main method");
        }

        MethodNode mainMethod = null;
        for (MethodNode m : mainClass.getMethods()) {
            if ("main".equals(m.getName())) {
                mainMethod = m;
                break;
            }
        }

        if (mainMethod == null) {
            throw new SimulationException("MissingMainMethod", "Class '" + mainClass.getName() + "' has no main(String[] args) method", 1, null, "locate main method");
        }

        try {
            // Push Main frame
            StackFrame mainFrame = new StackFrame(nextFrameId++, mainClass.getName(), "main", mainMethod.getLine());
            // args parameter
            mainFrame.getParameters().put("args", RuntimeValue.ofArray(0, "String"));
            callStack.push(mainFrame);

            recordEvent(mainMethod.getLine(), EventType.PROGRAM_STARTED, "Execution started at main()", null, null, null);

            // Execute main method statements
            executeBlock(mainMethod.getBody());

            if (!callStack.isEmpty()) {
                callStack.pop();
            }

            recordEvent(mainMethod.getLine(), EventType.PROGRAM_COMPLETED, "Program execution completed successfully", null, null, null);

            return new ExecutionTrace(sessionId, "COMPLETED", events, null, null, null, null);

        } catch (SimulationException ex) {
            int line = ex.getLine() > 0 ? ex.getLine() : (callStack.isEmpty() ? 1 : callStack.peek().getCurrentLine());
            Map<String, Object> forensics = FailureForensics.analyze(ex);

            recordEvent(line, EventType.EXCEPTION_THROWN, "Exception thrown: " + ex.getExceptionType() + " - " + ex.getMessage(),
                    ex.getVariableName(), null, forensics);

            recordEvent(line, EventType.PROGRAM_FAILED, "Execution halted due to " + ex.getExceptionType(),
                    ex.getVariableName(), null, forensics);

            return new ExecutionTrace(sessionId, "FAILED", events, ex.getExceptionType(), ex.getMessage(), line, forensics);

        } catch (Exception ex) {
            int line = callStack.isEmpty() ? 1 : callStack.peek().getCurrentLine();
            SimulationException wrapped = new SimulationException("RuntimeError", ex.getMessage() != null ? ex.getMessage() : "Unknown runtime failure", line, null, "statement execution");
            Map<String, Object> forensics = FailureForensics.analyze(wrapped);

            recordEvent(line, EventType.EXCEPTION_THROWN, "Exception thrown: " + wrapped.getMessage(), null, null, forensics);
            recordEvent(line, EventType.PROGRAM_FAILED, "Execution halted", null, null, forensics);

            return new ExecutionTrace(sessionId, "FAILED", events, "RuntimeError", ex.getMessage(), line, forensics);
        }
    }

    private void recordEvent(int line, EventType type, String description,
                             String highlightedVar, Long highlightedObj, Map<String, Object> metadata) {
        eventSequence++;
        if (type != EventType.EXCEPTION_THROWN && type != EventType.PROGRAM_FAILED && eventSequence > maxEvents) {
            throw new ExecutionLimitException("Exceeded maximum execution event threshold (" + maxEvents + " steps)", line);
        }

        List<StackFrameSnapshot> stackSnapshots = new ArrayList<>();
        for (StackFrame frame : callStack) {
            List<VariableSnapshot> vars = new ArrayList<>();
            for (Map.Entry<String, RuntimeValue> entry : frame.getLocalVariables().entrySet()) {
                RuntimeValue v = entry.getValue();
                vars.add(new VariableSnapshot(entry.getKey(), v.getTypeName(), v.getRawValue(), v.getDisplayValue(), v.isReference(), v.getReferenceId()));
            }

            List<VariableSnapshot> params = new ArrayList<>();
            for (Map.Entry<String, RuntimeValue> entry : frame.getParameters().entrySet()) {
                RuntimeValue v = entry.getValue();
                params.add(new VariableSnapshot(entry.getKey(), v.getTypeName(), v.getRawValue(), v.getDisplayValue(), v.isReference(), v.getReferenceId()));
            }

            String ret = frame.getReturnValue() != null ? frame.getReturnValue().getDisplayValue() : null;
            stackSnapshots.add(new StackFrameSnapshot(frame.getFrameId(), frame.getClassName(), frame.getMethodName(), frame.getCurrentLine(), vars, params, ret));
        }

        List<HeapObjectSnapshot> heapSnapshots = new ArrayList<>();
        for (HeapObject obj : heap.values()) {
            Map<String, VariableSnapshot> fieldSnaps = new LinkedHashMap<>();
            for (Map.Entry<String, RuntimeValue> entry : obj.getFields().entrySet()) {
                RuntimeValue v = entry.getValue();
                fieldSnaps.put(entry.getKey(), new VariableSnapshot(entry.getKey(), v.getTypeName(), v.getRawValue(), v.getDisplayValue(), v.isReference(), v.getReferenceId()));
            }
            heapSnapshots.add(new HeapObjectSnapshot(obj.getObjectId(), obj.getClassName(), fieldSnaps, obj.getCreatedAtEvent()));
        }

        List<HeapArraySnapshot> arraySnapshots = new ArrayList<>();
        for (HeapArray arr : arrays.values()) {
            List<String> elemDisplays = new ArrayList<>();
            for (RuntimeValue elem : arr.getElements()) {
                elemDisplays.add(elem.getDisplayValue());
            }
            arraySnapshots.add(new HeapArraySnapshot(arr.getArrayId(), arr.getElementTypeName(), elemDisplays, arr.getCreatedAtEvent()));
        }

        events.add(new ExecutionEvent(
                eventSequence,
                line,
                type,
                System.currentTimeMillis(),
                description,
                stackSnapshots,
                heapSnapshots,
                arraySnapshots,
                output.toString(),
                highlightedVar,
                highlightedObj,
                metadata
        ));
    }

    private void executeBlock(BlockNode block) {
        for (StatementNode stmt : block.getStatements()) {
            if (hasReturned) return;
            executeStatement(stmt);
        }
    }

    private void executeStatement(StatementNode stmt) {
        if (stmt == null || hasReturned) return;

        StackFrame currentFrame = getCurrentFrame();
        currentFrame.setCurrentLine(stmt.getLine());

        if (stmt instanceof BlockNode) {
            executeBlock((BlockNode) stmt);
        } else if (stmt instanceof VariableDeclarationNode) {
            executeVariableDeclaration((VariableDeclarationNode) stmt);
        } else if (stmt instanceof IfNode) {
            executeIf((IfNode) stmt);
        } else if (stmt instanceof WhileNode) {
            executeWhile((WhileNode) stmt);
        } else if (stmt instanceof ForNode) {
            executeFor((ForNode) stmt);
        } else if (stmt instanceof ReturnNode) {
            executeReturn((ReturnNode) stmt);
        } else if (stmt instanceof ExpressionStatementNode) {
            executeExpressionStatement((ExpressionStatementNode) stmt);
        } else if (stmt instanceof TryCatchNode) {
            executeTryCatch((TryCatchNode) stmt);
        } else if (stmt instanceof ThrowNode) {
            executeThrow((ThrowNode) stmt);
        }
    }

    private void executeVariableDeclaration(VariableDeclarationNode node) {
        RuntimeValue val;
        if (node.getInitializer() != null) {
            val = evaluateExpression(node.getInitializer());
        } else {
            val = getDefaultValue(node.getType());
        }

        getCurrentFrame().setVariable(node.getName(), val);

        Map<String, Object> meta = new HashMap<>();
        meta.put("variableName", node.getName());
        meta.put("type", node.getType());
        meta.put("value", val.getDisplayValue());

        recordEvent(node.getLine(), EventType.VARIABLE_CREATED,
                String.format("Declared %s %s = %s", node.getType(), node.getName(), val.getDisplayValue()),
                node.getName(), val.getReferenceId(), meta);
    }

    private RuntimeValue executeAssignment(AssignmentNode node) {
        ExpressionNode target = node.getTarget();
        RuntimeValue newVal = evaluateExpression(node.getValue());

        if (target instanceof VariableExpressionNode) {
            String name = ((VariableExpressionNode) target).getName();
            RuntimeValue currentVal = getCurrentFrame().getVariable(name);
            if (currentVal == null) {
                currentVal = getDefaultValue("int");
            }

            RuntimeValue finalVal = computeNewValueWithOperator(node.getOperator(), currentVal, newVal, node.getLine());
            getCurrentFrame().setVariable(name, finalVal);

            Map<String, Object> meta = new HashMap<>();
            meta.put("variableName", name);
            meta.put("operator", node.getOperator());
            meta.put("previousValue", currentVal.getDisplayValue());
            meta.put("newValue", finalVal.getDisplayValue());

            recordEvent(node.getLine(), EventType.VARIABLE_CHANGED,
                    String.format("Updated %s %s %s (now %s)", name, node.getOperator(), newVal.getDisplayValue(), finalVal.getDisplayValue()),
                    name, finalVal.getReferenceId(), meta);

        } else if (target instanceof FieldAccessNode) {
            FieldAccessNode fa = (FieldAccessNode) target;
            RuntimeValue targetObjRef = evaluateExpression(fa.getTarget());
            if (targetObjRef.isNull()) {
                String varName = fa.getTarget() instanceof VariableExpressionNode ?
                        ((VariableExpressionNode) fa.getTarget()).getName() : "reference";
                throw new NullPointerSimulationException(node.getLine(), varName, "assign field '" + fa.getFieldName() + "'");
            }

            HeapObject obj = heap.get(targetObjRef.getReferenceId());
            if (obj == null) {
                throw new SimulationException("ObjectNotFound", "Heap object not found", node.getLine(), null, "field assignment");
            }

            RuntimeValue currentVal = obj.getField(fa.getFieldName());
            if (currentVal == null) currentVal = getDefaultValue("int");

            RuntimeValue finalVal = computeNewValueWithOperator(node.getOperator(), currentVal, newVal, node.getLine());
            obj.setField(fa.getFieldName(), finalVal);

            Map<String, Object> meta = new HashMap<>();
            meta.put("objectId", obj.getObjectId());
            meta.put("className", obj.getClassName());
            meta.put("fieldName", fa.getFieldName());
            meta.put("previousValue", currentVal.getDisplayValue());
            meta.put("newValue", finalVal.getDisplayValue());

            recordEvent(node.getLine(), EventType.FIELD_CHANGED,
                    String.format("Updated %s.%s = %s", obj.getClassName(), fa.getFieldName(), finalVal.getDisplayValue()),
                    fa.getFieldName(), obj.getObjectId(), meta);

        } else if (target instanceof ArrayAccessNode) {
            ArrayAccessNode aa = (ArrayAccessNode) target;
            RuntimeValue targetArrRef = evaluateExpression(aa.getTarget());
            if (targetArrRef.isNull()) {
                throw new NullPointerSimulationException(node.getLine(), "array", "assign element");
            }

            HeapArray arr = arrays.get(targetArrRef.getReferenceId());
            if (arr == null) {
                throw new SimulationException("ArrayNotFound", "Heap array not found", node.getLine(), null, "array element assignment");
            }

            int index = evaluateExpression(aa.getIndex()).asInt();
            if (index < 0 || index >= arr.length()) {
                throw new ArrayIndexOutOfBoundsSimulationException(node.getLine(), index, arr.length());
            }

            arr.set(index, newVal);

            Map<String, Object> meta = new HashMap<>();
            meta.put("arrayId", arr.getArrayId());
            meta.put("index", index);
            meta.put("newValue", newVal.getDisplayValue());

            recordEvent(node.getLine(), EventType.ARRAY_CHANGED,
                    String.format("Updated Array[%d] = %s", index, newVal.getDisplayValue()),
                    null, arr.getArrayId(), meta);
            return newVal;
        }
        return newVal;
    }

    private RuntimeValue computeNewValueWithOperator(String operator, RuntimeValue current, RuntimeValue operand, int line) {
        if ("=".equals(operator)) {
            return operand;
        } else if ("+=".equals(operator)) {
            if (current.getKind() == RuntimeValue.ValueKind.STRING || operand.getKind() == RuntimeValue.ValueKind.STRING) {
                return RuntimeValue.ofString(current.asString() + operand.asString());
            }
            if (current.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE || operand.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE) {
                return RuntimeValue.ofDouble(current.asDouble() + operand.asDouble());
            }
            return RuntimeValue.ofInt(current.asInt() + operand.asInt());
        } else if ("-=".equals(operator)) {
            if (current.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE || operand.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE) {
                return RuntimeValue.ofDouble(current.asDouble() - operand.asDouble());
            }
            return RuntimeValue.ofInt(current.asInt() - operand.asInt());
        }
        return operand;
    }

    private void executeIf(IfNode node) {
        RuntimeValue condVal = evaluateExpression(node.getCondition());
        boolean conditionResult = condVal.asBoolean();

        Map<String, Object> meta = new HashMap<>();
        meta.put("conditionResult", conditionResult);

        recordEvent(node.getLine(), EventType.CONDITION_EVALUATED,
                String.format("Evaluated if condition: %s -> %s", node.getCondition() instanceof BinaryExpressionNode ? "expr" : "condition", conditionResult),
                null, null, meta);

        if (conditionResult) {
            executeStatement(node.getThenBranch());
        } else if (node.getElseBranch() != null) {
            executeStatement(node.getElseBranch());
        }
    }

    private void executeWhile(WhileNode node) {
        while (true) {
            if (loopIterationCount++ > maxLoopIterations) {
                throw new ExecutionLimitException("Loop iteration safety limit exceeded (" + maxLoopIterations + " iterations)", node.getLine());
            }

            RuntimeValue condVal = evaluateExpression(node.getCondition());
            boolean conditionResult = condVal.asBoolean();

            Map<String, Object> meta = new HashMap<>();
            meta.put("conditionResult", conditionResult);

            recordEvent(node.getLine(), EventType.CONDITION_EVALUATED,
                    String.format("Evaluated while condition -> %s", conditionResult),
                    null, null, meta);

            if (!conditionResult || hasReturned) break;

            recordEvent(node.getLine(), EventType.LOOP_ITERATION, "Entering while loop iteration", null, null, null);
            executeStatement(node.getBody());
        }
    }

    private void executeFor(ForNode node) {
        if (node.getInitializer() != null) {
            executeStatement(node.getInitializer());
        }

        while (true) {
            if (loopIterationCount++ > maxLoopIterations) {
                throw new ExecutionLimitException("Loop iteration safety limit exceeded (" + maxLoopIterations + " iterations)", node.getLine());
            }

            if (node.getCondition() != null) {
                RuntimeValue condVal = evaluateExpression(node.getCondition());
                boolean conditionResult = condVal.asBoolean();

                Map<String, Object> meta = new HashMap<>();
                meta.put("conditionResult", conditionResult);

                recordEvent(node.getLine(), EventType.CONDITION_EVALUATED,
                        String.format("Evaluated for condition -> %s", conditionResult),
                        null, null, meta);

                if (!conditionResult || hasReturned) break;
            }

            recordEvent(node.getLine(), EventType.LOOP_ITERATION, "Entering for loop iteration", null, null, null);
            executeStatement(node.getBody());
            if (hasReturned) break;

            if (node.getUpdate() != null) {
                executeStatement(node.getUpdate());
            }
        }
    }

    private void executeReturn(ReturnNode node) {
        RuntimeValue val = node.getValue() != null ? evaluateExpression(node.getValue()) : null;
        getCurrentFrame().setReturnValue(val);
        hasReturned = true;

        Map<String, Object> meta = new HashMap<>();
        meta.put("returnValue", val != null ? val.getDisplayValue() : "void");

        recordEvent(node.getLine(), EventType.LINE_EXECUTED,
                String.format("Return %s", val != null ? val.getDisplayValue() : ""),
                null, null, meta);
    }

    private void executeExpressionStatement(ExpressionStatementNode node) {
        evaluateExpression(node.getExpression());
    }

    private void executeTryCatch(TryCatchNode node) {
        try {
            executeBlock(node.getTryBlock());
        } catch (SimulationException ex) {
            if (ex.getExceptionType().equals(node.getExceptionType()) || "Exception".equals(node.getExceptionType())) {
                Map<String, Object> meta = new HashMap<>();
                meta.put("caughtType", ex.getExceptionType());
                meta.put("message", ex.getMessage());

                recordEvent(node.getLine(), EventType.EXCEPTION_CAUGHT,
                        String.format("Caught %s in try-catch block", ex.getExceptionType()),
                        node.getExceptionVarName(), null, meta);

                getCurrentFrame().setVariable(node.getExceptionVarName(), RuntimeValue.ofString(ex.getMessage()));
                executeBlock(node.getCatchBlock());
            } else {
                throw ex;
            }
        }
    }

    private void executeThrow(ThrowNode node) {
        RuntimeValue val = evaluateExpression(node.getExpression());
        String msg = val.asString();
        throw new SimulationException("CustomException", msg, node.getLine(), null, "throw statement");
    }

    private RuntimeValue evaluateExpression(ExpressionNode expr) {
        if (expr == null) return RuntimeValue.nullValue(null);

        if (expr instanceof LiteralNode) {
            LiteralNode lit = (LiteralNode) expr;
            String type = lit.getTypeName();
            if ("int".equals(type)) return RuntimeValue.ofInt((Integer) lit.getValue());
            if ("double".equals(type)) return RuntimeValue.ofDouble((Double) lit.getValue());
            if ("boolean".equals(type)) return RuntimeValue.ofBoolean((Boolean) lit.getValue());
            if ("String".equals(type)) return RuntimeValue.ofString((String) lit.getValue());
            if ("null".equals(type)) return RuntimeValue.nullValue(null);
            return RuntimeValue.ofString(String.valueOf(lit.getValue()));
        }

        if (expr instanceof VariableExpressionNode) {
            String name = ((VariableExpressionNode) expr).getName();
            RuntimeValue val = getCurrentFrame().getVariable(name);
            if (val == null) {
                // Check if it's a field on 'this'
                RuntimeValue thisRef = getCurrentFrame().getVariable("this");
                if (thisRef != null && !thisRef.isNull()) {
                    HeapObject thisObj = heap.get(thisRef.getReferenceId());
                    if (thisObj != null && thisObj.getField(name) != null) {
                        return thisObj.getField(name);
                    }
                }
                throw new SimulationException("UnknownVariable", "Variable '" + name + "' is not defined in current scope", expr.getLine(), name, "read variable");
            }
            return val;
        }

        if (expr instanceof ThisExpressionNode) {
            RuntimeValue thisRef = getCurrentFrame().getVariable("this");
            if (thisRef == null) {
                throw new SimulationException("InvalidThis", "Keyword 'this' cannot be used in a static context", expr.getLine(), "this", "access 'this'");
            }
            return thisRef;
        }

        if (expr instanceof AssignmentNode) {
            return executeAssignment((AssignmentNode) expr);
        }

        if (expr instanceof BinaryExpressionNode) {
            return evaluateBinary((BinaryExpressionNode) expr);
        }

        if (expr instanceof UnaryExpressionNode) {
            return evaluateUnary((UnaryExpressionNode) expr);
        }

        if (expr instanceof ObjectCreationNode) {
            return evaluateObjectCreation((ObjectCreationNode) expr);
        }

        if (expr instanceof FieldAccessNode) {
            return evaluateFieldAccess((FieldAccessNode) expr);
        }

        if (expr instanceof ArrayCreationNode) {
            return evaluateArrayCreation((ArrayCreationNode) expr);
        }

        if (expr instanceof ArrayAccessNode) {
            return evaluateArrayAccess((ArrayAccessNode) expr);
        }

        if (expr instanceof MethodCallNode) {
            return evaluateMethodCall((MethodCallNode) expr);
        }

        return RuntimeValue.nullValue(null);
    }

    private RuntimeValue evaluateBinary(BinaryExpressionNode node) {
        String op = node.getOperator();

        // Short-circuit logical operators
        if ("&&".equals(op)) {
            RuntimeValue leftVal = evaluateExpression(node.getLeft());
            if (!leftVal.asBoolean()) return RuntimeValue.ofBoolean(false);
            return RuntimeValue.ofBoolean(evaluateExpression(node.getRight()).asBoolean());
        }
        if ("||".equals(op)) {
            RuntimeValue leftVal = evaluateExpression(node.getLeft());
            if (leftVal.asBoolean()) return RuntimeValue.ofBoolean(true);
            return RuntimeValue.ofBoolean(evaluateExpression(node.getRight()).asBoolean());
        }

        RuntimeValue left = evaluateExpression(node.getLeft());
        RuntimeValue right = evaluateExpression(node.getRight());

        // String concatenation
        if ("+".equals(op) && (left.getKind() == RuntimeValue.ValueKind.STRING || right.getKind() == RuntimeValue.ValueKind.STRING)) {
            return RuntimeValue.ofString(left.asString() + right.asString());
        }

        // Numeric operations
        boolean isDouble = left.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE || right.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE;

        switch (op) {
            case "+":
                return isDouble ? RuntimeValue.ofDouble(left.asDouble() + right.asDouble()) : RuntimeValue.ofInt(left.asInt() + right.asInt());
            case "-":
                return isDouble ? RuntimeValue.ofDouble(left.asDouble() - right.asDouble()) : RuntimeValue.ofInt(left.asInt() - right.asInt());
            case "*":
                return isDouble ? RuntimeValue.ofDouble(left.asDouble() * right.asDouble()) : RuntimeValue.ofInt(left.asInt() * right.asInt());
            case "/":
                if (isDouble) {
                    return RuntimeValue.ofDouble(left.asDouble() / right.asDouble());
                }
                int divisor = right.asInt();
                if (divisor == 0) {
                    throw new ArithmeticSimulationException(node.getLine(), "/ by zero");
                }
                return RuntimeValue.ofInt(left.asInt() / divisor);
            case "%":
                int modDivisor = right.asInt();
                if (modDivisor == 0) {
                    throw new ArithmeticSimulationException(node.getLine(), "% by zero");
                }
                return RuntimeValue.ofInt(left.asInt() % modDivisor);
            case "<":
                return RuntimeValue.ofBoolean(left.asDouble() < right.asDouble());
            case "<=":
                return RuntimeValue.ofBoolean(left.asDouble() <= right.asDouble());
            case ">":
                return RuntimeValue.ofBoolean(left.asDouble() > right.asDouble());
            case ">=":
                return RuntimeValue.ofBoolean(left.asDouble() >= right.asDouble());
            case "==":
                return RuntimeValue.ofBoolean(Objects.equals(left.getRawValue(), right.getRawValue()) && Objects.equals(left.getReferenceId(), right.getReferenceId()));
            case "!=":
                return RuntimeValue.ofBoolean(!Objects.equals(left.getRawValue(), right.getRawValue()) || !Objects.equals(left.getReferenceId(), right.getReferenceId()));
        }

        throw new SimulationException("UnsupportedOperator", "Unsupported binary operator: " + op, node.getLine(), null, "binary expression");
    }

    private RuntimeValue evaluateUnary(UnaryExpressionNode node) {
        String op = node.getOperator();
        ExpressionNode operand = node.getOperand();

        if ("!".equals(op)) {
            boolean val = evaluateExpression(operand).asBoolean();
            return RuntimeValue.ofBoolean(!val);
        }
        if ("-".equals(op)) {
            RuntimeValue val = evaluateExpression(operand);
            if (val.getKind() == RuntimeValue.ValueKind.PRIMITIVE_DOUBLE) {
                return RuntimeValue.ofDouble(-val.asDouble());
            }
            return RuntimeValue.ofInt(-val.asInt());
        }

        // ++ or --
        if ("++".equals(op) || "--".equals(op)) {
            if (operand instanceof VariableExpressionNode) {
                String varName = ((VariableExpressionNode) operand).getName();
                RuntimeValue curVal = getCurrentFrame().getVariable(varName);
                if (curVal == null) curVal = RuntimeValue.ofInt(0);

                int delta = "++".equals(op) ? 1 : -1;
                int updatedInt = curVal.asInt() + delta;
                RuntimeValue updatedVal = RuntimeValue.ofInt(updatedInt);
                getCurrentFrame().setVariable(varName, updatedVal);

                recordEvent(node.getLine(), EventType.VARIABLE_CHANGED,
                        String.format("%s (%s now %d)", op, varName, updatedInt),
                        varName, null, null);

                return node.isPrefix() ? updatedVal : curVal;
            }
        }

        return evaluateExpression(operand);
    }

    private RuntimeValue evaluateObjectCreation(ObjectCreationNode node) {
        ClassNode cls = program.findClass(node.getClassName());
        if (cls == null) {
            throw new SimulationException("ClassNotFound", "Class '" + node.getClassName() + "' is not declared in this program", node.getLine(), node.getClassName(), "instantiate object");
        }

        long objectId = nextObjectId++;
        HeapObject heapObj = new HeapObject(objectId, cls.getName(), eventSequence + 1);

        // Initialize fields
        for (FieldDeclarationNode field : cls.getFields()) {
            RuntimeValue initial = field.getInitializer() != null ?
                    evaluateExpression(field.getInitializer()) :
                    getDefaultValue(field.getType());
            heapObj.setField(field.getName(), initial);
        }

        heap.put(objectId, heapObj);

        Map<String, Object> meta = new HashMap<>();
        meta.put("objectId", objectId);
        meta.put("className", cls.getName());

        recordEvent(node.getLine(), EventType.OBJECT_CREATED,
                String.format("Instantiated new %s (Object #%d on Heap)", cls.getName(), objectId),
                null, objectId, meta);

        RuntimeValue objRef = RuntimeValue.ofReference(objectId, cls.getName());

        // Find constructor
        ConstructorNode constructor = null;
        for (ConstructorNode c : cls.getConstructors()) {
            if (c.getParameters().size() == node.getArguments().size()) {
                constructor = c;
                break;
            }
        }

        if (constructor != null) {
            List<RuntimeValue> evaluatedArgs = new ArrayList<>();
            for (ExpressionNode arg : node.getArguments()) {
                evaluatedArgs.add(evaluateExpression(arg));
            }

            StackFrame constructorFrame = new StackFrame(nextFrameId++, cls.getName(), cls.getName() + "<init>", constructor.getLine());
            constructorFrame.getParameters().put("this", objRef);
            for (int i = 0; i < constructor.getParameters().size(); i++) {
                constructorFrame.getParameters().put(constructor.getParameters().get(i).getName(), evaluatedArgs.get(i));
            }

            if (callStack.size() >= maxRecursionDepth) {
                throw new ExecutionLimitException("Recursion depth limit exceeded (" + maxRecursionDepth + " frames)", node.getLine());
            }

            callStack.push(constructorFrame);
            recordEvent(constructor.getLine(), EventType.METHOD_ENTER,
                    String.format("Entered constructor %s() for Object #%d", cls.getName(), objectId),
                    null, objectId, null);

            boolean prevReturned = hasReturned;
            hasReturned = false;
            executeBlock(constructor.getBody());
            hasReturned = prevReturned;

            recordEvent(constructor.getLine(), EventType.METHOD_EXIT,
                    String.format("Exited constructor %s()", cls.getName()),
                    null, objectId, null);
            callStack.pop();
        }

        return objRef;
    }

    private RuntimeValue evaluateFieldAccess(FieldAccessNode node) {
        RuntimeValue target = evaluateExpression(node.getTarget());
        if (target.isNull()) {
            String targetName = node.getTarget() instanceof VariableExpressionNode ?
                    ((VariableExpressionNode) node.getTarget()).getName() : "reference";
            throw new NullPointerSimulationException(node.getLine(), targetName, "read field '" + node.getFieldName() + "'");
        }

        HeapObject obj = heap.get(target.getReferenceId());
        if (obj == null) {
            throw new SimulationException("ObjectNotFound", "Heap object not found", node.getLine(), null, "read field");
        }

        RuntimeValue val = obj.getField(node.getFieldName());
        return val != null ? val : getDefaultValue("int");
    }

    private RuntimeValue evaluateArrayCreation(ArrayCreationNode node) {
        long arrayId = nextArrayId++;
        HeapArray arr = new HeapArray(arrayId, node.getElementTypeName(), eventSequence + 1);

        if (node.getInitializers() != null) {
            for (ExpressionNode elemExpr : node.getInitializers()) {
                arr.getElements().add(evaluateExpression(elemExpr));
            }
        } else if (node.getSizeExpression() != null) {
            int size = evaluateExpression(node.getSizeExpression()).asInt();
            for (int i = 0; i < size; i++) {
                arr.getElements().add(getDefaultValue(node.getElementTypeName()));
            }
        }

        arrays.put(arrayId, arr);

        Map<String, Object> meta = new HashMap<>();
        meta.put("arrayId", arrayId);
        meta.put("length", arr.length());

        recordEvent(node.getLine(), EventType.ARRAY_CREATED,
                String.format("Created %s[%d] (Array #%d in memory)", node.getElementTypeName(), arr.length(), arrayId),
                null, arrayId, meta);

        return RuntimeValue.ofArray(arrayId, node.getElementTypeName());
    }

    private RuntimeValue evaluateArrayAccess(ArrayAccessNode node) {
        RuntimeValue target = evaluateExpression(node.getTarget());
        if (target.isNull()) {
            throw new NullPointerSimulationException(node.getLine(), "array", "read element");
        }

        HeapArray arr = arrays.get(target.getReferenceId());
        if (arr == null) {
            throw new SimulationException("ArrayNotFound", "Heap array not found", node.getLine(), null, "read array element");
        }

        int index = evaluateExpression(node.getIndex()).asInt();
        if (index < 0 || index >= arr.length()) {
            throw new ArrayIndexOutOfBoundsSimulationException(node.getLine(), index, arr.length());
        }

        return arr.get(index);
    }

    private RuntimeValue evaluateMethodCall(MethodCallNode node) {
        // Handle System.out.println / System.out.print
        if (isSystemOut(node.getTarget(), node.getMethodName())) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < node.getArguments().size(); i++) {
                if (i > 0) sb.append(" ");
                RuntimeValue argVal = evaluateExpression(node.getArguments().get(i));
                sb.append(argVal.asString());
            }

            boolean isPrintln = "println".equals(node.getMethodName());
            if (isPrintln) sb.append("\n");

            if (output.length() + sb.length() > maxOutputSize) {
                throw new ExecutionLimitException("Output buffer capacity exceeded (" + maxOutputSize + " bytes)", node.getLine());
            }

            output.append(sb);

            Map<String, Object> meta = new HashMap<>();
            meta.put("printedText", sb.toString());

            recordEvent(node.getLine(), EventType.OUTPUT_WRITTEN,
                    "Output: " + sb.toString().trim(),
                    null, null, meta);

            return RuntimeValue.nullValue(null);
        }

        // Object method call (e.g. student.study()) or Static method call (e.g. add(a, b))
        RuntimeValue targetRef = null;
        ClassNode targetClass;

        if (node.getTarget() != null) {
            targetRef = evaluateExpression(node.getTarget());
            if (targetRef.isNull()) {
                String varName = node.getTarget() instanceof VariableExpressionNode ?
                        ((VariableExpressionNode) node.getTarget()).getName() : "reference";
                throw new NullPointerSimulationException(node.getLine(), varName, "invoke method '" + node.getMethodName() + "()'");
            }
            targetClass = program.findClass(targetRef.getTypeName());
        } else {
            // Local method in current class
            targetClass = program.findClass(getCurrentFrame().getClassName());
        }

        if (targetClass == null) {
            throw new SimulationException("ClassNotFound", "Target class not found for method call: " + node.getMethodName(), node.getLine(), null, "method invocation");
        }

        MethodNode method = null;
        for (MethodNode m : targetClass.getMethods()) {
            if (m.getName().equals(node.getMethodName()) && m.getParameters().size() == node.getArguments().size()) {
                method = m;
                break;
            }
        }

        if (method == null) {
            throw new SimulationException("MethodNotFound", "Method '" + node.getMethodName() + "' with " + node.getArguments().size() + " parameters not found in class '" + targetClass.getName() + "'", node.getLine(), node.getMethodName(), "method invocation");
        }

        List<RuntimeValue> evaluatedArgs = new ArrayList<>();
        for (ExpressionNode arg : node.getArguments()) {
            evaluatedArgs.add(evaluateExpression(arg));
        }

        if (callStack.size() >= maxRecursionDepth) {
            throw new ExecutionLimitException("Recursion depth limit exceeded (" + maxRecursionDepth + " frames)", node.getLine());
        }

        StackFrame newFrame = new StackFrame(nextFrameId++, targetClass.getName(), method.getName(), method.getLine());
        if (targetRef != null) {
            newFrame.getParameters().put("this", targetRef);
        }
        for (int i = 0; i < method.getParameters().size(); i++) {
            newFrame.getParameters().put(method.getParameters().get(i).getName(), evaluatedArgs.get(i));
        }

        callStack.push(newFrame);

        Map<String, Object> meta = new HashMap<>();
        meta.put("methodName", method.getName());
        meta.put("className", targetClass.getName());

        recordEvent(method.getLine(), EventType.METHOD_ENTER,
                String.format("Entered method %s.%s()", targetClass.getName(), method.getName()),
                null, targetRef != null ? targetRef.getReferenceId() : null, meta);

        boolean prevReturned = hasReturned;
        hasReturned = false;
        executeBlock(method.getBody());
        hasReturned = prevReturned;

        RuntimeValue returnVal = newFrame.getReturnValue();

        recordEvent(method.getLine(), EventType.METHOD_EXIT,
                String.format("Exited method %s.%s() (returned %s)", targetClass.getName(), method.getName(), returnVal != null ? returnVal.getDisplayValue() : "void"),
                null, targetRef != null ? targetRef.getReferenceId() : null, meta);

        callStack.pop();
        return returnVal != null ? returnVal : RuntimeValue.nullValue(null);
    }

    private boolean isSystemOut(ExpressionNode target, String methodName) {
        if (!("println".equals(methodName) || "print".equals(methodName))) {
            return false;
        }
        if (target instanceof FieldAccessNode) {
            FieldAccessNode fa = (FieldAccessNode) target;
            if ("out".equals(fa.getFieldName()) && fa.getTarget() instanceof VariableExpressionNode) {
                return "System".equals(((VariableExpressionNode) fa.getTarget()).getName());
            }
        }
        return false;
    }

    private RuntimeValue getDefaultValue(String type) {
        if ("int".equals(type)) return RuntimeValue.ofInt(0);
        if ("double".equals(type)) return RuntimeValue.ofDouble(0.0);
        if ("boolean".equals(type)) return RuntimeValue.ofBoolean(false);
        if ("String".equals(type)) return RuntimeValue.nullValue("String");
        return RuntimeValue.nullValue(type);
    }

    private StackFrame getCurrentFrame() {
        if (callStack.isEmpty()) {
            throw new IllegalStateException("Call stack is empty");
        }
        return callStack.peek();
    }
}
