package br.edu.utfpr.sol.dto;

import jakarta.validation.constraints.Size;

public record RejeicaoDTO(@Size(max = 500) String motivo) {
}
