package com.rick1135.todo_list_api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name="tarefas")
@Data
public class Tarefa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;
    private boolean concluida;

    @Enumerated(EnumType.STRING)
    private Prioridade prioridade;

    private LocalDate dataLimite;
}
