package com.applicationhq.backend.application;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

	private final ApplicationRepository repository;

	public DataSeeder(ApplicationRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... args) {
		if (repository.count() > 0) {
			return;
		}

		repository.saveAll(List.of(
				new Application("Acme Corp", "Backend Engineer", "APPLIED",
						LocalDate.of(2026, 6, 1), "LinkedIn", "Referred by a friend."),
				new Application("Globex", "Full Stack Developer", "INTERVIEW",
						LocalDate.of(2026, 6, 10), "Company Website", "Phone screen scheduled."),
				new Application("Initech", "Software Engineer", "REJECTED",
						LocalDate.of(2026, 5, 20), "Indeed", "Position filled internally.")));
	}
}
