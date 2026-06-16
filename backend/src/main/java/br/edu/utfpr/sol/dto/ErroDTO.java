package br.edu.utfpr.sol.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErroDTO(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path,
    Map<String, String> validationErrors
) {
}
