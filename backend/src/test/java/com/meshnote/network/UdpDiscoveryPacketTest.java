package com.meshnote.network;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UdpDiscoveryPacketTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testDiscoveryPacketStructure() throws Exception {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("type", "HELLO");
        node.put("protocol", "MESHNOTE/1");
        node.put("nodeId", "node-12345");
        node.put("name", "Aarav Shah");
        node.put("deviceName", "Aarav-Laptop");
        node.put("division", "AI & ML");
        node.put("semester", 3);
        node.put("apiPort", 8080);
        node.put("p2pPort", 49000);
        node.put("sharedFileCount", 5);

        String json = objectMapper.writeValueAsString(node);
        JsonNode parsed = objectMapper.readTree(json);

        assertEquals("HELLO", parsed.path("type").asText());
        assertEquals("MESHNOTE/1", parsed.path("protocol").asText());
        assertEquals("node-12345", parsed.path("nodeId").asText());
        assertEquals("Aarav Shah", parsed.path("name").asText());
        assertEquals(3, parsed.path("semester").asInt());
        assertEquals(49000, parsed.path("p2pPort").asInt());
        assertEquals(5, parsed.path("sharedFileCount").asInt());
    }
}
