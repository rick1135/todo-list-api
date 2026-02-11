package com.rick1135.todo_list_api.service;

import com.rick1135.todo_list_api.model.Tarefa;
import com.rick1135.todo_list_api.repository.TarefaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarefaService {
    private final TarefaRepository repository;

    public TarefaService(TarefaRepository repository) {
        this.repository = repository;
    }

    public List<Tarefa> criar(Tarefa tarefa) {
        repository.save(tarefa);
        return listar();
    }

    public List<Tarefa> listar() {
        Sort sort=Sort.by("prioridade").descending().and(Sort.by("descricao").ascending());
        return repository.findAll(sort);
    }

    public List<Tarefa> atualizar(Tarefa tarefa) {
       repository.save(tarefa);
        return listar();
    }

    public List<Tarefa> deletar(Long id) {
        repository.deleteById(id);
        return listar();
    }
}
