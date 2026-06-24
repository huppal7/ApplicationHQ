package com.applicationhq.backend.application;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ApplicationService {

	private final ApplicationRepository repository;

	public ApplicationService(ApplicationRepository repository) {
		this.repository = repository;
	}

	public List<Application> findAll() {
		return repository.findAll();
	}

	public Application findById(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ApplicationNotFoundException(id));
	}

	public Application create(Application application) {
		application.setId(null);
		return repository.save(application);
	}

	public Application update(Long id, Application changes) {
		Application existing = findById(id);
		existing.setCompany(changes.getCompany());
		existing.setRole(changes.getRole());
		existing.setStatus(changes.getStatus());
		existing.setDateApplied(changes.getDateApplied());
		existing.setSource(changes.getSource());
		existing.setNotes(changes.getNotes());
		return repository.save(existing);
	}

	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new ApplicationNotFoundException(id);
		}
		repository.deleteById(id);
	}
}
