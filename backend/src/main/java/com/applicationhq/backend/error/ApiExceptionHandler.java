package com.applicationhq.backend.error;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.applicationhq.backend.application.ApplicationNotFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(ApplicationNotFoundException.class)
	public ResponseEntity<ApiError> handleNotFound(ApplicationNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiError.of("APPLICATION_NOT_FOUND", ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> fieldErrors = new LinkedHashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error -> fieldErrors.putIfAbsent(
				error.getField(),
				error.getDefaultMessage()));

		return ResponseEntity.badRequest()
				.body(ApiError.withFieldErrors(
						"VALIDATION_ERROR",
						"Request validation failed",
						fieldErrors));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiError> handleUnreadableRequest(HttpMessageNotReadableException ex) {
		return ResponseEntity.badRequest()
				.body(ApiError.of(
						"INVALID_REQUEST",
						"Request body is invalid or contains unsupported values"));
	}
}
