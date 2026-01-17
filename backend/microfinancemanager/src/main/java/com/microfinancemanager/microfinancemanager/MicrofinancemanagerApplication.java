package com.microfinancemanager.microfinancemanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MicrofinancemanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicrofinancemanagerApplication.class, args);
		System.out.println("Microfinance Transaction Manager is running on http://localhost:8080");
	}

}
