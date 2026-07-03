package com.applicationhq.backend.application;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "applications")
public class Application {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@NotBlank(message = "Company is required")
	private String company;

	@Column(nullable = false)
	@NotBlank(message = "Role is required")
	private String role;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	@NotNull(message = "Status is required")
	private ApplicationStatus status;

	private LocalDate dateApplied;

	private String source;

	@Column(length = 2000)
	@Size(max = 2000, message = "Notes must be 2000 characters or fewer")
	private String notes;

	@Column(updatable = false)
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	public Application() {
	}

	public Application(String company, String role, ApplicationStatus status, LocalDate dateApplied, String source,
			String notes) {
		this.company = company;
		this.role = role;
		this.status = status;
		this.dateApplied = dateApplied;
		this.source = source;
		this.notes = notes;
	}

	@PrePersist
	public void beforeCreate() {
		LocalDateTime now = LocalDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
	}

	@PreUpdate
	public void beforeUpdate() {
		LocalDateTime now = LocalDateTime.now();
		if (this.createdAt == null) {
			this.createdAt = now;
		}
		this.updatedAt = now;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(ApplicationStatus status) {
		this.status = status;
	}

	public LocalDate getDateApplied() {
		return dateApplied;
	}

	public void setDateApplied(LocalDate dateApplied) {
		this.dateApplied = dateApplied;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
}
