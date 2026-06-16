package br.edu.utfpr.sol.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginDTO(
    @NotBlank @Email @Size(max = 80) String email,
    @NotBlank @Size(max = 255) String senha
) {
}
