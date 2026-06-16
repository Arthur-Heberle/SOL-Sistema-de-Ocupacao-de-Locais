package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.Disciplina;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    List<Disciplina> findByProfessorId(Long professorId);

    List<Disciplina> findBySemestre(String semestre);
}
