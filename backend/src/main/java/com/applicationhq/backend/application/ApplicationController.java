package com.applicationhq.backend.application;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

	private final ApplicationService service;

	public ApplicationController(ApplicationService service) {
		this.service = service;
	}

	@GetMapping
	public List<Application> getAll() {
		return service.findAll();
	}

	@GetMapping("/{id}")
	public Application getById(@PathVariable Long id) {
		return service.findById(id);
	}

	@PostMapping
	public ResponseEntity<Application> create(@RequestBody Application application,
			UriComponentsBuilder uriBuilder) {
		Application created = service.create(application);
		URI location = uriBuilder.path("/api/applications/{id}")
				.buildAndExpand(created.getId())
				.toUri();
		return ResponseEntity.created(location).body(created);
	}

	@PutMapping("/{id}")
	public Application update(@PathVariable Long id, @RequestBody Application application) {
		return service.update(id, application);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}
