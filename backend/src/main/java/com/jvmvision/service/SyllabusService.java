package com.jvmvision.service;

import com.jvmvision.model.SyllabusExperiment;
import com.jvmvision.repository.SyllabusRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class SyllabusService {

    private final SyllabusRepository syllabusRepository;

    public SyllabusService(SyllabusRepository syllabusRepository) {
        this.syllabusRepository = syllabusRepository;
    }

    @PostConstruct
    public void initSyllabusData() {
        if (syllabusRepository.count() < 13) {
            for (SyllabusExperiment exp : getPredefinedExperiments()) {
                syllabusRepository.save(exp);
            }
        }
    }

    public List<SyllabusExperiment> getAllExperiments() {
        return syllabusRepository.findAll();
    }

    public Optional<SyllabusExperiment> getExperimentById(String id) {
        return syllabusRepository.findById(id);
    }

    public Optional<SyllabusExperiment> getExperimentByNumber(int number) {
        return syllabusRepository.findByExperimentNumber(number);
    }

    public List<SyllabusExperiment> getExperimentsByCategory(String category) {
        return syllabusRepository.findByCategory(category);
    }

    public List<SyllabusExperiment> searchExperiments(String query) {
        if (query == null || query.trim().isEmpty()) {
            return syllabusRepository.findAll();
        }
        return syllabusRepository.search(query.trim());
    }

    public static List<SyllabusExperiment> getPredefinedExperiments() {
        List<SyllabusExperiment> list = new ArrayList<>();

        // Exp 01
        list.add(new SyllabusExperiment(
                "exp-01-classes-objects",
                1,
                "Programs on Classes and Objects",
                "JAVA_OOP",
                "Java",
                "Understand blueprints, object instantiation, state encapsulation, constructors, and instance method execution.",
                "class Student {\n" +
                        "    String name;\n" +
                        "    int marks;\n\n" +
                        "    Student(String name, int marks) {\n" +
                        "        this.name = name;\n" +
                        "        this.marks = marks;\n" +
                        "    }\n\n" +
                        "    void display() {\n" +
                        "        System.out.println(name + \" : \" + marks);\n" +
                        "    }\n" +
                        "}\n\n" +
                        "class Main {\n" +
                        "    public static void main(String[] args) {\n" +
                        "        Student s = new Student(\"Zaid\", 85);\n" +
                        "        s.display();\n" +
                        "    }\n" +
                        "}",
                "java",
                Arrays.asList("Class", "Object", "Fields", "Constructor", "Encapsulation", "Method Invocation"),
                "Beginner",
                "To write and demonstrate a Java program creating user-defined classes and instantiating objects with parameterized constructors.",
                "Zaid : 85",
                "/syllabus/java/classes-objects",
                true,
                LocalDateTime.now()
        ));

        // Exp 02
        list.add(new SyllabusExperiment(
                "exp-02-overloading",
                2,
                "Method and Constructor Overloading",
                "JAVA_OOP",
                "Java",
                "Explore compile-time polymorphism where methods or constructors share the same identifier with differing parameter lists.",
                "class Calculator {\n" +
                        "    static int add(int a, int b) {\n" +
                        "        return a + b;\n" +
                        "    }\n\n" +
                        "    static int add(int a, int b, int c) {\n" +
                        "        return a + b + c;\n" +
                        "    }\n\n" +
                        "    static double add(double a, double b) {\n" +
                        "        return a + b;\n" +
                        "    }\n" +
                        "}\n\n" +
                        "class Main {\n" +
                        "    public static void main(String[] args) {\n" +
                        "        int sum2 = Calculator.add(10, 20);\n" +
                        "        int sum3 = Calculator.add(10, 20, 30);\n" +
                        "        double sumDec = Calculator.add(5.5, 4.5);\n" +
                        "        System.out.println(\"Sum 2: \" + sum2);\n" +
                        "        System.out.println(\"Sum 3: \" + sum3);\n" +
                        "        System.out.println(\"Sum Double: \" + sumDec);\n" +
                        "    }\n" +
                        "}",
                "java",
                Arrays.asList("Method Overloading", "Constructor Overloading", "Polymorphism", "Signature Resolution"),
                "Beginner",
                "To demonstrate compile-time polymorphism through method and constructor overloading based on type and number of arguments.",
                "Sum 2: 30\nSum 3: 60\nSum Double: 10.0",
                "/syllabus/java/overloading",
                true,
                LocalDateTime.now()
        ));

        // Exp 03
        list.add(new SyllabusExperiment(
                "exp-03-inheritance-exceptions",
                3,
                "Inheritance and Exception Handling",
                "JAVA_OOP",
                "Java",
                "Implement single and multilevel inheritance hierarchies and manage runtime abnormalities using try-catch blocks.",
                "class Animal {\n" +
                        "    String species;\n\n" +
                        "    Animal(String species) {\n" +
                        "        this.species = species;\n" +
                        "    }\n\n" +
                        "    void sound() {\n" +
                        "        System.out.println(\"Generic Animal Sound\");\n" +
                        "    }\n" +
                        "}\n\n" +
                        "class Dog extends Animal {\n" +
                        "    String breed;\n\n" +
                        "    Dog(String breed) {\n" +
                        "        super(\"Canine\");\n" +
                        "        this.breed = breed;\n" +
                        "    }\n\n" +
                        "    void bark() {\n" +
                        "        System.out.println(breed + \" barks loudly!\");\n" +
                        "    }\n" +
                        "}\n\n" +
                        "class Main {\n" +
                        "    public static void main(String[] args) {\n" +
                        "        Dog d = new Dog(\"Golden Retriever\");\n" +
                        "        d.bark();\n\n" +
                        "        try {\n" +
                        "            int result = 10 / 0;\n" +
                        "            System.out.println(result);\n" +
                        "        } catch (ArithmeticException e) {\n" +
                        "            System.out.println(\"Handled: Division by zero caught safely\");\n" +
                        "        }\n" +
                        "    }\n" +
                        "}",
                "java",
                Arrays.asList("Single Inheritance", "super keyword", "try-catch", "ArithmeticException", "Runtime Recovery"),
                "Intermediate",
                "To implement class inheritance and protect application flow from catastrophic termination using structured exception handling.",
                "Golden Retriever barks loudly!\nHandled: Division by zero caught safely",
                "/syllabus/java/inheritance-exceptions",
                true,
                LocalDateTime.now()
        ));

        // Exp 04
        list.add(new SyllabusExperiment(
                "exp-04-generic-http-servlets",
                4,
                "GenericServlet and HttpServlet",
                "SERVLETS_JSP",
                "Servlet",
                "Understand the server-side Java Servlet architecture, lifecycle methods, and handling HTTP GET vs POST requests.",
                "// GenericServlet vs HttpServlet Implementation\n" +
                        "import jakarta.servlet.*;\n" +
                        "import jakarta.servlet.http.*;\n" +
                        "import java.io.IOException;\n" +
                        "import java.io.PrintWriter;\n\n" +
                        "public class StudentServlet extends HttpServlet {\n" +
                        "    @Override\n" +
                        "    protected void doGet(HttpServletRequest req, HttpServletResponse resp)\n" +
                        "            throws ServletException, IOException {\n" +
                        "        resp.setContentType(\"text/html\");\n" +
                        "        PrintWriter out = resp.getWriter();\n" +
                        "        String studentName = req.getParameter(\"name\");\n" +
                        "        out.println(\"<h1>Welcome, \" + (studentName != null ? studentName : \"Guest\") + \"</h1>\");\n" +
                        "    }\n\n" +
                        "    @Override\n" +
                        "    protected void doPost(HttpServletRequest req, HttpServletResponse resp)\n" +
                        "            throws ServletException, IOException {\n" +
                        "        String course = req.getParameter(\"course\");\n" +
                        "        resp.getWriter().println(\"Enrolled in: \" + course);\n" +
                        "    }\n" +
                        "}",
                "java",
                Arrays.asList("GenericServlet", "HttpServlet", "service()", "doGet()", "doPost()", "Servlet Container", "Lifecycle"),
                "Intermediate",
                "To understand the role of GenericServlet protocol neutrality vs HttpServlet HTTP semantics in the Jakarta EE / Servlet specification.",
                "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<h1>Welcome, Zaid</h1>",
                "/syllabus/servlets/generic-http",
                false,
                LocalDateTime.now()
        ));

        // Exp 05
        list.add(new SyllabusExperiment(
                "exp-05-jsp-jdbc-login",
                5,
                "JSP Login + JDBC + Servlet",
                "SERVLETS_JSP",
                "JSP / JDBC",
                "Demonstrate MVC web architecture connecting a JSP client view, Servlet controller, JDBC queries, and database persistence.",
                "// 1. JSP Form View (login.jsp)\n" +
                        "<form action=\"LoginServlet\" method=\"POST\">\n" +
                        "    <input type=\"email\" name=\"email\" placeholder=\"student@college.edu\" required />\n" +
                        "    <input type=\"password\" name=\"password\" required />\n" +
                        "    <button type=\"submit\">Login</button>\n" +
                        "</form>\n\n" +
                        "// 2. Controller Servlet & JDBC Query\n" +
                        "String sql = \"SELECT id, name FROM students WHERE email = ? AND password_hash = ?\";\n" +
                        "try (PreparedStatement ps = conn.prepareStatement(sql)) {\n" +
                        "    ps.setString(1, email);\n" +
                        "    ps.setString(2, hashedPassword);\n" +
                        "    ResultSet rs = ps.executeQuery();\n" +
                        "    if (rs.next()) {\n" +
                        "        HttpSession session = req.getSession();\n" +
                        "        session.setAttribute(\"user\", rs.getString(\"name\"));\n" +
                        "        resp.sendRedirect(\"dashboard.jsp\");\n" +
                        "    }\n" +
                        "}",
                "java",
                Arrays.asList("MVC Pattern", "JSP Forms", "JDBC PreparedStatement", "Authentication", "Session State"),
                "Intermediate",
                "To build a student authentication mechanism integrating JSP form capture, Servlet request processing, and secure JDBC queries.",
                "Session created for student 'Zaid' -> Redirect to dashboard.jsp",
                "/syllabus/jsp/jdbc-login",
                false,
                LocalDateTime.now()
        ));

        // Exp 06
        list.add(new SyllabusExperiment(
                "exp-06-jsp-objects",
                6,
                "JSP Implicit and Explicit Objects",
                "SERVLETS_JSP",
                "JSP",
                "Explore the 9 pre-defined implicit objects provided by the JSP container, including request, response, session, out, and application.",
                "<%@ page language=\"java\" contentType=\"text/html; charset=UTF-8\" %>\n" +
                        "<html>\n" +
                        "<body>\n" +
                        "    <h2>JSP Implicit Objects Demonstration</h2>\n" +
                        "    <% \n" +
                        "       // 1. request object\n" +
                        "       String userAgent = request.getHeader(\"User-Agent\");\n" +
                        "       // 2. session object\n" +
                        "       session.setAttribute(\"sessionTime\", new java.util.Date());\n" +
                        "       // 3. application context\n" +
                        "       Integer visits = (Integer) application.getAttribute(\"visitCount\");\n" +
                        "       visits = (visits == null) ? 1 : visits + 1;\n" +
                        "       application.setAttribute(\"visitCount\", visits);\n" +
                        "       // 4. out object\n" +
                        "       out.println(\"<p>Total Platform Visits: \" + visits + \"</p>\");\n" +
                        "    %>\n" +
                        "</body>\n" +
                        "</html>",
                "jsp",
                Arrays.asList("request", "response", "session", "application", "out", "config", "pageContext"),
                "Beginner",
                "To learn how the JSP translator automatically instantiates implicit variables without manual declaration.",
                "Total Platform Visits: 1 | Session Active: true | Status: 200 OK",
                "/syllabus/jsp/objects",
                false,
                LocalDateTime.now()
        ));

        // Exp 07
        list.add(new SyllabusExperiment(
                "exp-07-html-css-js",
                7,
                "Website Using HTML, CSS and JavaScript",
                "WEB_FUNDAMENTALS",
                "HTML/CSS/JS",
                "Create a student profile webpage combining HTML5 semantics, responsive CSS styling, and dynamic JavaScript DOM theme manipulation.",
                "<!-- HTML5 Profile Structure -->\n" +
                        "<div class=\"student-card\">\n" +
                        "    <h2 id=\"name\">Zaid Mohammed</h2>\n" +
                        "    <p class=\"course\">Full Stack Java Programming - Sem III</p>\n" +
                        "    <table class=\"grades-table\">\n" +
                        "        <tr><th>Subject</th><th>Grade</th></tr>\n" +
                        "        <tr><td>Core Java & OOP</td><td>A+</td></tr>\n" +
                        "        <tr><td>Servlets & JSP</td><td>A</td></tr>\n" +
                        "    </table>\n" +
                        "    <button onclick=\"toggleTheme()\">Change Theme</button>\n" +
                        "</div>\n\n" +
                        "/* JavaScript Theme Switcher */\n" +
                        "function toggleTheme() {\n" +
                        "    document.body.classList.toggle('dark-theme');\n" +
                        "}",
                "html",
                Arrays.asList("HTML5 Semantics", "CSS Flexbox", "Theme Switching", "Event Listeners", "DOM Styles"),
                "Beginner",
                "To construct an integrated client-side interface combining structure (HTML), aesthetics (CSS), and behavior (JavaScript).",
                "Theme toggled: Dark Mode activated dynamically across all card elements.",
                "/syllabus/web/html-css-js",
                false,
                LocalDateTime.now()
        ));

        // Exp 08
        list.add(new SyllabusExperiment(
                "exp-08-email-validation",
                8,
                "JavaScript Email Validation",
                "WEB_FUNDAMENTALS",
                "JavaScript",
                "Implement client-side form validation checking for required characters (@, .), non-empty local parts, and valid domain structures.",
                "function validateEmail(email) {\n" +
                        "    const atIndex = email.indexOf('@');\n" +
                        "    const dotIndex = email.lastIndexOf('.');\n\n" +
                        "    // Rule 1: @ must exist and cannot be first character\n" +
                        "    if (atIndex < 1) return false;\n\n" +
                        "    // Rule 2: . must exist after @ with at least 1 character between\n" +
                        "    if (dotIndex <= atIndex + 1) return false;\n\n" +
                        "    // Rule 3: Must have at least 2 characters after last dot\n" +
                        "    if (dotIndex + 2 >= email.length) return false;\n\n" +
                        "    return true;\n" +
                        "}\n\n" +
                        "// Usage with DOM\n" +
                        "const input = document.getElementById('emailInput').value;\n" +
                        "const isValid = validateEmail(input);\n" +
                        "document.getElementById('status').innerText = isValid \n" +
                        "    ? '✓ Valid email address' \n" +
                        "    : '⚠ Please enter a valid email address';",
                "javascript",
                Arrays.asList("Client Validation", "String Parsing", "RegExp / Indexing", "DOM Feedback", "Form Guarding"),
                "Beginner",
                "To validate user email format before form submission using JavaScript string inspection and DOM status feedback.",
                "Input: 'zaid@college.edu' -> Valid: true",
                "/syllabus/javascript/email-validation",
                false,
                LocalDateTime.now()
        ));

        // Exp 09
        list.add(new SyllabusExperiment(
                "exp-09-dom-background",
                9,
                "DOM Auto Background Color Change",
                "WEB_FUNDAMENTALS",
                "DOM",
                "Demonstrate JavaScript asynchronous timers and dynamic DOM property modification by changing background color every 5 seconds.",
                "// DOM Auto Background Color Cycle\n" +
                        "const colors = ['#0f172a', '#1e1b4b', '#064e3b', '#3b0764', '#172554'];\n" +
                        "let colorIndex = 0;\n" +
                        "let intervalId = null;\n\n" +
                        "function changeBackgroundColor() {\n" +
                        "    const selectedColor = colors[colorIndex];\n" +
                        "    // DOM modification on document.body\n" +
                        "    document.body.style.backgroundColor = selectedColor;\n" +
                        "    console.log('DOM updated color to: ' + selectedColor);\n" +
                        "    colorIndex = (colorIndex + 1) % colors.length;\n" +
                        "}\n\n" +
                        "// Start timer cycle every 5000 milliseconds\n" +
                        "function startColorCycle() {\n" +
                        "    if (!intervalId) {\n" +
                        "        intervalId = setInterval(changeBackgroundColor, 5000);\n" +
                        "    }\n" +
                        "}",
                "javascript",
                Arrays.asList("DOM Tree", "document.body.style", "setInterval", "Timer Lifecycle", "Event Loop"),
                "Beginner",
                "To manipulate the Document Object Model (DOM) dynamically using JavaScript asynchronous timer functions.",
                "Interval trigger: Color switched to #1e1b4b (Timer countdown resets to 5.0s)",
                "/syllabus/javascript/dom-background",
                false,
                LocalDateTime.now()
        ));

        // Exp 10
        list.add(new SyllabusExperiment(
                "exp-10-react-hooks-colors",
                10,
                "React Hooks — Color Selection",
                "REACT",
                "React",
                "Master React functional component state using the useState hook to dynamically update color themes and re-render the view.",
                "import React, { useState } from 'react';\n\n" +
                        "export default function ColorPickerDemo() {\n" +
                        "    // 1. Declare state variable with initial value\n" +
                        "    const [selectedColor, setSelectedColor] = useState('BLUE');\n\n" +
                        "    const colorMap = {\n" +
                        "        RED: '#ef4444',\n" +
                        "        BLUE: '#3b82f6',\n" +
                        "        GREEN: '#10b981',\n" +
                        "        YELLOW: '#f59e0b'\n" +
                        "    };\n\n" +
                        "    return (\n" +
                        "        <div style={{ padding: '24px', backgroundColor: colorMap[selectedColor] }}>\n" +
                        "            <h2>You selected {selectedColor}</h2>\n" +
                        "            {Object.keys(colorMap).map(color => (\n" +
                        "                <button key={color} onClick={() => setSelectedColor(color)}>\n" +
                        "                    {color}\n" +
                        "                </button>\n" +
                        "            ))}\n" +
                        "        </div>\n" +
                        "    );\n" +
                        "}",
                "javascript",
                Arrays.asList("React Hooks", "useState", "Event Handlers", "Component Re-render", "Declarative UI"),
                "Beginner",
                "To implement state management in React functional components using the useState Hook.",
                "State change: selectedColor = 'GREEN' -> Component re-renders with green background banner",
                "/syllabus/react/hooks-colors",
                false,
                LocalDateTime.now()
        ));

        // Exp 11
        list.add(new SyllabusExperiment(
                "exp-11-react-spa",
                11,
                "React Single Page Application",
                "REACT",
                "React",
                "Build a complete multi-view Single Page Application using React Router, props passing, and component hierarchy.",
                "import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';\n" +
                        "import { useState } from 'react';\n\n" +
                        "function StudentCard({ name, division, semester }) {\n" +
                        "    return (\n" +
                        "        <div className=\"student-card\">\n" +
                        "            <h3>{name}</h3>\n" +
                        "            <p>Div: {division} | Semester: {semester}</p>\n" +
                        "        </div>\n" +
                        "    );\n" +
                        "}\n\n" +
                        "export default function App() {\n" +
                        "    return (\n" +
                        "        <Router>\n" +
                        "            <nav>\n" +
                        "                <Link to=\"/\">Home</Link>\n" +
                        "                <Link to=\"/students\">Students</Link>\n" +
                        "                <Link to=\"/courses\">Courses</Link>\n" +
                        "                <Link to=\"/about\">About</Link>\n" +
                        "            </nav>\n" +
                        "            <Routes>\n" +
                        "                <Route path=\"/\" element={<h2>Home Dashboard</h2>} />\n" +
                        "                <Route path=\"/students\" element={<StudentCard name=\"Zaid\" division=\"A\" semester={3} />} />\n" +
                        "            </Routes>\n" +
                        "        </Router>\n" +
                        "    );\n" +
                        "}",
                "javascript",
                Arrays.asList("React Router", "Props Passing", "Component Architecture", "Single Page Navigation", "Client Routing"),
                "Intermediate",
                "To architect a modular React Single Page Application utilizing client-side routing and reusable component props.",
                "Route rendered: /students -> Loaded StudentCard component with props { name: 'Zaid', division: 'A', semester: 3 }",
                "/syllabus/react/spa",
                false,
                LocalDateTime.now()
        ));

        // Exp 12
        list.add(new SyllabusExperiment(
                "exp-12-spring-monolith",
                12,
                "Monolithic Application Using Spring Boot",
                "SPRING_BOOT",
                "Spring Boot",
                "Examine a layered monolithic architecture with Spring Boot @Controller, @Service, and @Repository layers with real database persistence.",
                "@RestController\n" +
                        "@RequestMapping(\"/api/books\")\n" +
                        "public class BookController {\n" +
                        "    private final BookService bookService;\n\n" +
                        "    public BookController(BookService bookService) {\n" +
                        "        this.bookService = bookService;\n" +
                        "    }\n\n" +
                        "    @GetMapping\n" +
                        "    public List<Book> listBooks() {\n" +
                        "        return bookService.getAllBooks();\n" +
                        "    }\n\n" +
                        "    @PostMapping\n" +
                        "    public Book createBook(@RequestBody Book book) {\n" +
                        "        return bookService.createBook(book);\n" +
                        "    }\n" +
                        "}\n\n" +
                        "@Service\n" +
                        "public class BookService {\n" +
                        "    private final BookRepository repository;\n" +
                        "    // Injected constructor & business logic\n" +
                        "}",
                "java",
                Arrays.asList("Spring Boot", "Layered Monolith", "IoC Container", "Dependency Injection", "JdbcTemplate"),
                "Intermediate",
                "To understand enterprise Java monolithic design patterns integrating Controller, Service, and Repository layers.",
                "200 OK -> Returned 5 books from embedded database via BookService layer",
                "/syllabus/spring/monolith",
                false,
                LocalDateTime.now()
        ));

        // Exp 13
        list.add(new SyllabusExperiment(
                "exp-13-spring-rest",
                13,
                "RESTful APIs With Spring Boot",
                "SPRING_BOOT",
                "REST",
                "Test and inspect production RESTful HTTP endpoints covering GET, POST, PUT, DELETE verbs and HTTP status codes.",
                "@RestController\n" +
                        "@RequestMapping(\"/api/books\")\n" +
                        "public class BookRestController {\n\n" +
                        "    @GetMapping(\"/{id}\")\n" +
                        "    public ResponseEntity<Book> getById(@PathVariable Long id) {\n" +
                        "        return service.findById(id)\n" +
                        "            .map(ResponseEntity::ok)\n" +
                        "            .orElseGet(() -> ResponseEntity.notFound().build());\n" +
                        "    }\n\n" +
                        "    @DeleteMapping(\"/{id}\")\n" +
                        "    public ResponseEntity<Void> deleteById(@PathVariable Long id) {\n" +
                        "        return service.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();\n" +
                        "    }\n" +
                        "}",
                "java",
                Arrays.asList("REST Endpoints", "HTTP Verbs", "JSON Serialization", "ResponseEntity", "Status Codes"),
                "Intermediate",
                "To design and interact with standard RESTful APIs following idempotent HTTP method conventions.",
                "GET /api/books/1 -> HTTP 200 OK | Payload: { id: 1, title: 'Java: The Complete Reference', price: 650.0 }",
                "/syllabus/spring/rest",
                false,
                LocalDateTime.now()
        ));

        return list;
    }
}
