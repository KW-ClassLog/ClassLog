package org.example.backend.domain.accountLocal.repository;

import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountLocalRepository extends JpaRepository<AccountLocal, UUID> {
    Optional<AccountLocal> findByEmail(String email);
    Optional<AccountLocal> findById(UUID Id);
}
