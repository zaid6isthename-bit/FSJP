package com.jvmvision.engine.ast;

import java.util.List;

public class ClassNode extends ASTNode {
    private final String name;
    private final String superClassName;
    private final List<FieldDeclarationNode> fields;
    private final List<ConstructorNode> constructors;
    private final List<MethodNode> methods;

    public ClassNode(int line, int column, String name, String superClassName,
                     List<FieldDeclarationNode> fields,
                     List<ConstructorNode> constructors,
                     List<MethodNode> methods) {
        super(line, column);
        this.name = name;
        this.superClassName = superClassName;
        this.fields = fields;
        this.constructors = constructors;
        this.methods = methods;
    }

    public String getName() {
        return name;
    }

    public String getSuperClassName() {
        return superClassName;
    }

    public List<FieldDeclarationNode> getFields() {
        return fields;
    }

    public List<ConstructorNode> getConstructors() {
        return constructors;
    }

    public List<MethodNode> getMethods() {
        return methods;
    }
}
