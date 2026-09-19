package com.meshnote;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MeshnoteApplication {

    private static final Logger log = LoggerFactory.getLogger(MeshnoteApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(MeshnoteApplication.class, args);
        log.info("""
                ========================================================================
                   __  __ _____ ____  _   _ _   _  ___ _____ _____ 
                  |  \\/  | ____/ ___|| | | | \\ | |/ _ \\_   _| ____|
                  | |\\/| |  _| \\___ \\| |_| |  \\| | | | || | |  _|  
                  | |  | | |___ ___) |  _  | |\\  | |_| || | | |___ 
                  |_|  |_|_____|____/|_| |_|_| \\_|\\___/ |_| |_____|
                
                  Offline Peer-to-Peer Academic Knowledge Network
                  Your classroom, connected locally.
                
                  -> Web Interface:  http://localhost:8080
                  -> H2 Console:     http://localhost:8080/h2-console
                ========================================================================
                """);
    }
}
