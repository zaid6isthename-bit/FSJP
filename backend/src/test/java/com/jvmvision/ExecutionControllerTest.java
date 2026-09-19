package com.jvmvision;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jvmvision.dto.RunCodeRequest;
import com.jvmvision.dto.ValidateCodeRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ExecutionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testValidateValidCode() throws Exception {
        ValidateCodeRequest req = new ValidateCodeRequest("int x = 10; int y = 20;");
        mockMvc.perform(post("/api/execution/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.valid").value(true));
    }

    @Test
    void testRunCodeAndRetrieveTrace() throws Exception {
        String code = "class Main {\n" +
                      "    public static void main(String[] args) {\n" +
                      "        int a = 5;\n" +
                      "        int b = 10;\n" +
                      "        int c = a + b;\n" +
                      "        System.out.println(\"Total: \" + c);\n" +
                      "    }\n" +
                      "}";

        RunCodeRequest req = new RunCodeRequest(code, "Addition Demo");

        mockMvc.perform(post("/api/execution/run")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.events", hasSize(greaterThan(3))));
    }

    @Test
    void testGetExamplesEndpoint() throws Exception {
        mockMvc.perform(get("/api/examples"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(5))));
    }
}
