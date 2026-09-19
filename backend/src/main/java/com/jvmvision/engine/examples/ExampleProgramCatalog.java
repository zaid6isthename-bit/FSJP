package com.jvmvision.engine.examples;

import com.jvmvision.model.Example;

import java.util.ArrayList;
import java.util.List;

public class ExampleProgramCatalog {

    public static List<Example> getBuiltinExamples() {
        List<Example> list = new ArrayList<>();

        list.add(new Example(
                "object-creation",
                "Object Creation & Method Call",
                "Objects",
                "Flagship demonstration: Student class instantiation, constructor execution on call stack, heap allocation, and study() method mutating fields.",
                "class Student {\n" +
                "    String name;\n" +
                "    int marks;\n" +
                "\n" +
                "    Student(String name) {\n" +
                "        this.name = name;\n" +
                "        this.marks = 0;\n" +
                "    }\n" +
                "\n" +
                "    void study() {\n" +
                "        marks = marks + 10;\n" +
                "    }\n" +
                "}\n" +
                "\n" +
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        Student student = new Student(\"Zaid\");\n" +
                "        student.study();\n" +
                "        System.out.println(\"Marks: \" + student.marks);\n" +
                "    }\n" +
                "}",
                "Intermediate"
        ));

        list.add(new Example(
                "null-pointer-exception",
                "NullPointerException Crash",
                "Exceptions",
                "Flagship crash demonstration: Attempting to dereference a null object reference triggering forensic failure analysis.",
                "class Student {\n" +
                "    String name;\n" +
                "}\n" +
                "\n" +
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        Student student = null;\n" +
                "        System.out.println(student.name);\n" +
                "    }\n" +
                "}",
                "Beginner"
        ));

        list.add(new Example(
                "arithmetic-exception",
                "ArithmeticException: Division by Zero",
                "Exceptions",
                "Demonstrates integer division by zero and automated forensic root-cause analysis.",
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        int total = 100;\n" +
                "        int count = 0;\n" +
                "        int average = total / count;\n" +
                "        System.out.println(average);\n" +
                "    }\n" +
                "}",
                "Beginner"
        ));

        list.add(new Example(
                "loop-journey",
                "Loop Journey: Sum of Numbers",
                "Loops",
                "Demonstrates for-loop iteration, condition evaluation, and stepwise variable updates.",
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        int sum = 0;\n" +
                "        for (int i = 1; i <= 5; i++) {\n" +
                "            sum = sum + i;\n" +
                "            System.out.println(\"Step \" + i + \": sum = \" + sum);\n" +
                "        }\n" +
                "        System.out.println(\"Total: \" + sum);\n" +
                "    }\n" +
                "}",
                "Beginner"
        ));

        list.add(new Example(
                "array-explorer",
                "Array Memory & Indexing",
                "Arrays",
                "Demonstrates array allocation in heap memory, element access, and iteration.",
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        int[] scores = {85, 92, 78, 95};\n" +
                "        int total = 0;\n" +
                "        for (int i = 0; i < 4; i++) {\n" +
                "            total = total + scores[i];\n" +
                "        }\n" +
                "        System.out.println(\"Total score: \" + total);\n" +
                "    }\n" +
                "}",
                "Intermediate"
        ));

        list.add(new Example(
                "method-call",
                "Static Methods & Call Stack",
                "Methods",
                "Demonstrates parameters passing and stack frame push/pop across method boundaries.",
                "class Calculator {\n" +
                "    static int add(int a, int b) {\n" +
                "        int result = a + b;\n" +
                "        return result;\n" +
                "    }\n" +
                "}\n" +
                "\n" +
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        int x = 15;\n" +
                "        int y = 25;\n" +
                "        int sum = Calculator.add(x, y);\n" +
                "        System.out.println(\"Sum: \" + sum);\n" +
                "    }\n" +
                "}",
                "Beginner"
        ));

        list.add(new Example(
                "hello-runtime",
                "Hello Runtime",
                "Basics",
                "Simplest introductory Java program demonstrating variables and console output.",
                "class Main {\n" +
                "    public static void main(String[] args) {\n" +
                "        String greeting = \"Hello, JVM Vision!\";\n" +
                "        int year = 2026;\n" +
                "        System.out.println(greeting);\n" +
                "        System.out.println(\"Year: \" + year);\n" +
                "    }\n" +
                "}",
                "Beginner"
        ));

        return list;
    }
}
