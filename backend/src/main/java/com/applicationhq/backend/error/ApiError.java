package com.applicationhq.backend.error;

import java.time.Instant;
import java.util.Map;

public record ApiError(
		String code,
		String message,
		Map<String, String> fieldErrors,
		Instant timestamp) {

	public static ApiError of(String code, String message) {
		return new ApiError(code, message, Map.of(), Instant.now());
	}

	public static ApiError withFieldErrors(String code, String message, Map<String, String> fieldErrors) {
		return new ApiError(code, message, fieldErrors, Instant.now());
	}
}
