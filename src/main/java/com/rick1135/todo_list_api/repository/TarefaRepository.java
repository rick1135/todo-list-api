package com.rick1135.todo_list_api.repository;

import com.rick1135.todo_list_api.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
}
