package cl.floreria.floreria_api.dto;
import java.util.Locale;
import com.fasterxml.jackson.annotation.JsonProperty;

import cl.floreria.floreria_api.validation.ValidationRules;
import jakarta.validation.constraints.*;


public record RegisterRequest(

        @JsonProperty("full_name")
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
        String fullName,

        @NotBlank(message = "El correo es obligatorio")
        @Size(max = 100, message = "El correo no puede superar los 100 caracteres")
        @Pattern(regexp = ValidationRules.ALLOWED_EMAIL, message = ValidationRules.ALLOWED_EMAIL_MESSAGE)
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres")
        String password) {

    // Normalizacion 
    public RegisterRequest {
        if (email != null) {
            email = email.trim().toLowerCase(Locale.ROOT);
        }
    }
}