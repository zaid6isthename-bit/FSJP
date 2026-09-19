package com.jvmvision.engine.ast;

import java.util.List;

public class ProgramNode extends ASTNode {
    private final List<ClassNode> classes;

    public ProgramNode(int line, int column, List<ClassNode> classes) {
        super(line, column);
        this.classes = classes;
    }

    public List<ClassNode> getClasses() {
        return classes;
    }

    public ClassNode findClass(String name) {
        for (ClassNode cls : classes) {
            if (cls.getName().equals(name)) {
                return cls;
            }
        }
        return null;
    }

    public ClassNode findMainClass() {
        for (ClassNode cls : classes) {
            for (MethodNode method : cls.getMethods()) {
                if (method.isStatic() && "main".equals(method.getName())) {
                    return cls;
                }
            }
        }
        return classes.isEmpty() ? null : classes.get(0);
    }
}
