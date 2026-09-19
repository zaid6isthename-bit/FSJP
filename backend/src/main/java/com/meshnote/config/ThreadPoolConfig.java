package com.meshnote.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

@Configuration
public class ThreadPoolConfig {

    @Bean(name = "p2pServerExecutor")
    public ExecutorService p2pServerExecutor() {
        return Executors.newFixedThreadPool(10, r -> {
            Thread t = new Thread(r, "Meshnote-P2P-Worker");
            t.setDaemon(true);
            return t;
        });
    }

    @Bean(name = "transferExecutor")
    public ExecutorService transferExecutor() {
        return Executors.newFixedThreadPool(5, r -> {
            Thread t = new Thread(r, "Meshnote-Transfer-Worker");
            t.setDaemon(true);
            return t;
        });
    }

    @Bean(name = "discoveryScheduler")
    public ScheduledExecutorService discoveryScheduler() {
        return Executors.newScheduledThreadPool(2, r -> {
            Thread t = new Thread(r, "Meshnote-Discovery");
            t.setDaemon(true);
            return t;
        });
    }
}
