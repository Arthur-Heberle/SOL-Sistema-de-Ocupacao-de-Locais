package br.edu.utfpr.sol.security;

import br.edu.utfpr.sol.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMinutes;

    public JwtService(
        @Value("${sol.jwt.secret}") String secret,
        @Value("${sol.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMinutes = expirationMinutes;
    }

    public TokenData generate(Usuario usuario) {
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(expirationMinutes);
        Date expiration = Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant());
        String token = Jwts.builder()
            .subject(usuario.getEmail())
            .claim("idUsuario", usuario.getId())
            .claim("nome", usuario.getNome())
            .claim("tipoUsuario", usuario.getTipoUsuario().name())
            .issuedAt(new Date())
            .expiration(expiration)
            .signWith(key)
            .compact();
        return new TokenData(token, expiresAt);
    }

    public String extractEmail(String token) {
        return claims(token).getSubject();
    }

    public boolean isValid(String token) {
        claims(token);
        return true;
    }

    private Claims claims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public record TokenData(String token, LocalDateTime expiresAt) {
    }
}
